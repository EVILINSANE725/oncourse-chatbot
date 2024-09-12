import openai from "../services/openapiCaller.js";
import Patient from "../models/Patient.js";

import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";

export const handleChatProcessing = async (message) => {
  let model = {};
  let patient = await Patient.findByPk(message.patientId);
  const messages = message.messages;
  if (messages.length == 0) {
    messages.push({
      role: "system",
      content: createPatientTemplate(patient),
    });
  }
  let response = await getChatGptResponse(messages);

  let latestMessage = response.choices[0].message;
  messages.push(latestMessage);
  model.messages = messages;
  model.STAGE = "TEST";
  return { ...model };
};

const getChatGptResponse = async (messages, tools) => {
  const response = await openai.chat.completions.create({
    messages,
    model: "gpt-4",
    tools,
  });
  return response;
};

const createPatientTemplate = (patientDetails) => {
  const systemTemplate = `
  You are a senior AI doctor guiding a medical student in choosing and interpreting diagnostic tests. The interaction should focus on selecting appropriate tests based on patient symptoms and history. 

  Here are the patient's details:

  - **Age**: ${patientDetails.age}
  - **Gender**: ${patientDetails.gender}
  - **History**: ${patientDetails.history}
  - **Symptoms**: ${patientDetails.symptoms}
  - **Additional Info**: ${patientDetails.additionalInfo}

  Start By Providing Details Of Patient to Doctor . In last add a line Which Test Would You Perform ? Just Explain Details In First Prompt. Use Below Example

  **Most important** Do Not Give Hint To The Testee Just Tell About Patient And Let Him Guess

  - **Example** The patient is a 60-year-old male with a history of smoking. He presents with a cough and unintentional weight loss. These symptoms warrant further investigation. Let's go to the lab to diagnose further. What test should we run? 
  `;

  return systemTemplate;
};

const testParameters = z.object({
  is_correct: z.boolean("Is the answer given by the user correct"),
  no_of_attempts: z
    .number()
    .describe("Number of attempts taken by the user so far"),
  test_name: z.string().describe("Name of the correct test"),
  test_results: z
    .string()
    .describe("If the test is performed, what will be the result of the test"),
  next_prompt: z
    .string()
    .describe(
      "Prompt response from the AI doctor. If the answer is correct, always ask 'What differential diagnoses will you perform?'"
    ),
});

const testStageTemplate = () => {
  const systemPrompt = `
   You are a senior AI doctor guiding a medical student in choosing and interpreting diagnostic tests User Will Provide You The Test You Need To Interpret Weather Test Is Right Or Wrong And Give next_prompt and Other Parameters. 

   example of next promts
   **if answer is correct** Great choice, Doctor! Here are the results from the report:
   **if wrong answer** I understand your thinking, but a Complete Blood Count (CBC) might not give us the most relevant information for this case. \n\nRemember, the patient is presenting with a cough and weight loss, and has a history of smoking. These symptoms suggest we should focus on imaging the respiratory system.  Consider what test would allow us to visualize any potential abnormalities in the lungs. Would you like to suggest another test? 
  `;
  return systemPrompt;
};

const createTestStageTools = [
  zodFunction({ name: "dignostic_test", parameters: testParameters }),
];

const diagnosisStageTemplate = () => {
  const systemPrompt = `
   You are a senior AI doctor guiding a medical student in providing a diagnosis based on the patient's symptoms and test results. The user will give a diagnosis, and you will evaluate whether it's correct or incorrect. If the diagnosis is wrong, provide the user with a hint or further clarification, and ask for another diagnosis.

   Example prompts:
   **if the diagnosis is correct**: "Excellent diagnosis, Doctor! The patient's symptoms and test results suggest [correct diagnosis]. [game over message]"
   
   **if the diagnosis is incorrect**: "I see why you might think that, but based on the patient's test results and symptoms, I don't think that's the correct diagnosis. Consider the patient's history of smoking and weight loss—what could be causing these symptoms? Would you like to suggest another diagnosis?"
  `;
  return systemPrompt;
};

const diagnosisParameters = z.object({
  is_correct_dignoses: z
    .boolean()
    .describe("Is the diagnosis provided by the user correct"),
  no_of_attempts: z.number().describe("Number of attempts made by the user"),
  diagnosis: z.string().describe("The correct diagnosis"),
  next_prompt: z
    .string()
    .describe("If the answer is correct give Congratulations message as game is finished"),
});

const createDiagnosisStageTools = [
  zodFunction({ name: "diagnosis", parameters: diagnosisParameters }),
];



export const handleEvaluateTest = async (message) => {
  let model = {};
  let { messages } = message;

  messages[0] = { role: "system", content: testStageTemplate() };
  messages.push(message.message);

  try {
    const response = await getChatGptResponse(messages, createTestStageTools);

    const responseParams = JSON.parse(
      response.choices[0].message.tool_calls?.[0]?.function?.arguments
    );

    const nextMessage = {
      role: "assistant",
      content: responseParams.next_prompt,
      ...responseParams,
    };

    if (responseParams.is_correct) {
      nextMessage.points = getScoreBasedOnAttempts(
        responseParams.no_of_attempts
      );
      model.treatment_points = nextMessage.points
      model.STAGE = "DIAGNOSIS";
    } else if (responseParams.no_of_attempts >= 5) {
      model.STAGE = "GAME_OVER";
      model.REASON = "MAX_ATTEMPTS_REACHED";
    }

    messages.push(nextMessage);
    model.messages = messages;

    return model;
  } catch (error) {
    console.error("Error in evaluating test:", error);
    return { error: "An error occurred during the evaluation." };
  }
};

export const handleEvaluateDiagnosis = async (message) => {
  let model = {};
  let { messages } = message;

  messages[0] = { role: "system", content: diagnosisStageTemplate() };
  messages.push(message.message);

  try {
    const response = await getChatGptResponse(
      messages,
      createDiagnosisStageTools
    );

    const responseParams = JSON.parse(
      response.choices[0].message.tool_calls?.[0]?.function?.arguments
    );

    

    const nextMessage = {
      role: "assistant",
      content: responseParams.next_prompt,
      ...responseParams,
    };

    if (responseParams.is_correct_dignoses) {
      nextMessage.points = getScoreBasedOnAttempts(
        responseParams.no_of_attempts
      );
      model.treatment_points = nextMessage.points
      model.STAGE = "GAME_OVER";
      model.REASON = "WIN";
      model.diagnosis_points = nextMessage.points;
    } else if (responseParams.no_of_attempts >= 5) {
      model.STAGE = "GAME_OVER";
      model.REASON = "MAX_ATTEMPTS_REACHED";
    }

    messages.push(nextMessage);
    model.messages = messages;

    return model;
  } catch (error) {
    console.error("Error in evaluating diagnosis:", error);
    return { error: "An error occurred during the diagnosis evaluation." };
  }
};

const getScoreBasedOnAttempts = (attempts) => {
  let MAX_MARKS = 5;
  return MAX_MARKS - (attempts - 1);
};

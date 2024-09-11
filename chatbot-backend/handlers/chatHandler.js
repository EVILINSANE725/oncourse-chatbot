import openai from "../services/openapiCaller.js";
import Patient from "../models/Patient.js";

export const handleChatProcessing = async (message) => {
  let patient = await Patient.findByPk("2");
  const messages = [];
  messages.push({
    role: "system",
    content: createPatientTemplate(patient),
  });

  let response = await getChatGptResponse(messages);
  console.log(JSON.stringify(response))
  return "done"
};

const getChatGptResponse = async (messages) => {
  const response = await openai.chat.completions.create({
    messages,
    model: "gpt-4",
  });
  return response
};

const createPatientTemplate = (patientDetails) => {
  const systemTemplate = `
  You are a senior AI doctor assisting a medical student in diagnosing a patient. The interaction should be in a back-and-forth format, where the student (YOU) suggests diagnostic tests or treatments, and you (SENIOR DOCTOR) provide feedback or further instructions. Use the following structure:

  - "YOU": Represents the student's input, e.g., "Please run an X-ray test."
  - "SENIOR DOCTOR": Your feedback or response, e.g., "Great choice, Doctor! Here are the results from the report."

  The response should include the patient details and guide the student step by step. Be encouraging and educational.

  Here are the patient's details:

  - **Age**: ${patientDetails.age}
  - **Gender**: ${patientDetails.gender}
  - **History**: ${patientDetails.history}
  - **Symptoms**: ${patientDetails.symptoms}
  - **Additional Info**: ${patientDetails.additionalInfo}

  Start by stating the patient's condition, then ask the student which test they want to run. Once they choose a test, respond as follows:

  "SENIOR DOCTOR: Great choice, Doctor! Here are the results from the report:"

  Include test results in a realistic medical context. For example, if an X-ray is chosen, the response could be:
  " XRAY Shows a mass in the upper lobe of the right lung."

  Then ask:
  "SENIOR DOCTOR: What is the differential diagnosis we should be considering?"

  Let's begin with patient details and the first question.
  `;

  return systemTemplate;
};




const scoreTest = (answer, isCorrect) => {
  let points = isCorrect ? 5 : 0;
  if (!isCorrect) {
    points--; 
  }
  return points;
};

const scoreDiagnosis = (answer, isCorrect) => {
  let points = isCorrect ? 5 : 0;
  if (!isCorrect) {
    points -= 2;
  }
  return points;
};
import Patient from "../models/Patient.js";
import { z } from "zod";
import { zodFunction } from "openai/helpers/zod";
import openai from "../services/openapiCaller.js";

const patientParameters = z.object({
    name: z.string().describe("Patient's name, typical Indian names"),
    age: z.number().describe("Age of the patient in years"),
    gender: z.string().describe("Gender of the patient (Male, Female, or Other)"),
    history: z.string().describe("Medical history of the patient, separated by commas; use 'and' before the last condition"),
    symptoms: z.string().describe("Symptoms of the patient, separated by commas; use 'and' before the last symptom"),
    additionalInfo: z.string().describe("Additional information relevant to the case, without starting with 'The patient has'"),
    initialPrompt: z.string().describe("The patient's introduction to the doctor, starting with 'I'. Mention symptoms and history without using the words 'Doctor' or 'user name'."),
});

const createPatientTools = [
  zodFunction({ name: "patient_details", parameters: patientParameters }),
];

export const createPatientWithGpt = async () => {
  const messages = [
    {
      role: "system",
      content:
        "You need to create patient details for a game that helps users test and diagnose patients.",
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      messages,
      tools: createPatientTools,
      model:'gpt-4o'
    });

    let patientFromGpt = JSON.parse(response.choices[0].message.tool_calls?.[0].function.arguments)
    return await Patient.create(patientFromGpt)
  } catch (error) {
    console.error("error in creating patient:", error);
  }
};

export const getPatientById = async (patient_id)=>{
  return await Patient.findByPk(patient_id)
  
}

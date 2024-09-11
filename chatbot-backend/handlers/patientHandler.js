import Patient from "../models/Patient.js";
import { z } from "zod";
import openai from "../services/openapiCaller.js";
import { zodFunction } from "openai/helpers/zod";
// import OpenAI from "openai";

const patientParameters = z.object({
  name: z.string().describe("Name of The Patient Indian Names"),
  age: z.number().describe("Age of The Patient"),
  gender: z.string().describe("Gender Of The Patient"),
  history: z.string().describe("Medical History Of The Patient, comma separated use and For Last one"),
  symptoms: z.string().describe("Symptoms Of The Patient, comma separated use and For Last one"),
  additionalInfo: z.string().describe("Additional Information Without using word patient has "),
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
      model:'gpt-4o-mini'
    });

    let patientFromGpt = JSON.parse(response.choices[0].message.tool_calls?.[0].function.arguments)
    return await Patient.create(patientFromGpt)
  } catch (error) {
    console.error("error in creating patient:", error);
  }
};

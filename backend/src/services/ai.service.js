const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = {
    type: "OBJECT",
    properties: {
        matchScore: {
            type: "INTEGER",
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description"
        },
        title: {
            type: "STRING",
            description: "The title of the job for which the interview report is generated"
        },
        technicalQuestions: {
            type: "ARRAY",
            description: "Technical questions that can be asked in the interview along with their intention",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The technical question asked in the interview" },
                    intention: { type: "STRING", description: "The intention of the interviewer behind asking this question" },
                    answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behaviourQuestions: {
            type: "ARRAY",
            description: "Behavioral questions that can be asked in the interview along with their intention",
            items: {
                type: "OBJECT",
                properties: {
                    question: { type: "STRING", description: "The behavioral question asked in the interview" },
                    intention: { type: "STRING", description: "The intention of the interviewer behind asking this question" },
                    answer: { type: "STRING", description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillgap: {
            type: "ARRAY",
            description: "List of skills gap in the candidate's profile along with their severity",
            items: {
                type: "OBJECT",
                properties: {
                    skills: { type: "STRING", description: "The skill which the candidate is lacking" },
                    severity: { 
                        type: "STRING", 
                        enum: ["low", "medium", "high"],
                        description: "The severity of the skill gap" 
                    }
                },
                required: ["skills", "severity"]
            }
        },
        preparationPlan: {
            type: "ARRAY",
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
            items: {
                type: "OBJECT",
                properties: {
                    day: { type: "INTEGER", description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: "STRING", description: "The main focus of this day in the preparation plan" },
                    tasks: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                        description: "List of tasks to be done on this day to follow the preparation plan"
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["matchScore", "title", "technicalQuestions", "behaviourQuestions", "skillgap", "preparationPlan"]
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
                    Resume: ${resume}
                    Self Description: ${selfDescription}
                    Job Description: ${jobDescription}
`
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    })
    return JSON.parse(response.text)
}

module.exports = generateInterviewReport
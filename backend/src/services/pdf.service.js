const PDFDocument = require("pdfkit")
const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

async function generateResumePdf({ resume, jobDescription, selfDescription }) {
    const prompt = `You are an expert resume writer and career coach.
Improve the following candidate's resume to match the target job description, utilizing the self description for additional achievements or context.

Original Resume:
${resume}

Target Job Description:
${jobDescription}

Self Description:
${selfDescription}

Please provide a highly professional, revised version of the resume. Organize it with standard sections (Contact, Summary, Experience, Skills, Education).
Do NOT include any introduction, conversational filler, markdown formatting (like \`\`\`markdown), or explanations. Output ONLY the resume text itself.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    })

    const improvedResumeText = response.text

    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 })
        const buffers = []

        doc.on("data", data => buffers.push(data))
        doc.on("end", () => resolve(Buffer.concat(buffers)))
        doc.on("error", err => reject(err))

        // Document Title
        doc.fontSize(20).fillColor("#1e293b").text("Revised & Optimized Resume", { align: "center" })
        doc.moveDown(1.5)

        // Write content
        doc.fontSize(10).fillColor("#334155").text(improvedResumeText, {
            align: "left",
            lineGap: 4
        })

        doc.end()
    })
}

module.exports = generateResumePdf

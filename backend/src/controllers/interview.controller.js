const { PDFParse } = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../model/interviewReport.model")
const generateResumePdf = require("../services/pdf.service")

async function generateInterviewController(req, res) {
    const resumeFile = req.file

    if (!resumeFile) {
        return res.status(400).json({ message: "Resume file is required" })
    }

    try {
        const parser = new PDFParse({ data: resumeFile.buffer })
        const parsedPdf = await parser.getText()
        const resumeContent = parsedPdf.text
        const { selfDescription, jobDescription } = req.body

        const interviewReportByAI = await generateInterviewReport({
            resume: resumeContent, 
            selfDescription,
            jobDescription
        })

        if (interviewReportByAI.skillgap && Array.isArray(interviewReportByAI.skillgap)) {
            interviewReportByAI.skillgap = interviewReportByAI.skillgap.map(gap => ({
                ...gap,
                severity: gap.severity ? gap.severity.toLowerCase() : 'medium'
            }))
        }

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription,
            jobDescription,  
            ...interviewReportByAI                                   
        }) 

        res.status(201).json({
            message: "interview report generated successfully",
            interviewReport
        })
    } catch (err) {
        console.error("Error generating interview report:", err)
        res.status(500).json({
            message: "Internal server error generating report",
            error: err.message
        })
    }
}

async function getInterviewReportById(req, res) {
    try {
        const { interviewId } = req.params
        const report = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })

        if (!report) {
            return res.status(404).json({ message: "Interview report not found" })
        }

        res.status(200).json({ report })
    } catch (err) {
        console.error("Error fetching report:", err)
        res.status(500).json({
            message: "Internal server error fetching report",
            error: err.message
        })
    }
}

async function getLatestInterviewReport(req, res) {
    try {
        const report = await interviewReportModel.findOne({ user: req.user.id })
            .sort({ _id: -1 })

        if (!report) {
            return res.status(404).json({ message: "No interview reports found. Please generate one first." })
        }

        res.status(200).json({ report })
    } catch (err) {
        console.error("Error fetching latest report:", err)
        res.status(500).json({
            message: "Internal server error fetching latest report",
            error: err.message
        })
    }
}
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "interview report not found"
            })
        }

        res.status(200).json({
            message: "interview report fetch successfully",
            interviewReport
        })
    } catch (err) {
        console.error("Error fetching report by ID:", err)
        res.status(500).json({
            message: "Internal server error fetching report",
            error: err.message
        })
    }
}
/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}
module.exports = { generateInterviewController, getInterviewReportById, getLatestInterviewReport,
    getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController
 }
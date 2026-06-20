import { useState } from "react";
import { useAuth } from "../../auth/hook/useauth";
import { useNavigate } from "react-router";
import { useRef } from "react";
import axios from "axios";
import "../style/home.scss";
import{useInterview} from '../hooks/useInterview.js'

const Home = () => {
    const { generateReport, reports } = useInterview()
    const resumeInputRef = useRef()      
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleClearFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setResumeFile(null);
        const fileInput = document.getElementById("resume");
        if (fileInput) fileInput.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile || !jobDescription || !selfDescription) {
            alert("Please fill in all fields and upload your resume.");
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await generateReport({
                jobDescription,
                selfDescription,
                resumeFile
            });

            if (data && data._id) {
                navigate(`/interview/${data._id}`);
            } else {
                alert("Failed to generate report. Please try again.");
            }
        } catch (error) {
            console.error("Error generating report:", error);
            alert("Failed to generate report.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className="home-layout">
            {/* Header Navbar */}
            <header className="navbar">
                <div className="nav-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="logo-text">Interview <span className="logo-accent">AI</span></span>
                </div>

                <div className="nav-profile">
                    <div className="user-info">
                        <span className="user-welcome">Welcome back,</span>
                        <span className="user-name">{user?.username || "Guest"}</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Sign Out">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </header>

            {/* Workspace Main Section */}
            <main className="home-workspace">
                <form onSubmit={handleSubmit} className="workspace-form">
                    {/* Left Panel - Job Description Editor */}
                    <div className="left-panel">
                        <div className="panel-header">
                            <div className="panel-title-group">
                                <span className="badge">Step 1</span>
                                <h2 className="panel-title">Target Job Description</h2>
                            </div>
                            <p className="panel-subtitle">Paste the detailed description or requirements of your target role</p>
                        </div>
                        <div className="textarea-wrapper">
                            <textarea
                                name="jobDescription"
                                id="jobDescription"
                                placeholder="Paste the job description details here... (e.g. responsibilities, key technologies, qualifications)"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                            <div className="textarea-footer">
                                <span>{jobDescription.length} characters</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Inputs & Actions */}
                    <div className="right-panel">
                        {/* Resume Upload Card */}
                        <div className="panel-card upload-card">
                            <div className="panel-title-group">
                                <span className="badge">Step 2</span>
                                <h3 className="card-title">Upload Resume</h3>
                            </div>
                            <p className="panel-subtitle">Upload your current resume so we can compare your experience</p>

                            <div className={`file-upload-container ${resumeFile ? 'has-file' : ''}`}>
                                <input ref={resumeInputRef}
                                    type="file"
                                    name="resume"
                                    id="resume"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden-file-input"
                                />
                                {!resumeFile ? (
                                    <label htmlFor="resume" className="file-dropzone">
                                        <div className="dropzone-icon-container">
                                            <svg className="upload-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="17 8 12 3 7 8"></polyline>
                                                <line x1="12" y1="3" x2="12" y2="15"></line>
                                            </svg>
                                        </div>
                                        <div className="dropzone-text">
                                            <span className="dropzone-cta">Select PDF Resume</span>
                                            <span className="dropzone-hint">Drag & drop or browse from device</span>
                                        </div>
                                    </label>
                                ) : (
                                    <div className="selected-file-badge">
                                        <div className="file-info">
                                            <svg className="pdf-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10 9 9 9 8 9"></polyline>
                                            </svg>
                                            <div className="file-meta">
                                                <span className="file-name">{resumeFile.name}</span>
                                                <span className="file-size">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                        </div>
                                        <button className="clear-file-btn" onClick={handleClearFile} title="Remove file">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Self Description Card */}
                        <div className="panel-card self-desc-card">
                            <div className="panel-title-group">
                                <span className="badge">Step 3</span>
                                <h3 className="card-title">Self Description</h3>
                            </div>
                            <p className="panel-subtitle">Highlight details not in your resume (e.g. career goals, specific accomplishments)</p>
                            <div className="textarea-wrapper">
                                <textarea
                                    name="selfDescription"
                                    id="selfDescription"
                                    placeholder="Describe your background, what makes you a good fit, or specific achievements you want to highlight..."
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Generate CTA Button */}
                        <button
                            type="submit"
                            className="generate-btn"
                            disabled={isSubmitting || !resumeFile || !jobDescription || !selfDescription}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    <span>Generating Analysis...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="sparkles-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                                    </svg>
                                    <span>Generate Interview Report</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Previous Reports Section */}
                <section className="previous-reports-section">
                    <div className="section-title-group">
                        <span className="badge">History</span>
                        <h3 className="section-title">Previous Interview Reports</h3>
                    </div>

                    {!reports || reports.length === 0 ? (
                        <p className="no-reports-message">No previous reports found. Generate your first report above!</p>
                    ) : (
                        <div className="reports-grid">
                            {reports.map((report) => (
                                <div key={report._id} className="report-card" onClick={() => navigate(`/interview/${report._id}`)}>
                                    <div className="report-card__header">
                                        <h4 className="report-card__title">{report.title || "Untitled Role"}</h4>
                                        {report.matchScore !== undefined && (
                                            <span className={`report-card__score ${report.matchScore >= 80 ? 'score-high' : report.matchScore >= 60 ? 'score-mid' : 'score-low'}`}>
                                                {report.matchScore}% Match
                                            </span>
                                        )}
                                    </div>
                                    <div className="report-card__footer">
                                        <span className="report-card__date">
                                            {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="report-card__action">
                                            View Details &rarr;
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Home;
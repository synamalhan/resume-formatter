import React from "react";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import ProjectSection from "./ProjectSection";
import "./ResumeForm.css";

export default function ResumeForm({ resumeData, setResumeData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split("\n").filter((s) => s.trim());
    setResumeData({ ...resumeData, skills });
  };

  return (
    <div className="resume-form">
      {/* Row 1: Personal Info | Summary */}
      <div className="form-row">
        <div className="form-column">
          <h2 className="section-title">👤 Personal Information</h2>
          <div className="form-grid">
            <input name="name" value={resumeData.name} onChange={handleChange} placeholder="Full Name" />
            <input name="email" value={resumeData.email} onChange={handleChange} placeholder="Email" />
            <input name="phone" value={resumeData.phone} onChange={handleChange} placeholder="Phone" />
            <input name="linkedin" value={resumeData.linkedin} onChange={handleChange} placeholder="LinkedIn" />
            <input name="github" value={resumeData.github} onChange={handleChange} placeholder="GitHub" />
            <input name="website" value={resumeData.website} onChange={handleChange} placeholder="Website" />
          </div>
        </div>
        <div className="form-column">
          <h2 className="section-title">📝 Summary</h2>
          <textarea
            name="summary"
            value={resumeData.summary}
            onChange={handleChange}
            placeholder="Professional summary"
            className="form-textarea"
          />
        </div>
      </div>

      {/* Row 2: Skills | Education */}
      <div className="form-row">
        <div className="form-column">
          <h2 className="section-title">🛠 Skills</h2>
          <textarea
            value={resumeData.skills.join("\n")}
            onChange={handleSkillsChange}
            placeholder="One skill per line"
            className="form-textarea"
          />
        </div>
        <div className="form-column">
          <h2 className="section-title">🎓 Education</h2>
          <EducationSection resumeData={resumeData} setResumeData={setResumeData} />
        </div>
      </div>

      {/* Row 3: Experience | Projects */}
      <div className="form-row">
        <div className="form-column">
          <h2 className="section-title">💼 Experience</h2>
          <ExperienceSection resumeData={resumeData} setResumeData={setResumeData} />
        </div>
        <div className="form-column">
          <h2 className="section-title">📁 Projects</h2>
          <ProjectSection resumeData={resumeData} setResumeData={setResumeData} />
        </div>
      </div>
    </div>
  );
}

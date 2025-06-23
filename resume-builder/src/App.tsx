import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ResumeForm from "./components/ResumeForm";
import PDFGenerator from "./components/PDFGenerator";

export default function App() {
  const [resumeData, setResumeData] = useState({
    name: "", email: "", phone: "", linkedin: "", github: "", website: "",
    summary: "", skills: [], education: [], experience: [], projects: [],
  });

  const [formatting, setFormatting] = useState({
    font: "Arial",
    fontSize: 11,
    spacing: 8,
  });

  return (
    <div style={{ display: "flex" }}>
      <Sidebar
        resumeData={resumeData}
        setResumeData={setResumeData}
        formatting={formatting}
        setFormatting={setFormatting}
      />
      <div style={{ marginLeft: "400px", padding: "20px", width: "100%" }}>
        <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <PDFGenerator data={resumeData} formatting={formatting} />
        </div>
      </div>
    </div>
  );
}

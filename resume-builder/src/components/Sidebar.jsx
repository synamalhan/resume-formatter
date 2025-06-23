// src/components/Sidebar.jsx
import React from "react";

export default function Sidebar({ resumeData, setResumeData, formatting, setFormatting }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const normalized = normalizeResumeData(parsed);
        setResumeData(normalized);
      } catch (error) {
        alert("Invalid JSON uploaded");
      }
    };
    reader.readAsText(file);
  };

  const normalizeResumeData = (data) => {
  const addOrderAndId = (entries = []) =>
    entries.map((entry, i) => ({
      ...entry,
      order: entry.order ?? i + 1,
      id: entry.id || crypto.randomUUID(),
    }));

  return {
    name: data.name || "",
    phone: data.phone || "",
    email: data.email || "",
    linkedin: data.linkedin || "",
    github: data.github || "",
    website: data.website || "",
    contact: data.contact || "",
    summary: data.summary || "",
    skills: data.skills || [],
    education: addOrderAndId(data.education),
    experience: addOrderAndId(data.experience),
    projects: addOrderAndId(data.projects),
  };
};


  const handleFormattingChange = (field, value) => {
    setFormatting({ ...formatting, [field]: value });
  };

  return (
    <div
      style={{
        width: "25%",
        padding: "20px",
        borderRight: "1px solid #ccc",
        backgroundColor: "#333",
        height: "100vh",
        boxSizing: "border-box",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2>📄 Resume Builder</h2>
      <h4>📤 Upload Resume (JSON)</h4>
      <input type="file" accept=".json" onChange={handleFileUpload} />

      <h4 style={{ marginTop: "24px" }}>🖋️ Formatting</h4>
      <label>Font</label>
      <select
        value={formatting.font}
        onChange={(e) => handleFormattingChange("font", e.target.value)}
      >
        <option value="Helvetica">Helvetica</option>
        <option value="Times-Roman">Times</option>
      </select>

      <br />
      <label>Font Size</label>
      <input
        type="range"
        min="8"
        max="16"
        value={formatting.fontSize}
        onChange={(e) => handleFormattingChange("fontSize", parseInt(e.target.value))}
      />
      <span>{formatting.fontSize}px</span>

      <br />
      <label>Line Spacing</label>
      <input
        type="range"
        min="4"
        max="20"
        value={formatting.spacing}
        onChange={(e) => handleFormattingChange("spacing", parseInt(e.target.value))}
      />
      <span>{formatting.spacing}px</span>
    </div>
  );
}

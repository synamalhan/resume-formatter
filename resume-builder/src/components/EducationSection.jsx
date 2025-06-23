// src/components/EducationSection.jsx
import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function EducationSection({ resumeData, setResumeData }) {
  // Assign unique IDs to entries
  const ensureIds = (items) =>
    items.map((item) => ({
      ...item,
      id: item.id || crypto.randomUUID(),
    }));

  useEffect(() => {
    let updated = ensureIds(resumeData.education || []);
    // If empty, initialize with one entry
    if (updated.length === 0) {
      updated = [
        {
          id: crypto.randomUUID(),
          order: 1,
          university: "",
          degree: "",
          gpa: "",
          grad: "",
          awards: "",
        },
      ];
    }
    if (JSON.stringify(updated) !== JSON.stringify(resumeData.education)) {
      setResumeData({ ...resumeData, education: updated });
    }
  }, []);

  const handleChange = (index, field, value) => {
    const newEdu = [...resumeData.education];
    newEdu[index][field] = value;
    setResumeData({ ...resumeData, education: newEdu });
  };

  const handleAdd = () => {
    const newEdu = {
      id: crypto.randomUUID(),
      order: resumeData.education.length + 1,
      university: "",
      degree: "",
      gpa: "",
      grad: "",
      awards: "",
    };
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, newEdu],
    });
  };

  const handleRemove = (index) => {
    const newEdu = resumeData.education.filter((_, i) => i !== index);
    setResumeData({ ...resumeData, education: newEdu });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(resumeData.education);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setResumeData({ ...resumeData, education: reordered });
  };

  return (
    <div>
      <button onClick={handleAdd}>➕ Add Education</button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="education">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {resumeData.education.map((edu, index) => (
                <Draggable key={edu.id} draggableId={edu.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        border: "1px solid #ccc",
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 6,
                        ...provided.draggableProps.style,
                      }}
                    >
                      <div {...provided.dragHandleProps} style={{ cursor: "grab", marginBottom: 6 }}>
                        ☰ Drag
                      </div>
                      <details open={index === 0}>
                        <summary style={{ fontWeight: "bold", cursor: "pointer" }}>
                          🎓 {edu.university || `Education #${index + 1}`}
                        </summary>
                        <div style={{ marginTop: 10 }}>
                          <input
                            placeholder="University"
                            value={edu.university}
                            onChange={(e) => handleChange(index, "university", e.target.value)}
                          />
                          <input
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => handleChange(index, "degree", e.target.value)}
                          />
                          <input
                            placeholder="GPA"
                            value={edu.gpa}
                            onChange={(e) => handleChange(index, "gpa", e.target.value)}
                          />
                          <input
                            placeholder="Expected Graduation"
                            value={edu.grad}
                            onChange={(e) => handleChange(index, "grad", e.target.value)}
                          />
                          <input
                            placeholder="Awards"
                            value={edu.awards}
                            onChange={(e) => handleChange(index, "awards", e.target.value)}
                          />
                          <button onClick={() => handleRemove(index)} style={{ marginTop: 8 }}>
                            🗑 Remove
                          </button>
                        </div>
                      </details>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )} 
        </Droppable>
      </DragDropContext>
    </div>
  );
}

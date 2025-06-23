import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ExperienceSection({ resumeData, setResumeData }) {
  const ensureIds = (items) =>
    items.map((item) => ({
      ...item,
      id: item.id || crypto.randomUUID(),
    }));

  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    if (!resumeData.experience) return;
    const updated = ensureIds(resumeData.experience);
    const hasMissingIds = updated.some((item, i) => item.id !== resumeData.experience[i]?.id);
    if (hasMissingIds) {
      setResumeData((prev) => ({ ...prev, experience: updated }));
    }
  }, []);

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(resumeData.experience);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setResumeData({ ...resumeData, experience: reordered });
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...resumeData.experience];
    updated[index][field] = value;
    setResumeData({ ...resumeData, experience: updated });
  };

  const addExperience = () => {
    const newItem = {
      id: crypto.randomUUID(),
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      ongoing: false,
      bullets: [""],
    };
    setResumeData({
      ...resumeData,
      experience: [...(resumeData.experience || []), newItem],
    });
  };

  const removeExperience = (index) => {
    const filtered = resumeData.experience.filter((_, i) => i !== index);
    const updated = ensureIds(filtered);
    setResumeData({ ...resumeData, experience: updated });
  };

  return (
    <div>
      <button onClick={addExperience}>➕ Add Experience</button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="experience">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {resumeData.experience.map((exp, index) => (
                <Draggable key={exp.id} draggableId={exp.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        padding: 10,
                        marginBottom: 10,
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        ...provided.draggableProps.style,
                      }}
                    >
                      <div
                        {...provided.dragHandleProps}
                        style={{ cursor: "grab", marginBottom: 8 }}
                      >
                        ☰ Drag
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong>{exp.title || "(Untitled Experience)"}</strong>
                        <button onClick={() => toggleCollapse(exp.id)} style={{ fontSize: "0.9em" }}>
                          {collapsed[exp.id] ? "🔽 Show" : "🔼 Hide"}
                        </button>
                      </div>
                      {!collapsed[exp.id] && (
                        <>
                          <input placeholder="Title" value={exp.title} onChange={(e) => handleFieldChange(index, "title", e.target.value)} />
                          <input placeholder="Company" value={exp.company} onChange={(e) => handleFieldChange(index, "company", e.target.value)} />
                          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                            <input
                              type="month"
                              value={exp.startDate}
                              onChange={(e) => handleFieldChange(index, "startDate", e.target.value)}
                            />
                            {!exp.ongoing && (
                              <input
                                type="month"
                                value={exp.endDate}
                                onChange={(e) => handleFieldChange(index, "endDate", e.target.value)}
                              />
                            )}
                            <label>
                              <input
                                type="checkbox"
                                checked={exp.ongoing}
                                onChange={(e) => handleFieldChange(index, "ongoing", e.target.checked)}
                              />
                              Ongoing
                            </label>
                          </div>
                          <textarea
                            placeholder="Bullets (separated by newline)"
                            value={(exp.bullets || []).join("\n")}
                            onChange={(e) => handleFieldChange(index, "bullets", e.target.value.split("\n"))}
                            style={{ marginTop: "8px" }}
                          />
                          <button onClick={() => removeExperience(index)} style={{ marginTop: "8px" }}>
                            🗑 Remove
                          </button>
                        </>
                      )}
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

import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ProjectSection({ resumeData, setResumeData }) {
  const ensureIds = (items) =>
    items.map((item) => ({
      ...item,
      id: item.id || crypto.randomUUID(),
    }));

  const [collapsed, setCollapsed] = useState({});

  useEffect(() => {
    const updated = ensureIds(resumeData.projects || []);
    if (updated.some((item, i) => item.id !== resumeData.projects[i]?.id)) {
      setResumeData({ ...resumeData, projects: updated });
    }
  }, []);

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(resumeData.projects);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setResumeData({ ...resumeData, projects: reordered });
  };

  const handleChange = (index, field, value) => {
    const updated = [...resumeData.projects];
    updated[index][field] = value;
    setResumeData({ ...resumeData, projects: updated });
  };

  const handleBulletsChange = (index, text) => {
    const bullets = text.split("\n").filter((b) => b.trim());
    handleChange(index, "bullets", bullets);
  };

  const handleAdd = () => {
    const newItem = {
      id: crypto.randomUUID(),
      title: "",
      stack: "",
      bullets: [],
    };
    setResumeData({
      ...resumeData,
      projects: [...(resumeData.projects || []), newItem],
    });
  };

  const handleRemove = (index) => {
    const filtered = resumeData.projects.filter((_, i) => i !== index);
    const updated = ensureIds(filtered);
    setResumeData({ ...resumeData, projects: updated });
  };

  return (
    <div>
      <button onClick={handleAdd}>➕ Add Project</button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {resumeData.projects.map((proj, index) => (
                <Draggable key={proj.id} draggableId={proj.id} index={index}>
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

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <strong>{proj.title || "(Untitled Project)"}</strong>
                        <button onClick={() => toggleCollapse(proj.id)} style={{ fontSize: "0.9em" }}>
                          {collapsed[proj.id] ? "🔽 Show" : "🔼 Hide"}
                        </button>
                      </div>

                      {!collapsed[proj.id] && (
                        <>
                          <input
                            placeholder="Project Title"
                            value={proj.title}
                            onChange={(e) => handleChange(index, "title", e.target.value)}
                            style={{ marginTop: 8, width: "100%" }}
                          />
                          <input
                            placeholder="Tech Stack"
                            value={proj.stack}
                            onChange={(e) => handleChange(index, "stack", e.target.value)}
                            style={{ marginTop: 8, width: "100%" }}
                          />
                          <textarea
                            placeholder="Bullet Points (one per line)"
                            value={(proj.bullets || []).join("\n")}
                            onChange={(e) => handleBulletsChange(index, e.target.value)}
                            style={{ marginTop: 8, width: "100%" }}
                          />
                          <button
                            onClick={() => handleRemove(index)}
                            style={{ marginTop: 8 }}
                          >
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

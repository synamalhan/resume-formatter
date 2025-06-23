// src/components/PDFGenerator.jsx
import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer";

const renderMarkdownText = (text) => {
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|[^*]+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const part = match[0];
    if (part.startsWith("**") && part.endsWith("**")) {
      parts.push(
        <Text style={{ fontWeight: "bold" }} key={parts.length}>
          {part.slice(2, -2)}
        </Text>
      );
    } else if (part.startsWith("*") && part.endsWith("*")) {
      parts.push(
        <Text style={{ fontStyle: "italic" }} key={parts.length}>
          {part.slice(1, -1)}
        </Text>
      );
    } else {
      parts.push(
        <Text key={parts.length}>
          {part}
        </Text>
      );
    }
  }

  return parts;
};

// Resume PDF content
const ResumePDF = ({ data, formatting }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontSize: formatting.fontSize || 10,
      fontFamily: formatting.font || "Helvetica",
      lineHeight: formatting.spacing ? formatting.spacing / 4 : 1.5,
    },
    section: { marginBottom: 0 },
    header: {
      fontSize: formatting.fontSize + 4 || 18,
      marginBottom: 2,
      textAlign: "center",
      fontWeight: "bold",
    },
    subheader: {
      fontSize: formatting.fontSize + 2 || 12,
      marginBottom: 0,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    text: { marginBottom: 0 },
    bullet: { marginLeft: 10, marginBottom: 0 },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>{data.name}</Text>
        <Text style={styles.text}>
          {data.phone} | {data.email} | {data.linkedin} | {data.github} | {data.website}
        </Text>

        <View style={styles.section}>
          <Text style={styles.subheader}>Summary</Text>
          <Text style={styles.text}>{data.summary}</Text>
        </View>

        <View style={styles.section}>
        <Text style={styles.subheader}>Skills</Text>
        {data.skills.map((skill, i) => (
            <Text key={i} style={styles.bullet}>
            {renderMarkdownText(skill)}
            </Text>
        ))}
        </View>


        <View style={styles.section}>
          <Text style={styles.subheader}>Education</Text>
          {data.education?.map((edu, i) => (
            <View key={i} style={{ marginBottom: 0 }}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>{edu.university}</Text> — {edu.degree}
              </Text>
              <Text style={styles.text}>GPA: {edu.gpa} | Graduation: {edu.grad}</Text>
              {edu.awards && <Text style={styles.text}>Awards: {edu.awards}</Text>}
            </View>
          ))}
        </View>

        <View style={styles.section}>
        <Text style={styles.subheader}>Experience</Text>
        {(data.experience || []).map((exp, i) => {
            const duration = `${exp.startDate || ""} - ${exp.ongoing ? "Present" : exp.endDate || ""}`;
            return (
            <View key={i} style={{ marginBottom: 0 }}>
                <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>{exp.title}</Text>{" | "}
                <Text style={{ fontStyle: "italic" }}>{exp.company}</Text>{" | "}
                {duration}
                </Text>
                {(exp.bullets || []).map((b, j) => (
                <Text key={j} style={styles.bullet}>• {b}</Text>
                ))}
            </View>
            );
        })}
        </View>



        <View style={styles.section}>
          <Text style={styles.subheader}>Projects</Text>
          {data.projects.map((proj, i) => (
            <View key={i} style={{ marginBottom: 0 }}>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>{proj.title}</Text> — {proj.stack}
              </Text>
              {proj.bullets?.map((b, j) => (
                <Text key={j} style={styles.bullet}>• {b}</Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

// PDF Generator Component with Toggle Button
const PDFGenerator = ({ data, formatting }) => {
  const [showPreview, setShowPreview] = useState(false);
  console.log("PDFGenerator data:", data);
    console.log("PDFGenerator formatting:", formatting);

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${data.name.replace(/\s+/g, "_") || "resume"}.json`;
    link.click();
  };

  return (
    <div style={{ marginTop: 30 }}>
      <button
        onClick={() => setShowPreview(!showPreview)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#444",
          color: "white",
          borderRadius: 4,
          border: "none",
          marginBottom: "12px",
        }}
      >
        {showPreview ? "🔽 Hide PDF Preview" : "🔍 Show PDF Preview"}
      </button>

      {showPreview && (
        <div
          style={{
            height: "600px",
            border: "1px solid #ddd",
            marginBottom: "20px",
          }}
        >
          <PDFViewer width="100%" height="100%">
            <ResumePDF data={data} formatting={formatting} />
          </PDFViewer>
        </div>
      )}

      <div style={{ display: "flex", gap: "10px" }}>
        <PDFDownloadLink
          document={<ResumePDF data={data} formatting={formatting} />}
          fileName={`${data.name.replace(/\s+/g, "_") || "resume"}.pdf`}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: 4,
            textDecoration: "none",
          }}
        >
          {({ loading }) => (loading ? "Preparing PDF..." : "📥 Download PDF")}
        </PDFDownloadLink>

        <button
          onClick={downloadJSON}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            borderRadius: 4,
            border: "none",
          }}
        >
          📄 Download JSON
        </button>
      </div>
    </div>
  );
};

export default PDFGenerator;

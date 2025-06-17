# 📄 Streamlit Resume Builder with PDF Export

A clean, no-fuss interface to **build, edit, organize, and export your resume** without the hassle of formatting issues or clunky document editors.

## ✨ Why This Exists

I always dreaded the process of updating my resume — messing with formatting, spacing, ordering, and layout in Word or LaTeX. This app was built as a better way to manage resume content:  
- No worrying about line breaks or alignment.  
- Just enter your details, adjust order, and export a clean, professional PDF.  
- Update JSON once and reuse forever.

## ⚙️ Features

- ✅ Easy form-based entry for:
    - Contact info
    - Summary
    - Skills
    - Education
    - Experience
    - Projects
- 🔢 Drag-like reordering with **manual order numbers**
- 🗑️ Remove any section entries with one click
- 📄 Real-time PDF generation and preview
- 📥 Export as **PDF** and **JSON** for easy reuse
- ✍️ Supports custom font, font size, and line spacing
- 🧠 Markdown-like formatting in summary and bullet points (`**bold**`, `*italic*`)

## 🛠️ Tech Stack

- [Streamlit](https://streamlit.io/) – UI and backend
- [fpdf](https://pyfpdf.github.io/fpdf2/) – PDF rendering
- [streamlit-pdf-viewer](https://github.com/streamlit-pdf-viewer/streamlit-pdf-viewer) – PDF preview widget
- Python 3.8+

## 🚀 Getting Started

```bash
git clone https://github.com/synamalhan/resume-formatter.git
cd resume-builder
pip install -r requirements.txt
streamlit run app.py
```

## 📁 JSON Resume Format

You can load and save resumes in JSON format to make versioning and reuse easier. The format supports:

```json
{
    "name": "Your Name",
    "summary": "Short summary",
    "skills": ["Python", "Swift", "React"],
    "education": [
        {
            "order": 1,
            "university": "Example University",
            "gpa": "3.9",
            "grad": "May 2025",
            "degree": "B.S. in Computer Science"
        }
    ],
    "experience": [
        {
            "order": 1,
            "title": "Software Intern",
            "company": "Apple",
            "dates": "June 2024 - August 2024",
            "bullets": ["Built native Swift tools", "Improved app performance by 30%"]
        }
    ],
    "projects": [
        {
            "order": 1,
            "title": "CareSketch",
            "stack": "Python, Streamlit, LLMs",
            "bullets": ["Built AI-powered care plan generator", "Integrated PDF export & validation"]
        }
    ]
}
```

## 📸 Preview

> *Include a screenshot or GIF here if you want to show the app in action.*

## 🧠 Inspiration

> “I hate updating my resume and keeping up with formatting and layout every time. This tool gives me a simpler interface where I don’t have to worry about spacing or structure — I just focus on the content.”

## 📃 License

MIT License © 2025 [Your Name]

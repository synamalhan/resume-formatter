import streamlit as st
from resume_template import generate_pdf
from streamlit_pdf_viewer import pdf_viewer
from io import BytesIO
import tempfile
from datetime import date
import json

def normalize_resume_data(data):
    def add_order(entries):
        for i, entry in enumerate(entries):
            entry["order"] = entry.get("order", i + 1)
        return entries

    return {
        "name": data.get("name", ""),
        "phone": data.get("phone", ""),
        "email": data.get("email", ""),
        "linkedin": data.get("linkedin", ""),
        "github": data.get("github", ""),
        "website": data.get("website", ""),
        "contact": data.get("contact", ""),
        "summary": data.get("summary", ""),
        "skills": data.get("skills", []),
        "education": add_order(data.get("education", [])),
        "experience": add_order(data.get("experience", [])),
        "projects": add_order(data.get("projects", [])),
    }

def experience_section(index, prefill_data):
    key_prefix = f"exp_{index}"
    data = prefill_data[index] if index < len(prefill_data) else {}

    with st.expander(f"Experience #{index + 1}"):
        order = st.number_input("Order", min_value=1, value=data.get("order", index + 1), key=f"{key_prefix}_order")
        title = st.text_input("Job Title", value=data.get("title", ""), key=f"{key_prefix}_title")
        company = st.text_input("Company", value=data.get("company", ""), key=f"{key_prefix}_company")

        col1, col2 = st.columns(2)
        with col1:
            start_date = st.date_input("Start Date", value=date.today(), key=f"{key_prefix}_start")
        with col2:
            ongoing = st.checkbox("Ongoing", key=f"{key_prefix}_ongoing")
            end_date = "Present" if ongoing else st.date_input("End Date", key=f"{key_prefix}_end").strftime("%b %Y")

        bullets_raw = st.text_area("Bullet Points (one per line)", value="\n".join(data.get("bullets", [])), key=f"{key_prefix}_bullets")
        bullets = [b.strip() for b in bullets_raw.splitlines() if b.strip()]

        return {
            "order": order,
            "title": title,
            "company": company,
            "dates": f"{start_date.strftime('%b %Y')} - {end_date}",
            "bullets": bullets
        }

def project_section(index, prefill_data):
    key_prefix = f"proj_{index}"
    data = prefill_data[index] if index < len(prefill_data) else {}

    with st.expander(f"Project #{index + 1}"):
        order = st.number_input("Order", min_value=1, value=data.get("order", index + 1), key=f"{key_prefix}_order")
        title = st.text_input("Project Title", value=data.get("title", ""), key=f"{key_prefix}_title")
        stack = st.text_input("Tech Stack", value=data.get("stack", ""), key=f"{key_prefix}_stack")

        bullets_raw = st.text_area("Bullet Points (one per line)", value="\n".join(data.get("bullets", [])), key=f"{key_prefix}_bullets")
        bullets = [b.strip() for b in bullets_raw.splitlines() if b.strip()]

        return {
            "order": order,
            "title": title,
            "stack": stack,
            "bullets": bullets
        }

def education_section(index, prefill_data):
    key_prefix = f"edu_{index}"
    data = prefill_data[index] if index < len(prefill_data) else {}

    with st.expander(f"Education #{index + 1}"):
        order = st.number_input("Order", min_value=1, value=data.get("order", index + 1), key=f"{key_prefix}_order")
        university = st.text_input("University", value=data.get("university", ""), key=f"{key_prefix}_univ")
        gpa = st.text_input("GPA", value=data.get("gpa", ""), key=f"{key_prefix}_gpa")
        grad = st.text_input("Expected Graduation", value=data.get("grad", ""), key=f"{key_prefix}_grad")
        degree = st.text_input("Degree", value=data.get("degree", ""), key=f"{key_prefix}_degree")
        awards = st.text_input("Awards (if any)", value=data.get("awards", ""), key=f"{key_prefix}_awards")

        return {
            "order": order,
            "university": university,
            "gpa": gpa,
            "grad": grad,
            "degree": degree,
            "awards": awards
        }

# --- Layout ---
st.title("📄 Resume Builder with Ordering")

# --- Sidebar ---
st.sidebar.header("📤 Upload Resume (JSON)")
uploaded_json = st.sidebar.file_uploader("Upload JSON", type="json")

if uploaded_json:
    uploaded_data = normalize_resume_data(json.load(uploaded_json))

    for k, v in uploaded_data.items():
        if k not in ["experience", "projects", "education"]:
            st.session_state[k] = v

    st.session_state["experience_data"] = uploaded_data.get("experience", [])
    st.session_state["projects_data"] = uploaded_data.get("projects", [])
    st.session_state["education_data"] = uploaded_data.get("education", [])
    if "remove_exp" not in st.session_state:
        st.session_state["remove_exp"] = set()
    if "remove_proj" not in st.session_state:
        st.session_state["remove_proj"] = set()
    if "remove_edu" not in st.session_state:
        st.session_state["remove_edu"] = set()


st.sidebar.header("🖋️ Formatting")
font = st.sidebar.selectbox("Font", ["Arial", "Helvetica", "Times"])
font_size = st.sidebar.slider("Font Size", 8, 16, 11)
spacing = st.sidebar.slider("Line Spacing", 4, 20, 8)

# --- Basic Info ---
name = st.text_input("Full Name", value=st.session_state.get("name", "SYNA MALHAN"))
phone = st.text_input("Phone", value=st.session_state.get("phone", ""))
email = st.text_input("Email", value=st.session_state.get("email", ""))
linkedin = st.text_input("LinkedIn", value=st.session_state.get("linkedin", ""))
github = st.text_input("GitHub", value=st.session_state.get("github", ""))
website = st.text_input("Website", value=st.session_state.get("website", ""))
contact = f"{phone} | [Email](mailto:{email}) | [LinkedIn]({linkedin}) | [GitHub]({github}) | [Website]({website})"
summary = st.text_area("Summary", value=st.session_state.get("summary", ""))
skills_raw = st.text_area("Skills (one per line)", value="\n".join(st.session_state.get("skills", [])))
skills = [s.strip() for s in skills_raw.splitlines() if s.strip()]

# --- Education ---
st.subheader("🎓 Education")
num_edu = st.number_input("Number of Education Entries", 1, 5, 1)
education_data = st.session_state.get("education_data", [])
education = []
for i in range(int(num_edu)):
    if i in st.session_state["remove_edu"]:
        continue
    edu_data = education_section(i, education_data)
    if st.button(f"🗑 Remove Education #{i+1}", key=f"remove_edu_{i}"):
        st.session_state["remove_edu"].add(i)
        st.experimental_rerun()
    education.append(edu_data)

# --- Experience ---
st.subheader("💼 Experience")
num_exps = st.number_input("Number of Experiences", 1, 10, 3)
experience_data = st.session_state.get("experience_data", [])
experience = []
for i in range(int(num_exps)):
    if i in st.session_state["remove_exp"]:
        continue
    exp_data = experience_section(i, experience_data)
    if st.button(f"🗑 Remove Experience #{i+1}", key=f"remove_exp_{i}"):
        st.session_state["remove_exp"].add(i)
        st.experimental_rerun()
    experience.append(exp_data)


# --- Projects ---
st.subheader("📁 Projects")
num_projs = st.number_input("Number of Projects", 1, 15, 3)
project_data = st.session_state.get("projects_data", [])
projects = []
for i in range(int(num_projs)):
    if i in st.session_state["remove_proj"]:
        continue
    proj_data = project_section(i, project_data)
    if st.button(f"🗑 Remove Project #{i+1}", key=f"remove_proj_{i}"):
        st.session_state["remove_proj"].add(i)
        st.experimental_rerun()
    projects.append(proj_data)

# --- Generate PDF ---
if st.button("Generate PDF"):
    data = {
        "name": name,
        "phone": phone,
        "email": email,
        "linkedin": linkedin,
        "github": github,
        "website": website,
        "contact": contact,
        "summary": summary,
        "skills": skills,
        "education": sorted(education, key=lambda x: x.get("order", 0)),
        "experience": sorted(experience, key=lambda x: x.get("order", 0)),
        "projects": sorted(projects, key=lambda x: x.get("order", 0)),
    }

    pdf_buffer = generate_pdf(data, font=font, font_size=font_size, spacing=spacing)

    st.download_button("📥 Download Resume (PDF)", data=pdf_buffer, file_name="resume.pdf", mime="application/pdf")
    st.download_button("📄 Download Resume (JSON)", data=json.dumps(data, indent=2), file_name="resume.json", mime="application/json")

    st.subheader("🖹 PDF Preview")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(pdf_buffer.getbuffer())
        tmp_path = tmp_file.name

    pdf_viewer(tmp_path, annotations=[])

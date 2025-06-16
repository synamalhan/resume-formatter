from io import BytesIO
from fpdf import FPDF
import re


class ResumePDF(FPDF):
    def __init__(self, font, spacing, font_size):
        super().__init__()
        self.font = font
        self.spacing = spacing
        self.font_size = font_size
        self.set_auto_page_break(auto=True, margin=8)
        self.set_margins(left=8, top=8, right=8)

        self.add_page()
        self.set_font(font, '', font_size)

    def section_title(self, title, font_size, spacing):
        self.set_font(self.font, 'B', font_size + 1)
        self.cell(0, spacing + 1, title, ln=True)

    def section_body(self, text, spacing, font_size):
        self.set_font(self.font, '', font_size)
        self.multi_cell(0, spacing, text)
        self.ln(0.5)

    def bullet_points(self, points, font_size, spacing):
        self.set_font(self.font, '', font_size)
        max_length = 500  # truncate bullets for safety

        for p in points:
            if not isinstance(p, str):
                continue
            p = p.strip()
            if not p:
                continue

            if len(p) > max_length:
                p = p[:max_length] + "..."

            # Split long unbreakable words
            safe_p = ' '.join([
                w if len(w) < 50 else ' '.join([w[i:i+50] for i in range(0, len(w), 50)])
                for w in p.split()
            ])

            try:
                self.multi_cell(0, spacing, f" -  {safe_p}")
            except Exception:
                self.multi_cell(0, spacing, " -  [Rendering Failed]")

        self.ln(0.5)

    def render_contact_line(self, contact_md, font, font_size, spacing):
        self.set_font(font, '', font_size)
        self.set_text_color(0, 0, 0)

        parts = [p.strip() for p in contact_md.split("|")]

        total_width = 0
        for part in parts:
            match = re.match(r'\[(.*?)\]\((.*?)\)', part)
            label = match.group(1) if match else part
            total_width += self.get_string_width(label) + 4

        page_width = self.w - self.l_margin - self.r_margin
        start_x = (page_width - total_width) / 2 + self.l_margin
        y = self.get_y()
        self.set_xy(start_x, y)

        for i, part in enumerate(parts):
            match = re.match(r'\[(.*?)\]\((.*?)\)', part)
            if match:
                label, url = match.groups()
                self.set_text_color(0, 0, 255)
                self.set_font('', 'U', font_size)
                self.write(spacing, label, link=url)
                self.set_font('', '', font_size)
                self.set_text_color(0, 0, 0)
            else:
                self.write(spacing, part)

            if i < len(parts) - 1:
                self.write(spacing, " | ")

    def render_markdown(self, text, spacing, font_size):
        patterns = [
            (r'\*\*(.*?)\*\*', 'B'),
            (r'\*(.*?)\*', 'I'),
            (r'_(.*?)_', 'I'),
        ]
        self.set_font(self.font, '', font_size)
        pos = 0
        for match in re.finditer(r'(\*\*.*?\*\*|\*.*?\*|_.*?_)', text):
            start, end = match.span()
            if start > pos:
                self.write(spacing, text[pos:start])
            raw = match.group(0)
            content = raw.strip("*_")
            fmt = next((f for p, f in patterns if re.match(p, raw)), '')
            self.set_font(self.font, fmt, font_size)
            self.write(spacing, content)
            self.set_font(self.font, '', font_size)
            pos = end
        if pos < len(text):
            self.write(spacing, text[pos:])
        self.ln(spacing)

    
def clean_text(text):
    if not isinstance(text, str):
        return text
    replacements = {
        '’': "'",
        '‘': "'",
        '“': '"',
        '”': '"',
        '–': '-',
        '—': '-',
        '…': '...',
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text.encode("ascii", errors="ignore").decode()

def generate_pdf(data, font="Arial", font_size=10, spacing=6):
    pdf = ResumePDF(font=font, font_size=font_size, spacing=spacing)

    def draw_divider():
        pdf.ln(spacing // 2)
        y = pdf.get_y()
        pdf.set_draw_color(180, 180, 180)
        pdf.line(10, y, 200, y)
        pdf.ln(spacing // 4)

    # Header
    pdf.set_font(font, 'B', font_size + 2)
    pdf.cell(0, spacing, data['name'], ln=True, align="C")

    pdf.set_font(font, '', font_size)
    pdf.render_contact_line(data['contact'], font, font_size, spacing)
    pdf.ln(spacing)

    # Summary
    pdf.section_title("SUMMARY", font_size, spacing)
    pdf.section_body(data['summary'], spacing - 1, font_size)
    draw_divider()

    # Education
    pdf.section_title("EDUCATION", font_size, spacing)
    for edu in data['education']:
        # First line: University | GPA: x | Expected Graduation: x
        pdf.set_font(font, 'B', font_size)
        university = clean_text(edu['university'])

        pdf.set_font(font, 'B', font_size)
        gpa_label = "**GPA:**"
        grad_label = "**Expected Graduation:**"

        pdf.set_font(font, '', font_size)
        gpa = clean_text(edu['gpa'])
        grad = clean_text(edu['grad'])

        # Create the full line as one string
        first_line = f"{university} | {gpa_label} {gpa} | {grad_label} {grad}"

                # First line (University | GPA: x | Expected Graduation: x)
        pdf.render_markdown(clean_text(first_line), spacing - 1, font_size)

        # Degree line (supports markdown)
        pdf.render_markdown(clean_text(edu['degree']), spacing - 1, font_size)

        # Awards (only render if present)
        if edu.get('awards'):
            pdf.render_markdown(f"_Awards_: {clean_text(edu['awards'])}", spacing - 1, font_size)

        pdf.ln((spacing - 1) // 2)
    draw_divider()


    # Skills (Markdown)
    pdf.section_title("SKILLS", font_size, spacing)
    for skill in data['skills']:
        pdf.render_markdown(skill, spacing - 1, font_size)
    draw_divider()

    # Experience
    pdf.section_title("PROFESSIONAL EXPERIENCE", font_size, spacing)
    for exp in data['experience']:
        # Title (Bold)
        pdf.set_font(font, 'B', font_size)
        pdf.write(spacing - 1, f"{exp['title']} |")

        # Company (Italic)
        pdf.set_font(font, 'I', font_size)
        pdf.write(spacing - 1, f" {exp['company']}")

        # Dates (Normal)
        pdf.set_font(font, '', font_size)
        pdf.write(spacing - 1, f" | {exp['dates']}")
        pdf.ln(spacing - 1)

        pdf.bullet_points(exp['bullets'], font_size, spacing - 1)

    draw_divider()

    # Projects
    pdf.section_title("PROJECTS", font_size, spacing)
    for proj in data['projects']:
        # Title (Bold)
        pdf.set_font(font, 'B', font_size)
        pdf.write(spacing - 1, proj['title'])

        # Stack (Normal)
        pdf.set_font(font, '', font_size)
        pdf.write(spacing - 1, f" | {proj['stack']}")
        pdf.ln(spacing - 1)

        pdf.bullet_points(proj['bullets'], font_size, spacing - 1)

    draw_divider()

    pdf_bytes = pdf.output(dest='S').encode('latin1')
    return BytesIO(pdf_bytes)

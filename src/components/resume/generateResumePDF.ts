import jsPDF from "jspdf";
import { TemplateType } from "./ResumeTemplates";

interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string;
}

type TemplateGenerator = (doc: jsPDF, data: ResumeData) => void;

const modernTemplate: TemplateGenerator = (doc, data) => {
  const { personalInfo, experiences, education, skills } = data;
  let yPos = 20;

  // Header with accent bar
  doc.setFillColor(79, 70, 229); // Primary color
  doc.rect(0, 0, 210, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text(personalInfo.name || "Your Name", 20, 22);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`, 20, 30);
  
  yPos = 50;
  doc.setTextColor(0, 0, 0);

  // Summary
  if (personalInfo.summary) {
    doc.setFillColor(243, 244, 246);
    doc.rect(15, yPos - 5, 180, 25, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(personalInfo.summary, 170);
    doc.text(summaryLines, 20, yPos + 3);
    yPos += 30;
  }

  // Experience
  if (experiences.some(exp => exp.company)) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text("EXPERIENCE", 20, yPos);
    doc.setDrawColor(79, 70, 229);
    doc.line(20, yPos + 2, 60, yPos + 2);
    yPos += 10;
    doc.setTextColor(0, 0, 0);

    experiences.forEach(exp => {
      if (exp.company) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(exp.position, 20, yPos);
        yPos += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text(`${exp.company} | ${exp.duration}`, 20, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        const descLines = doc.splitTextToSize(exp.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5 + 8;
      }
    });
  }

  // Education
  if (education.some(edu => edu.institution)) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text("EDUCATION", 20, yPos);
    doc.setDrawColor(79, 70, 229);
    doc.line(20, yPos + 2, 55, yPos + 2);
    yPos += 10;
    doc.setTextColor(0, 0, 0);

    education.forEach(edu => {
      if (edu.institution) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(edu.degree, 20, yPos);
        yPos += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`${edu.institution} | ${edu.year}`, 20, yPos);
        yPos += 8;
      }
    });
  }

  // Skills
  if (skills) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(79, 70, 229);
    doc.text("SKILLS", 20, yPos);
    doc.setDrawColor(79, 70, 229);
    doc.line(20, yPos + 2, 45, yPos + 2);
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const skillsLines = doc.splitTextToSize(skills, 170);
    doc.text(skillsLines, 20, yPos);
  }
};

const classicTemplate: TemplateGenerator = (doc, data) => {
  const { personalInfo, experiences, education, skills } = data;
  let yPos = 25;

  // Classic centered header
  doc.setFontSize(24);
  doc.setFont("times", "bold");
  doc.text(personalInfo.name || "Your Name", 105, yPos, { align: "center" });
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text(`${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}`, 105, yPos, { align: "center" });
  yPos += 5;
  
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;

  // Summary
  if (personalInfo.summary) {
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("Professional Summary", 20, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    const summaryLines = doc.splitTextToSize(personalInfo.summary, 170);
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 5 + 8;
  }

  // Experience
  if (experiences.some(exp => exp.company)) {
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("Work Experience", 20, yPos);
    yPos += 6;

    experiences.forEach(exp => {
      if (exp.company) {
        doc.setFontSize(11);
        doc.setFont("times", "bold");
        doc.text(exp.position, 20, yPos);
        doc.setFont("times", "italic");
        doc.text(exp.duration, 190, yPos, { align: "right" });
        yPos += 5;
        doc.setFontSize(10);
        doc.text(exp.company, 20, yPos);
        yPos += 5;
        doc.setFont("times", "normal");
        const descLines = doc.splitTextToSize(exp.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5 + 6;
      }
    });
  }

  // Education
  if (education.some(edu => edu.institution)) {
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("Education", 20, yPos);
    yPos += 6;

    education.forEach(edu => {
      if (edu.institution) {
        doc.setFontSize(10);
        doc.setFont("times", "bold");
        doc.text(edu.degree, 20, yPos);
        doc.text(edu.year, 190, yPos, { align: "right" });
        yPos += 5;
        doc.setFont("times", "normal");
        doc.text(edu.institution, 20, yPos);
        yPos += 7;
      }
    });
  }

  // Skills
  if (skills) {
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("Skills", 20, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    const skillsLines = doc.splitTextToSize(skills, 170);
    doc.text(skillsLines, 20, yPos);
  }
};

const minimalTemplate: TemplateGenerator = (doc, data) => {
  const { personalInfo, experiences, education, skills } = data;
  let yPos = 30;

  // Minimal header
  doc.setFontSize(32);
  doc.setFont("helvetica", "light");
  doc.text(personalInfo.name || "Your Name", 20, yPos);
  yPos += 10;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`${personalInfo.email}  •  ${personalInfo.phone}  •  ${personalInfo.location}`, 20, yPos);
  yPos += 15;
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, yPos - 5, 190, yPos - 5);
  
  doc.setTextColor(0, 0, 0);

  // Summary
  if (personalInfo.summary) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(personalInfo.summary, 170);
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 5 + 12;
  }

  // Experience
  if (experiences.some(exp => exp.company)) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 120, 120);
    doc.text("EXPERIENCE", 20, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);

    experiences.forEach(exp => {
      if (exp.company) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(exp.position, 20, yPos);
        yPos += 5;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`${exp.company}  •  ${exp.duration}`, 20, yPos);
        yPos += 6;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        const descLines = doc.splitTextToSize(exp.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5 + 8;
      }
    });
  }

  // Education
  if (education.some(edu => edu.institution)) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 120, 120);
    doc.text("EDUCATION", 20, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);

    education.forEach(edu => {
      if (edu.institution) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(edu.degree, 20, yPos);
        yPos += 5;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`${edu.institution}  •  ${edu.year}`, 20, yPos);
        yPos += 8;
      }
    });
  }

  // Skills
  if (skills) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 120, 120);
    doc.text("SKILLS", 20, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const skillsLines = doc.splitTextToSize(skills, 170);
    doc.text(skillsLines, 20, yPos);
  }
};

const professionalTemplate: TemplateGenerator = (doc, data) => {
  const { personalInfo, experiences, education, skills } = data;
  
  // Dark header
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text(personalInfo.name || "Your Name", 20, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`${personalInfo.email}  |  ${personalInfo.phone}  |  ${personalInfo.location}`, 20, 32);
  
  let yPos = 55;
  doc.setTextColor(0, 0, 0);

  // Summary
  if (personalInfo.summary) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("PROFESSIONAL SUMMARY", 20, yPos);
    yPos += 7;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(personalInfo.summary, 170);
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 5 + 10;
  }

  // Two-column layout marker
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.5);

  // Experience
  if (experiences.some(exp => exp.company)) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("PROFESSIONAL EXPERIENCE", 20, yPos);
    doc.line(20, yPos + 2, 80, yPos + 2);
    yPos += 10;
    doc.setTextColor(0, 0, 0);

    experiences.forEach(exp => {
      if (exp.company) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(exp.position, 20, yPos);
        yPos += 5;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105);
        doc.text(`${exp.company} | ${exp.duration}`, 20, yPos);
        yPos += 6;
        doc.setTextColor(0, 0, 0);
        const descLines = doc.splitTextToSize(exp.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5 + 8;
      }
    });
  }

  // Education
  if (education.some(edu => edu.institution)) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("EDUCATION", 20, yPos);
    doc.line(20, yPos + 2, 50, yPos + 2);
    yPos += 10;
    doc.setTextColor(0, 0, 0);

    education.forEach(edu => {
      if (edu.institution) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(edu.degree, 20, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        doc.text(`${edu.institution} | ${edu.year}`, 20, yPos);
        yPos += 8;
      }
    });
  }

  // Skills
  if (skills) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("CORE COMPETENCIES", 20, yPos);
    doc.line(20, yPos + 2, 60, yPos + 2);
    yPos += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const skillsLines = doc.splitTextToSize(skills, 170);
    doc.text(skillsLines, 20, yPos);
  }
};

const creativeTemplate: TemplateGenerator = (doc, data) => {
  const { personalInfo, experiences, education, skills } = data;

  // Gradient-like sidebar
  doc.setFillColor(124, 58, 237); // Purple
  doc.rect(0, 0, 65, 297, "F");
  
  // Name in sidebar
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  
  // Split name if long
  const nameLines = doc.splitTextToSize(personalInfo.name || "Your Name", 55);
  doc.text(nameLines, 10, 30);
  
  let sideY = 55;
  
  // Contact in sidebar
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  if (personalInfo.email) {
    doc.text(personalInfo.email, 10, sideY);
    sideY += 6;
  }
  if (personalInfo.phone) {
    doc.text(personalInfo.phone, 10, sideY);
    sideY += 6;
  }
  if (personalInfo.location) {
    doc.text(personalInfo.location, 10, sideY);
    sideY += 10;
  }

  // Skills in sidebar
  if (skills) {
    sideY += 5;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SKILLS", 10, sideY);
    sideY += 8;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    const skillsLines = doc.splitTextToSize(skills, 50);
    doc.text(skillsLines, 10, sideY);
  }

  // Main content
  let yPos = 25;
  doc.setTextColor(0, 0, 0);

  // Summary
  if (personalInfo.summary) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text("ABOUT ME", 75, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(personalInfo.summary, 120);
    doc.text(summaryLines, 75, yPos);
    yPos += summaryLines.length * 5 + 12;
  }

  // Experience
  if (experiences.some(exp => exp.company)) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text("EXPERIENCE", 75, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);

    experiences.forEach(exp => {
      if (exp.company) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(exp.position, 75, yPos);
        yPos += 5;
        doc.setFontSize(9);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.text(`${exp.company} • ${exp.duration}`, 75, yPos);
        yPos += 6;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const descLines = doc.splitTextToSize(exp.description, 120);
        doc.text(descLines, 75, yPos);
        yPos += descLines.length * 5 + 8;
      }
    });
  }

  // Education
  if (education.some(edu => edu.institution)) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text("EDUCATION", 75, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);

    education.forEach(edu => {
      if (edu.institution) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(edu.degree, 75, yPos);
        yPos += 5;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(`${edu.institution} • ${edu.year}`, 75, yPos);
        yPos += 8;
      }
    });
  }
};

const templateGenerators: Record<TemplateType, TemplateGenerator> = {
  modern: modernTemplate,
  classic: classicTemplate,
  minimal: minimalTemplate,
  professional: professionalTemplate,
  creative: creativeTemplate,
};

export function generateResumePDF(template: TemplateType, data: ResumeData): void {
  const doc = new jsPDF();
  const generator = templateGenerators[template];
  generator(doc, data);
  doc.save(`resume-${template}.pdf`);
}

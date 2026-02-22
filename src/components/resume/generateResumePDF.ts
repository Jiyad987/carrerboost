import jsPDF from "jspdf";
import { TemplateType } from "./ResumeTemplates";
import type { ResumeData } from "./types";

export type { ResumeData };

type TemplateGenerator = (doc: jsPDF, data: ResumeData) => void;

// Helper to check for page overflow and add new page
function checkPageBreak(doc: jsPDF, yPos: number, margin: number = 30): number {
  if (yPos > 270) {
    doc.addPage();
    return margin;
  }
  return yPos;
}

function formatContact(data: ResumeData["personalInfo"]): string {
  return [data.email, data.phone, data.location].filter(Boolean).join("  |  ");
}

function formatLinks(data: ResumeData["personalInfo"]): string {
  return [data.linkedinUrl, data.portfolioUrl, data.githubUrl].filter(Boolean).join("  |  ");
}

function renderSkills(doc: jsPDF, data: ResumeData, xStart: number, yPos: number, maxWidth: number, headingColor: [number, number, number]): number {
  if (!data.skillCategories.some(s => s.items)) return yPos;
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...headingColor);
  doc.text("SKILLS", xStart, yPos);
  yPos += 7;
  doc.setTextColor(0, 0, 0);

  data.skillCategories.forEach(skill => {
    if (skill.items) {
      yPos = checkPageBreak(doc, yPos);
      if (skill.category) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${skill.category}:`, xStart, yPos);
        yPos += 5;
      }
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(skill.items, maxWidth);
      doc.text(lines, xStart, yPos);
      yPos += lines.length * 4 + 4;
    }
  });
  return yPos;
}

function renderProjects(doc: jsPDF, data: ResumeData, xStart: number, yPos: number, maxWidth: number, headingColor: [number, number, number]): number {
  if (!data.projects.some(p => p.name)) return yPos;

  yPos = checkPageBreak(doc, yPos);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...headingColor);
  doc.text("PROJECTS", xStart, yPos);
  yPos += 7;
  doc.setTextColor(0, 0, 0);

  data.projects.forEach(project => {
    if (project.name) {
      yPos = checkPageBreak(doc, yPos);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(project.name, xStart, yPos);
      if (project.technologies) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Tech: ${project.technologies}`, xStart, yPos + 4);
        doc.setTextColor(0, 0, 0);
        yPos += 4;
      }
      yPos += 5;
      if (project.description) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(project.description, maxWidth);
        doc.text(lines, xStart, yPos);
        yPos += lines.length * 4 + 2;
      }
      if (project.link) {
        doc.setFontSize(8);
        doc.setTextColor(79, 70, 229);
        doc.text(project.link, xStart, yPos);
        doc.setTextColor(0, 0, 0);
        yPos += 4;
      }
      yPos += 3;
    }
  });
  return yPos;
}

function renderCertifications(doc: jsPDF, data: ResumeData, xStart: number, yPos: number, headingColor: [number, number, number]): number {
  if (!data.certifications.some(c => c.name)) return yPos;

  yPos = checkPageBreak(doc, yPos);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...headingColor);
  doc.text("CERTIFICATIONS", xStart, yPos);
  yPos += 7;
  doc.setTextColor(0, 0, 0);

  data.certifications.forEach(cert => {
    if (cert.name) {
      yPos = checkPageBreak(doc, yPos);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(cert.name, xStart, yPos);
      yPos += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text([cert.organization, cert.year].filter(Boolean).join(" | "), xStart, yPos);
      yPos += 6;
    }
  });
  return yPos;
}

function renderLanguages(doc: jsPDF, data: ResumeData, xStart: number, yPos: number, headingColor: [number, number, number]): number {
  if (!data.languages.some(l => l.name)) return yPos;

  yPos = checkPageBreak(doc, yPos);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...headingColor);
  doc.text("LANGUAGES", xStart, yPos);
  yPos += 7;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const langText = data.languages.filter(l => l.name).map(l => `${l.name} (${l.proficiency})`).join("  •  ");
  doc.text(langText, xStart, yPos);
  yPos += 7;
  return yPos;
}

function renderAchievements(doc: jsPDF, data: ResumeData, xStart: number, yPos: number, headingColor: [number, number, number]): number {
  if (!data.achievements.some(a => a.description)) return yPos;

  yPos = checkPageBreak(doc, yPos);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...headingColor);
  doc.text("ACHIEVEMENTS", xStart, yPos);
  yPos += 7;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");

  data.achievements.forEach(a => {
    if (a.description) {
      yPos = checkPageBreak(doc, yPos);
      doc.text(`•  ${a.description}`, xStart, yPos);
      yPos += 5;
    }
  });
  return yPos;
}

function renderExperience(doc: jsPDF, data: ResumeData, xStart: number, yPos: number, maxWidth: number, headingColor: [number, number, number]): number {
  if (!data.experiences.some(exp => exp.company || exp.position)) return yPos;

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...headingColor);
  doc.text("EXPERIENCE", xStart, yPos);
  yPos += 7;
  doc.setTextColor(0, 0, 0);

  data.experiences.forEach(exp => {
    if (exp.company || exp.position) {
      yPos = checkPageBreak(doc, yPos);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(exp.position, xStart, yPos);
      yPos += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100, 100, 100);
      const meta = [exp.company, exp.location, `${exp.startDate} – ${exp.endDate}`].filter(Boolean).join("  •  ");
      doc.text(meta, xStart, yPos);
      yPos += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      if (exp.responsibilities) {
        const lines = exp.responsibilities.split("\n").filter(Boolean);
        lines.forEach(line => {
          yPos = checkPageBreak(doc, yPos);
          const cleaned = line.replace(/^[-•·]\s*/, "");
          const wrapped = doc.splitTextToSize(`•  ${cleaned}`, maxWidth);
          doc.setFontSize(9);
          doc.text(wrapped, xStart, yPos);
          yPos += wrapped.length * 4 + 1;
        });
      }
      yPos += 4;
    }
  });
  return yPos;
}

function renderEducation(doc: jsPDF, data: ResumeData, xStart: number, yPos: number, headingColor: [number, number, number]): number {
  if (!data.education.some(edu => edu.institution || edu.degree)) return yPos;

  yPos = checkPageBreak(doc, yPos);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...headingColor);
  doc.text("EDUCATION", xStart, yPos);
  yPos += 7;
  doc.setTextColor(0, 0, 0);

  data.education.forEach(edu => {
    if (edu.institution || edu.degree) {
      yPos = checkPageBreak(doc, yPos);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ""}`, xStart, yPos);
      yPos += 5;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const details = [edu.institution, edu.location, `${edu.startDate} – ${edu.endDate}`].filter(Boolean).join("  •  ");
      doc.text(details, xStart, yPos);
      yPos += 4;
      if (edu.cgpa) {
        doc.text(`CGPA: ${edu.cgpa}`, xStart, yPos);
        yPos += 4;
      }
      yPos += 3;
    }
  });
  return yPos;
}

// ===== TEMPLATE IMPLEMENTATIONS =====

const modernTemplate: TemplateGenerator = (doc, data) => {
  const { personalInfo } = data;
  const accent: [number, number, number] = [79, 70, 229];

  // Header
  doc.setFillColor(...accent);
  doc.rect(0, 0, 210, 38, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text(personalInfo.name || "Your Name", 20, 18);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(personalInfo.jobTitle, 20, 26);
  doc.setFontSize(8);
  doc.text(formatContact(personalInfo), 20, 33);
  const links = formatLinks(personalInfo);
  if (links) doc.text(links, 20, 37);

  let yPos = 48;
  doc.setTextColor(0, 0, 0);

  // Summary
  if (personalInfo.summary) {
    doc.setFillColor(243, 244, 246);
    doc.rect(15, yPos - 3, 180, 20, "F");
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(personalInfo.summary, 170);
    doc.text(lines, 20, yPos + 2);
    yPos += Math.max(20, lines.length * 4) + 8;
  }

  yPos = renderExperience(doc, data, 20, yPos, 170, accent);
  yPos = renderEducation(doc, data, 20, yPos, accent);
  yPos = renderSkills(doc, data, 20, yPos, 170, accent);
  yPos = renderProjects(doc, data, 20, yPos, 170, accent);
  yPos = renderCertifications(doc, data, 20, yPos, accent);
  yPos = renderLanguages(doc, data, 20, yPos, accent);
  renderAchievements(doc, data, 20, yPos, accent);
};

const classicTemplate: TemplateGenerator = (doc, data) => {
  const { personalInfo } = data;
  const heading: [number, number, number] = [0, 0, 0];

  doc.setFontSize(22);
  doc.setFont("times", "bold");
  doc.text(personalInfo.name || "Your Name", 105, 22, { align: "center" });
  doc.setFontSize(11);
  doc.setFont("times", "normal");
  doc.text(personalInfo.jobTitle, 105, 28, { align: "center" });
  doc.setFontSize(9);
  doc.text(formatContact(personalInfo), 105, 34, { align: "center" });
  const links = formatLinks(personalInfo);
  if (links) doc.text(links, 105, 39, { align: "center" });
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);

  let yPos = 50;

  if (personalInfo.summary) {
    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("Professional Summary", 20, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    const lines = doc.splitTextToSize(personalInfo.summary, 170);
    doc.text(lines, 20, yPos);
    yPos += lines.length * 5 + 8;
  }

  yPos = renderExperience(doc, data, 20, yPos, 170, heading);
  yPos = renderEducation(doc, data, 20, yPos, heading);
  yPos = renderSkills(doc, data, 20, yPos, 170, heading);
  yPos = renderProjects(doc, data, 20, yPos, 170, heading);
  yPos = renderCertifications(doc, data, 20, yPos, heading);
  yPos = renderLanguages(doc, data, 20, yPos, heading);
  renderAchievements(doc, data, 20, yPos, heading);
};

const minimalTemplate: TemplateGenerator = (doc, data) => {
  const { personalInfo } = data;
  const heading: [number, number, number] = [120, 120, 120];

  doc.setFontSize(30);
  doc.setFont("helvetica", "normal");
  doc.text(personalInfo.name || "Your Name", 20, 25);
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(personalInfo.jobTitle, 20, 32);
  doc.setFontSize(8);
  doc.text(formatContact(personalInfo), 20, 38);
  const links = formatLinks(personalInfo);
  if (links) doc.text(links, 20, 43);
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(20, 46, 190, 46);

  let yPos = 52;
  doc.setTextColor(0, 0, 0);

  if (personalInfo.summary) {
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(personalInfo.summary, 170);
    doc.text(lines, 20, yPos);
    yPos += lines.length * 4 + 10;
  }

  yPos = renderExperience(doc, data, 20, yPos, 170, heading);
  yPos = renderEducation(doc, data, 20, yPos, heading);
  yPos = renderSkills(doc, data, 20, yPos, 170, heading);
  yPos = renderProjects(doc, data, 20, yPos, 170, heading);
  yPos = renderCertifications(doc, data, 20, yPos, heading);
  yPos = renderLanguages(doc, data, 20, yPos, heading);
  renderAchievements(doc, data, 20, yPos, heading);
};

const professionalTemplate: TemplateGenerator = (doc, data) => {
  const { personalInfo } = data;
  const heading: [number, number, number] = [30, 41, 59];

  doc.setFillColor(...heading);
  doc.rect(0, 0, 210, 42, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(personalInfo.name || "Your Name", 20, 18);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(personalInfo.jobTitle, 20, 26);
  doc.setFontSize(8);
  doc.text(formatContact(personalInfo), 20, 33);
  const links = formatLinks(personalInfo);
  if (links) doc.text(links, 20, 38);

  let yPos = 52;
  doc.setTextColor(0, 0, 0);

  if (personalInfo.summary) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...heading);
    doc.text("PROFESSIONAL SUMMARY", 20, yPos);
    yPos += 7;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(personalInfo.summary, 170);
    doc.text(lines, 20, yPos);
    yPos += lines.length * 4 + 10;
  }

  yPos = renderExperience(doc, data, 20, yPos, 170, heading);
  yPos = renderEducation(doc, data, 20, yPos, heading);
  yPos = renderSkills(doc, data, 20, yPos, 170, heading);
  yPos = renderProjects(doc, data, 20, yPos, 170, heading);
  yPos = renderCertifications(doc, data, 20, yPos, heading);
  yPos = renderLanguages(doc, data, 20, yPos, heading);
  renderAchievements(doc, data, 20, yPos, heading);
};

const creativeTemplate: TemplateGenerator = (doc, data) => {
  const { personalInfo } = data;
  const accent: [number, number, number] = [124, 58, 237];
  const sidebarW = 65;

  // Sidebar
  doc.setFillColor(...accent);
  doc.rect(0, 0, sidebarW, 297, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  const nameLines = doc.splitTextToSize(personalInfo.name || "Your Name", 55);
  doc.text(nameLines, 8, 25);

  let sideY = 40;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(personalInfo.jobTitle, 8, sideY); sideY += 8;
  if (personalInfo.email) { doc.text(personalInfo.email, 8, sideY); sideY += 5; }
  if (personalInfo.phone) { doc.text(personalInfo.phone, 8, sideY); sideY += 5; }
  if (personalInfo.location) { doc.text(personalInfo.location, 8, sideY); sideY += 5; }
  if (personalInfo.linkedinUrl) { doc.text(personalInfo.linkedinUrl, 8, sideY); sideY += 5; }
  if (personalInfo.githubUrl) { doc.text(personalInfo.githubUrl, 8, sideY); sideY += 5; }
  sideY += 5;

  // Skills in sidebar
  if (data.skillCategories.some(s => s.items)) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SKILLS", 8, sideY); sideY += 7;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    data.skillCategories.forEach(skill => {
      if (skill.items) {
        if (skill.category) {
          doc.setFont("helvetica", "bold");
          doc.text(skill.category, 8, sideY); sideY += 5;
          doc.setFont("helvetica", "normal");
        }
        const lines = doc.splitTextToSize(skill.items, 50);
        doc.text(lines, 8, sideY);
        sideY += lines.length * 4 + 4;
      }
    });
  }

  // Languages in sidebar
  if (data.languages.some(l => l.name)) {
    sideY += 3;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("LANGUAGES", 8, sideY); sideY += 7;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    data.languages.forEach(l => {
      if (l.name) {
        doc.text(`${l.name} (${l.proficiency})`, 8, sideY);
        sideY += 5;
      }
    });
  }

  // Main content
  let yPos = 25;
  const mainX = sidebarW + 10;
  const mainW = 190 - mainX;
  doc.setTextColor(0, 0, 0);

  if (personalInfo.summary) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accent);
    doc.text("ABOUT ME", mainX, yPos); yPos += 7;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(personalInfo.summary, mainW);
    doc.text(lines, mainX, yPos);
    yPos += lines.length * 4 + 10;
  }

  yPos = renderExperience(doc, data, mainX, yPos, mainW, accent);
  yPos = renderEducation(doc, data, mainX, yPos, accent);
  yPos = renderProjects(doc, data, mainX, yPos, mainW, accent);
  yPos = renderCertifications(doc, data, mainX, yPos, accent);
  renderAchievements(doc, data, mainX, yPos, accent);
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

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ResumeData } from "./types";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface Props {
  onExtracted: (data: Partial<ResumeData>) => void;
}

function parseResumeText(text: string): Partial<ResumeData> {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const result: Partial<ResumeData> = {};

  // Try extracting email
  const emailMatch = text.match(/[\w.+-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/\+?[\d\s\-().]{7,20}/);
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/[\w-]+)/i);
  const githubMatch = text.match(/(?:github\.com\/[\w-]+)/i);

  // Try to get name from first non-empty line
  const name = lines[0] || "";

  result.personalInfo = {
    name,
    jobTitle: "",
    email: emailMatch?.[0] || "",
    phone: phoneMatch?.[0]?.trim() || "",
    location: "",
    linkedinUrl: linkedinMatch?.[0] || "",
    portfolioUrl: "",
    githubUrl: githubMatch?.[0] || "",
    summary: "",
  };

  // Section detection
  const sectionHeaders: Record<string, RegExp> = {
    summary: /^(professional\s*summary|summary|objective|about\s*me|profile)/i,
    experience: /^(experience|work\s*experience|professional\s*experience|employment)/i,
    education: /^(education|academic)/i,
    skills: /^(skills|core\s*competencies|technical\s*skills|strengths)/i,
    projects: /^(projects?|personal\s*projects?)/i,
    certifications: /^(certifications?|certificates?)/i,
    languages: /^(languages?)/i,
    achievements: /^(achievements?|awards?|honors?)/i,
  };

  const sections: Record<string, string[]> = {};
  let currentSection = "header";

  for (const line of lines.slice(1)) {
    let matched = false;
    for (const [key, regex] of Object.entries(sectionHeaders)) {
      if (regex.test(line)) {
        currentSection = key;
        matched = true;
        break;
      }
    }
    if (!matched) {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  // Summary
  if (sections.summary) {
    result.personalInfo.summary = sections.summary.join(" ");
  }

  // Experience - best effort
  if (sections.experience) {
    const expText = sections.experience.join("\n");
    result.experiences = [{
      id: "1",
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      responsibilities: expText,
    }];
  }

  // Education
  if (sections.education) {
    const eduText = sections.education;
    result.education = [{
      id: "1",
      institution: eduText[0] || "",
      degree: eduText[1] || "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      location: "",
      cgpa: "",
    }];
  }

  // Skills
  if (sections.skills) {
    result.skillCategories = [{
      id: "1",
      category: "Skills",
      items: sections.skills.join(", ").replace(/^[-•·]\s*/gm, ""),
    }];
  }

  // Languages
  if (sections.languages) {
    result.languages = sections.languages.map((l, i) => ({
      id: (i + 1).toString(),
      name: l.replace(/[-:•·].*/, "").trim(),
      proficiency: l.includes("Native") ? "Native" : l.includes("Fluent") ? "Fluent" : l.includes("Advanced") ? "Professional" : "Intermediate",
    }));
  }

  // Projects
  if (sections.projects) {
    result.projects = [{
      id: "1",
      name: "",
      description: sections.projects.join("\n"),
      technologies: "",
      link: "",
    }];
  }

  // Certifications
  if (sections.certifications) {
    result.certifications = sections.certifications.map((c, i) => ({
      id: (i + 1).toString(),
      name: c,
      organization: "",
      year: "",
      credentialUrl: "",
    }));
  }

  // Achievements
  if (sections.achievements) {
    result.achievements = sections.achievements.map((a, i) => ({
      id: (i + 1).toString(),
      description: a.replace(/^[-•·]\s*/, ""),
    }));
  }

  return result;
}

export function ResumePDFUpload({ onExtracted }: Props) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setFileName(file.name);

    try {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      const parsed = parseResumeText(fullText);
      onExtracted(parsed);
      toast({ title: "Resume Imported!", description: "Data extracted and auto-filled. Please review and edit as needed." });
    } catch (err) {
      console.error("PDF parse error:", err);
      toast({ title: "Error", description: "Failed to extract data from PDF.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center bg-primary/5 hover:bg-primary/10 transition-colors">
      <input ref={fileRef} type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
      <div className="flex flex-col items-center gap-3">
        {loading ? (
          <>
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Extracting data from {fileName}...</p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              {fileName ? <FileText className="w-7 h-7 text-primary" /> : <Upload className="w-7 h-7 text-primary" />}
            </div>
            <div>
              <p className="font-medium">{fileName ? `Imported: ${fileName}` : "Import Existing Resume"}</p>
              <p className="text-sm text-muted-foreground mt-1">Upload your PDF resume to auto-fill the form</p>
            </div>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" /> {fileName ? "Upload Another" : "Upload PDF"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

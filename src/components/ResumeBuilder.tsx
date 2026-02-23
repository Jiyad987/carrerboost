import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { TemplateType } from "@/components/resume/ResumeTemplates";
import { ResumePersonalInfo } from "@/components/resume/ResumePersonalInfo";
import { ResumeExperience } from "@/components/resume/ResumeExperience";
import { ResumeEducation } from "@/components/resume/ResumeEducation";
import { ResumeSkills } from "@/components/resume/ResumeSkills";
import { ResumeProjects } from "@/components/resume/ResumeProjects";
import { ResumeCertifications } from "@/components/resume/ResumeCertifications";
import { ResumeLanguages } from "@/components/resume/ResumeLanguages";
import { ResumeAchievements } from "@/components/resume/ResumeAchievements";
import { ResumePDFUpload } from "@/components/resume/ResumePDFUpload";
import { generateResumePDF } from "@/components/resume/generateResumePDF";
import type { PersonalInfo, Experience, Education, SkillCategory, Project, Certification, Language, Achievement, ResumeData } from "@/components/resume/types";

const defaultPersonalInfo: PersonalInfo = { name: "", jobTitle: "", email: "", phone: "", location: "", linkedinUrl: "", portfolioUrl: "", githubUrl: "", summary: "" };
const defaultExperience: Experience = { id: "1", company: "", position: "", location: "", startDate: "", endDate: "", responsibilities: "" };
const defaultEducation: Education = { id: "1", institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", location: "", cgpa: "" };
const defaultSkill: SkillCategory = { id: "1", category: "Technical Skills", items: "" };
const defaultProject: Project = { id: "1", name: "", description: "", technologies: "", link: "" };
const defaultCert: Certification = { id: "1", name: "", organization: "", year: "", credentialUrl: "" };
const defaultLang: Language = { id: "1", name: "", proficiency: "Fluent" };
const defaultAchievement: Achievement = { id: "1", description: "" };

export const ResumeBuilder = () => {
  const { toast } = useToast();
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(defaultPersonalInfo);
  const [experiences, setExperiences] = useState<Experience[]>([defaultExperience]);
  const [education, setEducation] = useState<Education[]>([defaultEducation]);
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([defaultSkill]);
  const [projects, setProjects] = useState<Project[]>([defaultProject]);
  const [certifications, setCertifications] = useState<Certification[]>([defaultCert]);
  const [languages, setLanguages] = useState<Language[]>([defaultLang]);
  const [achievements, setAchievements] = useState<Achievement[]>([defaultAchievement]);

  const handlePDFExtract = (data: Partial<ResumeData>) => {
    if (data.personalInfo) setPersonalInfo(prev => ({ ...prev, ...data.personalInfo }));
    if (data.experiences?.length) setExperiences(data.experiences);
    if (data.education?.length) setEducation(data.education);
    if (data.skillCategories?.length) setSkillCategories(data.skillCategories);
    if (data.projects?.length) setProjects(data.projects);
    if (data.certifications?.length) setCertifications(data.certifications);
    if (data.languages?.length) setLanguages(data.languages);
    if (data.achievements?.length) setAchievements(data.achievements);
  };

  const handleDownload = () => {
    const data: ResumeData = {
      personalInfo, experiences, education, skillCategories, projects, certifications, languages, achievements,
    };
    generateResumePDF(template, data);
    toast({ title: "Success!", description: "Your resume has been downloaded." });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Build Your ATS-Friendly Resume</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Create a professional resume optimized for Applicant Tracking Systems</p>
        </div>

        <div className="space-y-6">
          {/* PDF Upload */}
          <ResumePDFUpload onExtracted={handlePDFExtract} />

          {/* Form */}
          <Card className="p-4 sm:p-6 md:p-8 shadow-lg">
            <div className="space-y-8">
              <ResumePersonalInfo data={personalInfo} onChange={setPersonalInfo} />
              <ResumeExperience data={experiences} onChange={setExperiences} />
              <ResumeEducation data={education} onChange={setEducation} />
              <ResumeSkills data={skillCategories} onChange={setSkillCategories} />
              <ResumeProjects data={projects} onChange={setProjects} />
              <ResumeCertifications data={certifications} onChange={setCertifications} />
              <ResumeLanguages data={languages} onChange={setLanguages} />
              <ResumeAchievements data={achievements} onChange={setAchievements} />

              <Button onClick={handleDownload} size="lg" variant="gradient" className="w-full">
                <Download className="w-5 h-5 mr-2" />
                Download Resume (PDF)
              </Button>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

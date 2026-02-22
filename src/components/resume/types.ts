export interface PersonalInfo {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  portfolioUrl: string;
  githubUrl: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  location: string;
  cgpa: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  year: string;
  credentialUrl: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string;
}

export interface Achievement {
  id: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
}

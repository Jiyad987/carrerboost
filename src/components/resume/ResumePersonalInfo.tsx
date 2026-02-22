import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PersonalInfo } from "./types";
import { User, Mail, Phone, MapPin, Linkedin, Globe, Github } from "lucide-react";

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export function ResumePersonalInfo({ data, onChange }: Props) {
  const update = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg sm:text-xl font-semibold text-primary flex items-center gap-2">
        <User className="w-5 h-5" /> Personal Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" value={data.name} onChange={(e) => update("name", e.target.value)} placeholder="John Doe" />
        </div>
        <div>
          <Label htmlFor="jobTitle">Job Title / Headline *</Label>
          <Input id="jobTitle" value={data.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} placeholder="Senior Software Engineer" />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" type="email" className="pl-9" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="john@example.com" />
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="phone" className="pl-9" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 234 567 8900" />
          </div>
        </div>
        <div>
          <Label htmlFor="location">Location (City, Country)</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="location" className="pl-9" value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="New York, USA" />
          </div>
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="linkedin" className="pl-9" value={data.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} placeholder="linkedin.com/in/johndoe" />
          </div>
        </div>
        <div>
          <Label htmlFor="portfolio">Portfolio URL</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="portfolio" className="pl-9" value={data.portfolioUrl} onChange={(e) => update("portfolioUrl", e.target.value)} placeholder="johndoe.com" />
          </div>
        </div>
        <div>
          <Label htmlFor="github">GitHub URL</Label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="github" className="pl-9" value={data.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} placeholder="github.com/johndoe" />
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="summary">Professional Summary / Objective (3–5 lines)</Label>
        <Textarea id="summary" value={data.summary} onChange={(e) => update("summary", e.target.value)} placeholder="Write a brief professional summary highlighting your key strengths and career objectives..." rows={4} />
      </div>
    </div>
  );
}

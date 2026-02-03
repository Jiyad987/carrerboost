import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Download, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

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

export const ResumeBuilder = () => {
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
  });
  
  const [experiences, setExperiences] = useState<Experience[]>([
    { id: "1", company: "", position: "", duration: "", description: "" }
  ]);
  
  const [education, setEducation] = useState<Education[]>([
    { id: "1", institution: "", degree: "", year: "" }
  ]);
  
  const [skills, setSkills] = useState("");

  const addExperience = () => {
    setExperiences([...experiences, {
      id: Date.now().toString(),
      company: "",
      position: "",
      duration: "",
      description: ""
    }]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const addEducation = () => {
    setEducation([...education, {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      year: ""
    }]);
  };

  const removeEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(personalInfo.name || "Your Name", 105, 25, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const contactInfo = [personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(" | ");
    doc.text(contactInfo, 105, 33, { align: "center" });
    
    let yPosition = 45;
    
    // Summary
    if (personalInfo.summary) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Professional Summary", 20, yPosition);
      yPosition += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const summaryLines = doc.splitTextToSize(personalInfo.summary, 170);
      doc.text(summaryLines, 20, yPosition);
      yPosition += summaryLines.length * 5 + 10;
    }
    
    // Experience
    if (experiences.some(exp => exp.company || exp.position)) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Work Experience", 20, yPosition);
      yPosition += 8;
      
      experiences.forEach((exp) => {
        if (exp.company || exp.position) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text(`${exp.position}${exp.company ? ` at ${exp.company}` : ""}`, 20, yPosition);
          yPosition += 5;
          doc.setFontSize(9);
          doc.setFont("helvetica", "italic");
          doc.text(exp.duration, 20, yPosition);
          yPosition += 5;
          if (exp.description) {
            doc.setFont("helvetica", "normal");
            const descLines = doc.splitTextToSize(exp.description, 170);
            doc.text(descLines, 20, yPosition);
            yPosition += descLines.length * 4 + 5;
          }
          yPosition += 3;
        }
      });
    }
    
    // Education
    if (education.some(edu => edu.institution || edu.degree)) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Education", 20, yPosition);
      yPosition += 8;
      
      education.forEach((edu) => {
        if (edu.institution || edu.degree) {
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.text(`${edu.degree}${edu.institution ? ` - ${edu.institution}` : ""}`, 20, yPosition);
          yPosition += 5;
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text(edu.year, 20, yPosition);
          yPosition += 8;
        }
      });
    }
    
    // Skills
    if (skills) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Skills", 20, yPosition);
      yPosition += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const skillLines = doc.splitTextToSize(skills, 170);
      doc.text(skillLines, 20, yPosition);
    }
    
    doc.save(`${personalInfo.name || "resume"}.pdf`);
    toast({
      title: "Success!",
      description: "Your resume has been downloaded.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Build Your ATS-Friendly Resume</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Create a professional resume optimized for Applicant Tracking Systems</p>
        </div>

        <Card className="p-4 sm:p-6 md:p-8 shadow-lg">
          <div className="space-y-6 sm:space-y-8">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-primary">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={personalInfo.name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    placeholder="New York, NY"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                  placeholder="Write a brief professional summary..."
                  rows={4}
                />
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-primary">Work Experience</h3>
                <Button onClick={addExperience} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Add </span>Experience
                </Button>
              </div>
              {experiences.map((exp, index) => (
                <Card key={exp.id} className="p-4 mb-4 bg-muted/30">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Experience {index + 1}</h4>
                    {experiences.length > 1 && (
                      <Button
                        onClick={() => removeExperience(exp.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[index].company = e.target.value;
                        setExperiences(updated);
                      }}
                    />
                    <Input
                      placeholder="Position"
                      value={exp.position}
                      onChange={(e) => {
                        const updated = [...experiences];
                        updated[index].position = e.target.value;
                        setExperiences(updated);
                      }}
                    />
                  </div>
                  <Input
                    className="mt-3"
                    placeholder="Duration (e.g., Jan 2020 - Present)"
                    value={exp.duration}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[index].duration = e.target.value;
                      setExperiences(updated);
                    }}
                  />
                  <Textarea
                    className="mt-3"
                    placeholder="Describe your responsibilities and achievements..."
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...experiences];
                      updated[index].description = e.target.value;
                      setExperiences(updated);
                    }}
                    rows={3}
                  />
                </Card>
              ))}
            </div>

            {/* Education */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-primary">Education</h3>
                <Button onClick={addEducation} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Add </span>Education
                </Button>
              </div>
              {education.map((edu, index) => (
                <Card key={edu.id} className="p-4 mb-4 bg-muted/30">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium">Education {index + 1}</h4>
                    {education.length > 1 && (
                      <Button
                        onClick={() => removeEducation(edu.id)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index].institution = e.target.value;
                        setEducation(updated);
                      }}
                    />
                    <Input
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...education];
                        updated[index].degree = e.target.value;
                        setEducation(updated);
                      }}
                    />
                  </div>
                  <Input
                    className="mt-3"
                    placeholder="Year (e.g., 2020)"
                    value={edu.year}
                    onChange={(e) => {
                      const updated = [...education];
                      updated[index].year = e.target.value;
                      setEducation(updated);
                    }}
                  />
                </Card>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-primary">Skills</h3>
              <Textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="List your skills separated by commas (e.g., JavaScript, React, Node.js, Python)"
                rows={3}
              />
            </div>

            <Button onClick={generatePDF} size="lg" variant="gradient" className="w-full">
              <Download className="w-5 h-5 mr-2" />
              Download Resume (PDF)
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

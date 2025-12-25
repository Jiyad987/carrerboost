import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Mail, 
  Building, 
  FileText, 
  Sparkles,
  Clock,
  Users,
  Copy,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  description: string;
  skills: string[];
  postedDate: string;
}

interface HRInfo {
  hrEmail: string;
  hrName: string;
  recruiterEmail: string;
  companyEmail: string;
  linkedinTip: string;
  emailTemplate: string;
}

export const AIJobFinder = () => {
  const { toast } = useToast();
  
  // Job search state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    jobType: "",
    experience: "",
    remote: false,
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // HR Email state
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [hrInfo, setHrInfo] = useState<HRInfo | null>(null);
  const [isFindingHR, setIsFindingHR] = useState(false);

  // Cover letter state
  const [coverLetterData, setCoverLetterData] = useState({
    company: "",
    position: "",
    name: "",
    summary: "",
    skills: "",
  });
  const [coverLetter, setCoverLetter] = useState("");
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  const searchJobs = async () => {
    if (!searchQuery) {
      toast({
        title: "Enter a search query",
        description: "Please enter job title, skills, or keywords to search.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-job-search', {
        body: {
          query: searchQuery,
          filters,
          type: 'job-search',
        },
      });

      if (error) throw error;

      if (data?.result && Array.isArray(data.result)) {
        setJobs(data.result);
        toast({
          title: "Jobs Found!",
          description: `Found ${data.result.length} matching jobs.`,
        });
      } else {
        setJobs([]);
        toast({
          title: "No jobs found",
          description: "Try adjusting your search criteria.",
        });
      }
    } catch (error: any) {
      console.error('Job search error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to search jobs",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const findHREmails = async () => {
    if (!companyName) {
      toast({
        title: "Enter company name",
        description: "Please enter the company name to find HR contacts.",
        variant: "destructive",
      });
      return;
    }

    setIsFindingHR(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-job-search', {
        body: {
          query: { company: companyName, role: roleName },
          type: 'hr-email',
        },
      });

      if (error) throw error;

      if (data?.result) {
        setHrInfo(data.result);
        toast({
          title: "Contact Info Found!",
          description: "HR and company contact information retrieved.",
        });
      }
    } catch (error: any) {
      console.error('HR email error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to find HR contacts",
        variant: "destructive",
      });
    } finally {
      setIsFindingHR(false);
    }
  };

  const generateCoverLetter = async () => {
    if (!coverLetterData.company || !coverLetterData.position || !coverLetterData.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in company, position, and your name.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingCover(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-job-search', {
        body: {
          query: coverLetterData,
          type: 'cover-letter',
        },
      });

      if (error) throw error;

      if (data?.result?.coverLetter) {
        setCoverLetter(data.result.coverLetter);
        toast({
          title: "Cover Letter Generated!",
          description: "Your personalized cover letter is ready.",
        });
      }
    } catch (error: any) {
      console.error('Cover letter error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate cover letter",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            AI-Powered Job Finder
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Find jobs, get HR contacts, and generate personalized cover letters with AI
          </p>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Find Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="hr" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">HR Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="cover" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Cover Letter</span>
            </TabsTrigger>
          </TabsList>

          {/* Job Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="p-6 shadow-lg">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search">Job Title, Skills, or Keywords</Label>
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., Frontend Developer, React, Remote"
                    onKeyDown={(e) => e.key === 'Enter' && searchJobs()}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      placeholder="City or Remote"
                    />
                  </div>
                  <div>
                    <Label>Job Type</Label>
                    <Select
                      value={filters.jobType}
                      onValueChange={(value) => setFilters({ ...filters, jobType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Experience Level</Label>
                    <Select
                      value={filters.experience}
                      onValueChange={(value) => setFilters({ ...filters, experience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level</SelectItem>
                        <SelectItem value="mid">Mid Level</SelectItem>
                        <SelectItem value="senior">Senior Level</SelectItem>
                        <SelectItem value="lead">Lead/Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={searchJobs} variant="gradient" className="w-full" disabled={isSearching}>
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "Searching..." : "Search Jobs with AI"}
                </Button>
              </div>
            </Card>

            {jobs.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Found {jobs.length} Jobs</h3>
                {jobs.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-primary">{job.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.postedDate}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-foreground/80">{job.description}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills?.map((skill, i) => (
                              <Badge key={i} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge>{job.type}</Badge>
                          <Badge variant="outline">{job.experience}</Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* HR Email Tab */}
          <TabsContent value="hr" className="space-y-6">
            <Card className="p-6 shadow-lg">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input
                    id="company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Google, Microsoft, Startup Inc."
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role (Optional)</Label>
                  <Input
                    id="role"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g., Software Engineer, Product Manager"
                  />
                </div>
                <Button onClick={findHREmails} variant="gradient" className="w-full" disabled={isFindingHR}>
                  <Users className="w-4 h-4 mr-2" />
                  {isFindingHR ? "Finding Contacts..." : "Find HR & Company Contacts"}
                </Button>
              </div>
            </Card>

            {hrInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <Label className="text-sm text-muted-foreground">HR Contact</Label>
                        <p className="font-medium">{hrInfo.hrName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm bg-muted px-2 py-1 rounded">{hrInfo.hrEmail}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(hrInfo.hrEmail)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <Label className="text-sm text-muted-foreground">Recruiter Email</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm bg-muted px-2 py-1 rounded">{hrInfo.recruiterEmail}</code>
                          <Button size="sm" variant="ghost" onClick={() => copyToClipboard(hrInfo.recruiterEmail)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <Label className="text-sm text-muted-foreground">Company Email Format</Label>
                      <code className="text-sm bg-muted px-2 py-1 rounded block mt-1">{hrInfo.companyEmail}</code>
                    </div>
                    <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                      <Label className="text-sm text-accent">LinkedIn Tip</Label>
                      <p className="text-sm mt-1">{hrInfo.linkedinTip}</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-sm text-muted-foreground">Email Template</Label>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(hrInfo.emailTemplate)}>
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </Button>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">{hrInfo.emailTemplate}</pre>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* Cover Letter Tab */}
          <TabsContent value="cover" className="space-y-6">
            <Card className="p-6 shadow-lg">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coverCompany">Company Name</Label>
                    <Input
                      id="coverCompany"
                      value={coverLetterData.company}
                      onChange={(e) => setCoverLetterData({ ...coverLetterData, company: e.target.value })}
                      placeholder="Target Company"
                    />
                  </div>
                  <div>
                    <Label htmlFor="coverPosition">Position</Label>
                    <Input
                      id="coverPosition"
                      value={coverLetterData.position}
                      onChange={(e) => setCoverLetterData({ ...coverLetterData, position: e.target.value })}
                      placeholder="Job Title"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="coverName">Your Name</Label>
                  <Input
                    id="coverName"
                    value={coverLetterData.name}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, name: e.target.value })}
                    placeholder="Your Full Name"
                  />
                </div>
                <div>
                  <Label htmlFor="coverSummary">Brief Background</Label>
                  <Textarea
                    id="coverSummary"
                    value={coverLetterData.summary}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, summary: e.target.value })}
                    placeholder="Brief summary of your experience and what makes you a great fit..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="coverSkills">Key Skills</Label>
                  <Input
                    id="coverSkills"
                    value={coverLetterData.skills}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, skills: e.target.value })}
                    placeholder="e.g., React, Project Management, Data Analysis"
                  />
                </div>
                <Button onClick={generateCoverLetter} variant="gradient" className="w-full" disabled={isGeneratingCover}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGeneratingCover ? "Generating..." : "Generate Cover Letter"}
                </Button>
              </div>
            </Card>

            {coverLetter && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-6 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      Your Cover Letter
                    </h3>
                    <Button variant="outline" onClick={() => copyToClipboard(coverLetter)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-sans">{coverLetter}</pre>
                  </div>
                </Card>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

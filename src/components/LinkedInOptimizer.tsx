import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertTriangle, TrendingUp, Linkedin, FileText, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LinkedInContentBuilder } from "./LinkedInContentBuilder";

export const LinkedInOptimizer = () => {
  const { toast } = useToast();
  const [profileUrl, setProfileUrl] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("optimizer");

  const analyzeProfile = () => {
    if (!profileUrl) {
      toast({
        title: "Missing Information",
        description: "Please enter your LinkedIn profile URL.",
        variant: "destructive",
      });
      return;
    }

    // Simulate analysis
    setTimeout(() => {
      setAnalysis({
        score: 72,
        strengths: [
          "Professional profile photo present",
          "Headline includes relevant keywords",
          "Multiple work experiences listed",
          "Education section completed"
        ],
        improvements: [
          "Add a compelling background banner image",
          "Write a detailed 'About' section (aim for 3-5 paragraphs)",
          "Include specific achievements with metrics in experience descriptions",
          "Add relevant skills (aim for 50+ skills)",
          "Request recommendations from colleagues and managers",
          "Publish articles or posts to increase visibility",
          "Join and engage in industry-relevant groups",
          "Add certifications and courses to showcase continuous learning"
        ],
        tips: [
          "Use your headline strategically - include your role, key skills, and value proposition",
          "Optimize your profile URL to be professional and memorable",
          "Turn on 'Open to Work' if actively job hunting",
          "Engage with content regularly - like, comment, and share",
          "Use keywords throughout your profile that match your target roles",
          "Keep your profile updated with recent projects and achievements"
        ],
        keywords: [
          "Industry-specific technical skills",
          "Leadership and soft skills",
          "Certifications and tools you use",
          "Project outcomes and metrics",
          "Your unique value proposition"
        ],
        personalizedTips: [
          "Post 2-3 times per week to maintain visibility",
          "Share your insights on industry trends",
          "Comment meaningfully on others' posts",
          "Create original content showcasing your expertise",
          "Use storytelling to make posts engaging",
          "Add visuals to increase engagement by 2x",
          "Tag relevant people and companies",
          "Respond to comments on your posts within 24 hours"
        ]
      });

      toast({
        title: "Analysis Complete!",
        description: "See your LinkedIn optimization recommendations below.",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8 sm:mb-12 px-2">
          <div className="inline-flex items-center gap-2 bg-[#0077B5] text-white px-3 sm:px-4 py-2 rounded-lg mb-4">
            <Linkedin className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="text-sm sm:text-base font-semibold">LinkedIn Optimization Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Optimize Your LinkedIn Presence</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Profile optimization, content creation, and growth strategies</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="optimizer" className="px-2 sm:px-4">Profile</TabsTrigger>
            <TabsTrigger value="content" className="px-2 sm:px-4">Content</TabsTrigger>
            <TabsTrigger value="tips" className="px-2 sm:px-4">Growth</TabsTrigger>
          </TabsList>

          <TabsContent value="optimizer" className="mt-4 sm:mt-6">
            <Card className="p-4 sm:p-6 md:p-8 shadow-lg mb-6 sm:mb-8">
              <Label htmlFor="linkedinUrl" className="text-base sm:text-lg font-semibold mb-2 block">
                LinkedIn Profile URL
              </Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  id="linkedinUrl"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/in/your-profile"
                  className="flex-1"
                />
                <Button onClick={analyzeProfile} variant="gradient" className="w-full sm:w-auto">
                  Analyze
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Note: This tool provides general optimization tips based on best practices.
              </p>
            </Card>

            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card className="p-4 sm:p-6 md:p-8 shadow-lg bg-gradient-card">
                  <div className="text-center mb-4 sm:mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Profile Optimization Score</h3>
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0077B5] mb-4">
                      {analysis.score}%
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {analysis.score >= 80 ? "Excellent! Your profile is well-optimized." :
                       analysis.score >= 60 ? "Good start! Follow the tips below to improve further." :
                       "Your profile needs improvement. Follow our recommendations."}
                    </p>
                  </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="p-4 sm:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6 text-success" />
                      <h3 className="text-lg sm:text-xl font-semibold">What's Working</h3>
                    </div>
                    <ul className="space-y-2 sm:space-y-3">
                      {analysis.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-4 sm:p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-3 sm:mb-4">
                      <AlertTriangle className="w-5 sm:w-6 h-5 sm:h-6 text-warning" />
                      <h3 className="text-lg sm:text-xl font-semibold">Areas to Improve</h3>
                    </div>
                    <ul className="space-y-2 sm:space-y-3">
                      {analysis.improvements.slice(0, 4).map((improvement: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <Card className="p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-semibold">Tailored Keywords for Your Profile</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.map((keyword: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Include these keywords naturally throughout your profile to improve visibility in searches.
                  </p>
                </Card>

                <Card className="p-6 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-semibold">Detailed Optimization Tips</h3>
                  </div>
                  <div className="space-y-4">
                    {analysis.improvements.map((improvement: string, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="bg-accent/10 text-accent w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          {index + 1}
                        </div>
                        <p className="text-sm flex-1">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 shadow-lg bg-[#0077B5]/5 border-[#0077B5]/20">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Linkedin className="w-5 h-5 text-[#0077B5]" />
                    Pro Tips for LinkedIn Success
                  </h3>
                  <ul className="space-y-3">
                    {analysis.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[#0077B5] flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <LinkedInContentBuilder />
          </TabsContent>

          <TabsContent value="tips" className="mt-6">
            <div className="space-y-6">
              <Card className="p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  Personalized Growth Strategies
                </h3>
                <div className="space-y-4">
                  {analysis?.personalizedTips?.map((tip: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                      <div className="bg-accent/10 text-accent w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm flex-1 pt-1">{tip}</p>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-center py-8">
                      Analyze your profile first to get personalized growth tips
                    </p>
                  )}
                </div>
              </Card>

              <Card className="p-6 shadow-lg bg-accent/5 border-accent/20">
                <h3 className="text-lg font-semibold mb-4">Content Posting Best Practices</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Best times to post:</p>
                      <p className="text-muted-foreground">Tuesday-Thursday, 8-10 AM or 12-2 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Ideal post length:</p>
                      <p className="text-muted-foreground">1,300-2,000 characters for maximum engagement</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Content mix:</p>
                      <p className="text-muted-foreground">60% educational, 30% engaging, 10% promotional</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

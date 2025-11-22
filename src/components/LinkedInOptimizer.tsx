import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertTriangle, TrendingUp, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LinkedInOptimizer = () => {
  const { toast } = useToast();
  const [profileUrl, setProfileUrl] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);

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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#0077B5] text-white px-4 py-2 rounded-lg mb-4">
            <Linkedin className="w-5 h-5" />
            <span className="font-semibold">LinkedIn Profile Optimizer</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Optimize Your LinkedIn Profile</h2>
          <p className="text-muted-foreground">Get actionable insights to improve your LinkedIn presence</p>
        </div>

        <Card className="p-8 shadow-lg mb-8">
          <Label htmlFor="linkedinUrl" className="text-lg font-semibold mb-2 block">
            LinkedIn Profile URL
          </Label>
          <div className="flex gap-3">
            <Input
              id="linkedinUrl"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder="https://www.linkedin.com/in/your-profile"
              className="flex-1"
            />
            <Button onClick={analyzeProfile} variant="gradient">
              Analyze
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Note: This tool provides general optimization tips based on best practices.
          </p>
        </Card>

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8 shadow-lg bg-gradient-card">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Profile Optimization Score</h3>
                <div className="text-6xl font-bold text-[#0077B5] mb-4">
                  {analysis.score}%
                </div>
                <p className="text-sm text-muted-foreground">
                  {analysis.score >= 80 ? "Excellent! Your profile is well-optimized." :
                   analysis.score >= 60 ? "Good start! Follow the tips below to improve further." :
                   "Your profile needs improvement. Follow our recommendations."}
                </p>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                  <h3 className="text-xl font-semibold">What's Working</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                  <h3 className="text-xl font-semibold">Areas to Improve</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.improvements.slice(0, 4).map((improvement: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
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

            <Card className="p-6 shadow-lg bg-accent/5 border-accent/20">
              <h3 className="text-lg font-semibold mb-3">Next Steps</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Start with the highest-priority improvements listed above</li>
                <li>Update one section at a time to avoid overwhelming yourself</li>
                <li>Save your changes and check back weekly to track your progress</li>
                <li>Connect with professionals in your target industry</li>
                <li>Engage with content daily to increase your visibility</li>
              </ol>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

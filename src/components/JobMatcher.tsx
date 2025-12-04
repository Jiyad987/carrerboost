import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const JobMatcher = () => {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMatch = () => {
    if (!jobDescription || !resumeText) {
      toast({
        title: "Missing Information",
        description: "Please provide both job description and your resume.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    // Simple keyword matching algorithm
    setTimeout(() => {
      const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const resumeWords = resumeText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      
      const jdSet = new Set(jdWords);
      const resumeSet = new Set(resumeWords);
      
      const matchedKeywords = [...jdSet].filter(word => resumeSet.has(word));
      const missingKeywords = [...jdSet].filter(word => !resumeSet.has(word)).slice(0, 10);
      
      const matchScore = Math.min(95, Math.round((matchedKeywords.length / jdSet.size) * 100));

      // Extract common skills and requirements
      const techSkills = ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'java', 'typescript', 'angular', 'vue'];
      const requiredSkills = techSkills.filter(skill => jdWords.includes(skill));
      const matchedSkills = requiredSkills.filter(skill => resumeWords.includes(skill));
      const missingSkills = requiredSkills.filter(skill => !resumeWords.includes(skill));

      setAnalysisResult({
        matchScore,
        matchedKeywords: matchedKeywords.slice(0, 15),
        missingKeywords: missingKeywords.slice(0, 10),
        matchedSkills,
        missingSkills,
        suggestions: generateSuggestions(matchScore, missingSkills, missingKeywords)
      });

      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete!",
        description: `Your resume match score is ${matchScore}%`,
      });
    }, 2000);
  };

  const generateSuggestions = (score: number, missingSkills: string[], missingKeywords: string[]) => {
    const suggestions = [];
    
    if (score < 70) {
      suggestions.push("Your match score is below 70%. Consider tailoring your resume more closely to this job description.");
    }
    
    if (missingSkills.length > 0) {
      suggestions.push(`Add these technical skills if you have them: ${missingSkills.slice(0, 3).join(", ")}`);
    }
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Include these keywords from the job description: ${missingKeywords.slice(0, 5).join(", ")}`);
    }
    
    suggestions.push("Use action verbs to describe your achievements (e.g., 'Developed', 'Managed', 'Increased')");
    suggestions.push("Quantify your achievements with numbers and percentages where possible");
    suggestions.push("Ensure your resume format is ATS-friendly with clear section headers");
    
    return suggestions;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Job Description Matcher</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Compare your resume with a job description and see how well you match</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="p-6 shadow-lg">
            <Label htmlFor="jobDescription" className="text-lg font-semibold mb-2 block">
              Job Description
            </Label>
            <Textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={12}
              className="resize-none"
            />
          </Card>

          <Card className="p-6 shadow-lg">
            <Label htmlFor="resume" className="text-lg font-semibold mb-2 block">
              Your Resume
            </Label>
            <Textarea
              id="resume"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here or upload a PDF..."
              rows={12}
              className="resize-none"
            />
          </Card>
        </div>

        <div className="text-center mb-8">
          <Button
            onClick={analyzeMatch}
            size="lg"
            variant="gradient"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Match"}
          </Button>
        </div>

        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="p-8 shadow-lg bg-gradient-card">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Match Score</h3>
                <div className="text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
                  {analysisResult.matchScore}%
                </div>
                <Progress value={analysisResult.matchScore} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {analysisResult.matchScore >= 80 ? "Excellent match!" :
                   analysisResult.matchScore >= 60 ? "Good match, with room for improvement" :
                   "Consider tailoring your resume more closely"}
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                  <h3 className="text-xl font-semibold">Matched Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.matchedSkills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-success/10 text-success border border-success/20 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {analysisResult.matchedSkills.length === 0 && (
                    <p className="text-muted-foreground text-sm">No technical skills detected</p>
                  )}
                </div>
              </Card>

              <Card className="p-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="w-6 h-6 text-destructive" />
                  <h3 className="text-xl font-semibold">Missing Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingSkills.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {analysisResult.missingSkills.length === 0 && (
                    <p className="text-success text-sm">All required technical skills are present!</p>
                  )}
                </div>
              </Card>
            </div>

            <Card className="p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-semibold">Improvement Suggestions</h3>
              </div>
              <ul className="space-y-3">
                {analysisResult.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6 shadow-lg bg-accent/5 border-accent/20">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-accent" />
                Next Steps to Improve Your Chances
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Update your resume with the missing keywords and skills mentioned above</li>
                <li>Use the Resume Builder to create an ATS-optimized version</li>
                <li>Practice interview questions related to this role</li>
                <li>Optimize your LinkedIn profile to match this job description</li>
                <li>Research the company culture and prepare relevant examples</li>
              </ol>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

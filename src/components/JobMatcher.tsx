import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface AnalysisResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  detailedAnalysis: {
    skillsToAdd: string[];
    experienceGaps: string[];
    keywordOptimizations: string[];
    formattingTips: string[];
    actionItems: string[];
  };
}

export const JobMatcher = () => {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setIsExtractingPdf(true);
    setUploadedFileName(file.name);

    try {
      const text = await extractTextFromPdf(file);
      setResumeText(text);
      toast({
        title: "PDF Uploaded!",
        description: "Your resume has been extracted successfully.",
      });
    } catch (error) {
      console.error("Error extracting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to extract text from PDF. Please try again or paste your resume manually.",
        variant: "destructive",
      });
      setUploadedFileName(null);
    } finally {
      setIsExtractingPdf(false);
    }
  };

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

    setTimeout(() => {
      const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const resumeWords = resumeText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      
      const jdSet = new Set(jdWords);
      const resumeSet = new Set(resumeWords);
      
      const matchedKeywords = [...jdSet].filter(word => resumeSet.has(word));
      const missingKeywords = [...jdSet].filter(word => !resumeSet.has(word)).slice(0, 15);
      
      const matchScore = Math.min(95, Math.round((matchedKeywords.length / jdSet.size) * 100));

      // Extract common skills and requirements
      const techSkills = ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'java', 'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest', 'api', 'git', 'agile', 'scrum', 'jira', 'figma', 'html', 'css', 'sass', 'tailwind', 'nextjs', 'express', 'django', 'flask', 'spring', 'microservices', 'cicd', 'jenkins', 'terraform', 'linux', 'azure', 'gcp'];
      const softSkills = ['leadership', 'communication', 'teamwork', 'problem-solving', 'analytical', 'creative', 'organized', 'detail-oriented', 'collaborative', 'adaptable', 'mentoring', 'presentation'];
      
      const allSkills = [...techSkills, ...softSkills];
      const requiredSkills = allSkills.filter(skill => jdWords.includes(skill));
      const matchedSkills = requiredSkills.filter(skill => resumeWords.includes(skill));
      const missingSkills = requiredSkills.filter(skill => !resumeWords.includes(skill));

      // Generate detailed analysis
      const detailedAnalysis = generateDetailedAnalysis(
        matchScore,
        missingSkills,
        missingKeywords,
        jobDescription,
        resumeText,
        matchedSkills
      );

      setAnalysisResult({
        matchScore,
        matchedKeywords: matchedKeywords.slice(0, 20),
        missingKeywords,
        matchedSkills,
        missingSkills,
        suggestions: generateSuggestions(matchScore, missingSkills, missingKeywords),
        detailedAnalysis,
      });

      setIsAnalyzing(false);
      toast({
        title: "Analysis Complete!",
        description: `Your resume match score is ${matchScore}%`,
      });
    }, 2000);
  };

  const generateDetailedAnalysis = (
    score: number,
    missingSkills: string[],
    missingKeywords: string[],
    jd: string,
    resume: string,
    matchedSkills: string[]
  ) => {
    const jdLower = jd.toLowerCase();
    const resumeLower = resume.toLowerCase();

    // Skills to add
    const skillsToAdd: string[] = [];
    if (missingSkills.length > 0) {
      skillsToAdd.push(`Add these technical skills to your resume: ${missingSkills.slice(0, 5).join(", ")}`);
    }
    
    // Check for certifications
    const certKeywords = ['certified', 'certification', 'aws certified', 'pmp', 'scrum master', 'cka', 'ckad'];
    const hasCertRequirement = certKeywords.some(cert => jdLower.includes(cert));
    const hasCertInResume = certKeywords.some(cert => resumeLower.includes(cert));
    if (hasCertRequirement && !hasCertInResume) {
      skillsToAdd.push("Consider adding relevant certifications mentioned in the job description");
    }

    // Experience gaps
    const experienceGaps: string[] = [];
    const yearsMatch = jdLower.match(/(\d+)\+?\s*years?/);
    if (yearsMatch) {
      experienceGaps.push(`Job requires ${yearsMatch[0]} of experience - ensure your resume clearly shows this timeline`);
    }
    
    if (jdLower.includes("lead") || jdLower.includes("senior") || jdLower.includes("manager")) {
      if (!resumeLower.includes("lead") && !resumeLower.includes("senior") && !resumeLower.includes("managed")) {
        experienceGaps.push("Highlight leadership experience and team management responsibilities");
      }
    }

    if (jdLower.includes("startup") && !resumeLower.includes("startup")) {
      experienceGaps.push("Consider mentioning any startup or fast-paced environment experience");
    }

    // Keyword optimizations
    const keywordOptimizations: string[] = [];
    const importantPhrases = ["cross-functional", "stakeholder", "roadmap", "strategy", "metrics", "kpi", "roi", "scalable", "enterprise", "production"];
    const missingPhrases = importantPhrases.filter(phrase => jdLower.includes(phrase) && !resumeLower.includes(phrase));
    if (missingPhrases.length > 0) {
      keywordOptimizations.push(`Include these industry terms: ${missingPhrases.slice(0, 4).join(", ")}`);
    }

    if (missingKeywords.length > 5) {
      keywordOptimizations.push(`Add these keywords from job description: ${missingKeywords.slice(0, 6).join(", ")}`);
    }

    // Formatting tips
    const formattingTips: string[] = [];
    if (!resumeLower.includes("%") && !resumeLower.match(/\d+\s*(percent|increase|decrease|improved|reduced)/)) {
      formattingTips.push("Add quantifiable achievements with percentages (e.g., 'Increased sales by 25%')");
    }
    
    if (!resumeLower.includes("$") && jdLower.includes("budget")) {
      formattingTips.push("Include budget figures you've managed to demonstrate financial responsibility");
    }

    formattingTips.push("Use action verbs: 'Developed', 'Implemented', 'Led', 'Optimized', 'Delivered'");
    formattingTips.push("Keep bullet points concise (1-2 lines) with measurable outcomes");

    // Action items
    const actionItems: string[] = [];
    if (score < 50) {
      actionItems.push("⚠️ Major revision needed - Your resume needs significant tailoring for this role");
      actionItems.push("Rewrite your professional summary to directly address the job requirements");
      actionItems.push("Restructure experience section to highlight relevant projects first");
    } else if (score < 70) {
      actionItems.push("Moderate adjustments needed - Focus on adding missing keywords");
      actionItems.push("Expand on experiences that match the job requirements");
    } else if (score < 85) {
      actionItems.push("Minor tweaks recommended - You're close to a great match");
      actionItems.push("Fine-tune language to mirror the job description");
    } else {
      actionItems.push("✅ Strong match! Focus on preparing for the interview");
    }

    if (matchedSkills.length > 0) {
      actionItems.push(`Emphasize these matching skills more prominently: ${matchedSkills.slice(0, 3).join(", ")}`);
    }

    return {
      skillsToAdd,
      experienceGaps,
      keywordOptimizations,
      formattingTips,
      actionItems,
    };
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
          <p className="text-sm sm:text-base text-muted-foreground">Compare your resume with a job description and get detailed analysis on what to improve</p>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
              <Label htmlFor="resume" className="text-lg font-semibold">
                Your Resume
              </Label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isExtractingPdf}
              >
                {isExtractingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload PDF
                  </>
                )}
              </Button>
            </div>
            {uploadedFileName && (
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground bg-muted/50 rounded px-3 py-2">
                <FileText className="w-4 h-4" />
                <span>{uploadedFileName}</span>
              </div>
            )}
            <Textarea
              id="resume"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Upload a PDF or paste your resume text here..."
              rows={uploadedFileName ? 10 : 12}
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
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Match"
            )}
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

            {/* Detailed Analysis Section */}
            <Card className="p-6 shadow-lg border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-primary" />
                Detailed Resume Analysis
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Skills to Add */}
                {analysisResult.detailedAnalysis.skillsToAdd.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      Skills to Add
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.detailedAnalysis.skillsToAdd.map((item, index) => (
                        <li key={index} className="text-sm flex items-start gap-2 bg-primary/10 p-3 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Experience Gaps */}
                {analysisResult.detailedAnalysis.experienceGaps.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-destructive"></span>
                      Experience Gaps
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.detailedAnalysis.experienceGaps.map((item, index) => (
                        <li key={index} className="text-sm flex items-start gap-2 bg-destructive/10 p-3 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Keyword Optimizations */}
                {analysisResult.detailedAnalysis.keywordOptimizations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent"></span>
                      Keyword Optimizations
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.detailedAnalysis.keywordOptimizations.map((item, index) => (
                        <li key={index} className="text-sm flex items-start gap-2 bg-accent/10 p-3 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Formatting Tips */}
                {analysisResult.detailedAnalysis.formattingTips.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-success"></span>
                      Formatting Tips
                    </h4>
                    <ul className="space-y-2">
                      {analysisResult.detailedAnalysis.formattingTips.map((item, index) => (
                        <li key={index} className="text-sm flex items-start gap-2 bg-success/10 p-3 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>

            {/* Action Items */}
            <Card className="p-6 shadow-lg bg-accent/5 border-accent/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-accent" />
                Priority Action Items
              </h3>
              <ol className="space-y-3">
                {analysisResult.detailedAnalysis.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-semibold">General Suggestions</h3>
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
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

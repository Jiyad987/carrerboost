import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2, XCircle, AlertCircle, TrendingUp, Upload,
  FileText, Loader2, Flame, Target, Code2, Zap, ArrowRight,
  ChevronDown, ChevronUp, Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface AnalysisResult {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  resumeSuggestions: string[];
  detailedAnalysis: {
    skillsToAdd: string[];
    experienceGaps: string[];
    keywordOptimizations: string[];
    formattingTips: string[];
    actionItems: string[];
  };
  roastComments: string[];
}

type Mode = "roast";

const roastPool = [
  "🔥 This resume is so generic it could apply for literally any job, including 'Professional Napkin'.",
  "😬 Your skills section reads like a Wikipedia article — all breadth, zero depth.",
  "💀 'Proficient in Microsoft Office' — bold move in 2024. Did you also add 'can use a fax machine'?",
  "🙈 I've seen more personality in a terms & conditions page.",
  "😂 Your summary is so vague, even you probably forgot what job you're applying for.",
  "🤔 Listing 'team player' as a skill is like listing 'breathing' on your resume.",
  "💤 Three pages? Recruiters have 7 seconds. Congrats on being a very long yawn.",
  "🤡 'Responsible for various tasks' — Wow. Riveting. What tasks? Watering plants?",
  "😅 Your bullet points are so passive they could put a caffeinated recruiter to sleep.",
  "🎭 This resume is like a mystery novel — no one can figure out what you actually do.",
  "🪄 You've listed 'problem solver' but the biggest problem is this resume.",
  "📉 The only thing this resume is optimized for is rejection.",
  "🐌 Your career progression is so flat it makes a pancake look like Everest.",
  "😤 No numbers, no metrics, no proof. Are you a ghost? Do you even exist at work?",
  "🎯 You missed every keyword. Did you even read the job description, or just vibes?",
];

function getRoastComments(score: number, resumeText: string, missingSkills: string[]): string[] {
  const comments: string[] = [];
  const resumeLower = resumeText.toLowerCase();

  // Score-based roasts
  if (score < 40) {
    comments.push("🔥 Match score under 40%? The job description and your resume are basically strangers at a party.");
    comments.push("💀 At this rate, the ATS will reject you before a human even blinks.");
  } else if (score < 60) {
    comments.push("😬 A " + score + "% match? You're like a phone charger that *almost* fits — frustrating and useless.");
  } else if (score < 75) {
    comments.push("😅 " + score + "% match. You're in the 'maybe' pile. Recruiters hate the 'maybe' pile.");
  }

  // Content-based roasts
  if (!resumeLower.includes("%") && !resumeLower.match(/\d+\s*(percent|increase|reduce|improve)/)) {
    comments.push("📉 Zero quantifiable results. Your achievements are as measurable as happiness.");
  }

  if (resumeLower.includes("team player") || resumeLower.includes("hard worker")) {
    comments.push("🤡 'Team player' and 'hard worker' — bold of you to list things every human being claims to be.");
  }

  if (resumeLower.includes("responsible for")) {
    comments.push("😴 'Responsible for' is the resume equivalent of falling asleep mid-sentence. Use action verbs!");
  }

  if (missingSkills.length > 3) {
    comments.push(`🎯 Missing ${missingSkills.length} required skills. The job wants a rocket scientist; your resume says astronaut fan.`);
  }

  if (!resumeLower.includes("project") && !resumeLower.includes("built") && !resumeLower.includes("developed")) {
    comments.push("🤔 No projects mentioned. Did you just think about coding or actually do it?");
  }

  // Add random pool roasts to fill up
  const shuffled = [...roastPool].sort(() => Math.random() - 0.5);
  for (const r of shuffled) {
    if (comments.length >= 5) break;
    if (!comments.includes(r)) comments.push(r);
  }

  return comments.slice(0, 5);
}

export const JobMatcher = () => {
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [mode] = useState<Mode>("roast");
  const [expandedSection, setExpandedSection] = useState<string | null>("actionItems");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      fullText += pageText + "\n";
    }
    return fullText;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid File", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }
    setIsExtractingPdf(true);
    setUploadedFileName(file.name);
    try {
      const text = await extractTextFromPdf(file);
      if (!text.trim()) throw new Error("No text extracted");
      console.log("Extracted Resume Text:", text);
      setResumeText(text);
      toast({ title: "PDF Extracted!", description: `${text.length} characters extracted from ${file.name}` });
    } catch (error) {
      console.error("PDF extraction error:", error);
      toast({ title: "Extraction Failed", description: "Try pasting your resume text manually.", variant: "destructive" });
      setUploadedFileName(null);
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const runAnalysis = () => {
    if (!jobDescription || !resumeText) {
      toast({ title: "Missing Input", description: "Provide both job description and resume.", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);

    setTimeout(() => {
      const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const resumeWords = resumeText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const jdSet = new Set(jdWords);
      const resumeSet = new Set(resumeWords);

      const matchedKeywords = [...jdSet].filter(w => resumeSet.has(w));
      const missingKeywords = [...jdSet].filter(w => !resumeSet.has(w)).slice(0, 15);
      const matchScore = Math.min(95, Math.round((matchedKeywords.length / jdSet.size) * 100));

      const techSkills = ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'java', 'typescript', 'angular', 'vue', 'mongodb', 'postgresql', 'redis', 'graphql', 'rest', 'api', 'git', 'agile', 'scrum', 'jira', 'figma', 'html', 'css', 'sass', 'tailwind', 'nextjs', 'express', 'django', 'flask', 'spring', 'microservices', 'cicd', 'jenkins', 'terraform', 'linux', 'azure', 'gcp'];
      const softSkills = ['leadership', 'communication', 'teamwork', 'analytical', 'creative', 'organized', 'collaborative', 'adaptable', 'mentoring', 'presentation'];
      const allSkills = [...techSkills, ...softSkills];
      const requiredSkills = allSkills.filter(s => jdWords.includes(s));
      const matchedSkills = requiredSkills.filter(s => resumeWords.includes(s));
      const missingSkills = requiredSkills.filter(s => !resumeWords.includes(s));

      const roastComments = getRoastComments(matchScore, resumeText, missingSkills);
      const detailedAnalysis = generateDetailedAnalysis(matchScore, missingSkills, missingKeywords, jobDescription, resumeText, matchedSkills);

      setAnalysisResult({
        matchScore,
        matchedKeywords: matchedKeywords.slice(0, 20),
        missingKeywords,
        matchedSkills,
        missingSkills,
        suggestions: generateSuggestions(matchScore, missingSkills, missingKeywords),
        resumeSuggestions: generateResumeSuggestions(matchScore, missingSkills, missingKeywords, jobDescription, resumeText),
        detailedAnalysis,
        roastComments,
      });

      setIsAnalyzing(false);
      toast({ title: mode === "roast" ? "Roast Ready 🔥" : "Analysis Complete!", description: `Match score: ${matchScore}%` });
    }, 2000);
  };

  const generateDetailedAnalysis = (score: number, missingSkills: string[], missingKeywords: string[], jd: string, resume: string, matchedSkills: string[]) => {
    const jdLower = jd.toLowerCase();
    const resumeLower = resume.toLowerCase();

    const skillsToAdd: string[] = [];
    if (missingSkills.length > 0) skillsToAdd.push(`Add these technical skills: ${missingSkills.slice(0, 5).join(", ")}`);
    const certKeywords = ['certified', 'certification', 'aws certified', 'pmp', 'scrum master', 'cka'];
    if (certKeywords.some(c => jdLower.includes(c)) && !certKeywords.some(c => resumeLower.includes(c))) {
      skillsToAdd.push("Add relevant certifications mentioned in the job description");
    }

    const experienceGaps: string[] = [];
    const yearsMatch = jdLower.match(/(\d+)\+?\s*years?/);
    if (yearsMatch) experienceGaps.push(`Role requires ${yearsMatch[0]} of experience — ensure your timeline is clearly visible`);
    if ((jdLower.includes("lead") || jdLower.includes("senior")) && !resumeLower.includes("led") && !resumeLower.includes("senior")) {
      experienceGaps.push("No leadership experience visible. Highlight any team lead or mentoring roles.");
    }
    if (jdLower.includes("startup") && !resumeLower.includes("startup")) {
      experienceGaps.push("Job prefers startup experience — mention fast-paced or self-directed work");
    }

    const keywordOptimizations: string[] = [];
    const importantPhrases = ["cross-functional", "stakeholder", "roadmap", "strategy", "metrics", "kpi", "roi", "scalable", "enterprise"];
    const missingPhrases = importantPhrases.filter(p => jdLower.includes(p) && !resumeLower.includes(p));
    if (missingPhrases.length > 0) keywordOptimizations.push(`Mirror these industry terms: ${missingPhrases.slice(0, 4).join(", ")}`);
    if (missingKeywords.length > 5) keywordOptimizations.push(`Weave in these JD keywords: ${missingKeywords.slice(0, 6).join(", ")}`);

    const formattingTips: string[] = [];
    if (!resumeLower.includes("%") && !resumeLower.match(/\d+\s*(percent|increase|decrease|improved|reduced)/)) {
      formattingTips.push("Add metrics: 'Increased sales by 30%', 'Reduced latency by 200ms'");
    }
    formattingTips.push("Use strong action verbs: Architected, Shipped, Optimized, Led, Reduced");
    formattingTips.push("Each bullet point = 1 accomplishment + 1 impact. Keep under 2 lines.");
    if (!resumeLower.includes("summary") && !resumeLower.includes("profile")) {
      formattingTips.push("Add a 3-line Professional Summary tailored to this exact role");
    }

    const actionItems: string[] = [];
    if (score < 50) {
      actionItems.push("🚨 CRITICAL: Major revision needed — rewrite experience bullets to mirror this JD");
      actionItems.push("Rebuild your professional summary around the role's top 3 requirements");
      actionItems.push("Restructure skills section to front-load required technologies");
    } else if (score < 70) {
      actionItems.push("⚠️ Moderate revision: Add missing keywords and reframe 2-3 bullet points");
      actionItems.push("Expand on experiences that overlap with the role requirements");
    } else if (score < 85) {
      actionItems.push("✅ Close! Fine-tune language to mirror exact JD phrasing");
      actionItems.push("Strengthen impact statements with numbers and results");
    } else {
      actionItems.push("🎯 Strong match — focus on interview prep now");
    }
    if (matchedSkills.length > 0) {
      actionItems.push(`Highlight these skills MORE prominently (recruiters want them): ${matchedSkills.slice(0, 4).join(", ")}`);
    }

    return { skillsToAdd, experienceGaps, keywordOptimizations, formattingTips, actionItems };
  };

  const generateSuggestions = (score: number, missingSkills: string[], missingKeywords: string[]) => {
    const s = [];
    if (score < 70) s.push("Match score below 70% — tailor your resume more closely to this JD");
    if (missingSkills.length > 0) s.push(`Add these skills if you have them: ${missingSkills.slice(0, 3).join(", ")}`);
    if (missingKeywords.length > 0) s.push(`Include these JD keywords: ${missingKeywords.slice(0, 5).join(", ")}`);
    s.push("Use action verbs: Developed, Managed, Increased, Optimized, Delivered");
    s.push("Quantify achievements with numbers and percentages");
    s.push("Ensure ATS-friendly formatting with clear section headers");
    return s;
  };

  const generateResumeSuggestions = (score: number, missingSkills: string[], missingKeywords: string[], jd: string, resume: string): string[] => {
    const jdLower = jd.toLowerCase();
    const resumeLower = resume.toLowerCase();
    const s: string[] = [];

    if (!resumeLower.includes("summary") && !resumeLower.includes("objective")) {
      s.push("📝 Add a Professional Summary at the top — 3 lines tailored to this specific role");
    }
    if (missingSkills.length > 0) s.push(`🛠️ Add a Technical Skills section including: ${missingSkills.join(", ")}`);
    if (!resumeLower.includes("project")) s.push("💼 Add a Projects section with links to relevant work");
    const certKeywords = ['certified', 'certification', 'aws', 'pmp', 'scrum', 'google', 'microsoft'];
    const jdCerts = certKeywords.filter(c => jdLower.includes(c));
    if (jdCerts.length > 0 && !certKeywords.some(c => resumeLower.includes(c))) {
      s.push(`🏅 Obtain or list certifications — JD mentions: ${jdCerts.join(", ")}`);
    }
    if (!resumeLower.match(/\d+%/) && !resumeLower.match(/\$\d+/)) {
      s.push("📊 Add quantified achievements: 'Reduced load time by 40%', 'Managed ₹50L budget'");
    }
    if (missingKeywords.length > 3) s.push(`🔑 Naturally weave in: ${missingKeywords.slice(0, 6).join(", ")}`);
    if ((jdLower.includes("lead") || jdLower.includes("mentor")) && !resumeLower.includes("led")) {
      s.push("👥 Add leadership examples: team size, mentoring, cross-team collaboration");
    }
    s.push("📋 Use standard headers: Experience, Education, Skills, Projects, Certifications");
    s.push("✏️ Mirror exact phrases from the job description in your bullet points");
    if (score < 60) s.push("🔄 Consider a full rewrite of your experience section focused on this role's requirements");
    return s;
  };

  const scoreColor = analysisResult
    ? analysisResult.matchScore >= 80 ? "text-success" : analysisResult.matchScore >= 60 ? "text-warning" : "text-destructive"
    : "";

  const toggleSection = (section: string) => setExpandedSection(expandedSection === section ? null : section);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-destructive/30 text-destructive mb-4">
            <Flame className="w-3 h-3" />
            resume_roast.execute()
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">Roast My Resume 🔥</h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Upload your resume and a job description — get brutally roasted with zero mercy
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-center"
        >
          <p className="text-sm text-destructive font-medium">
            🔥 AI will brutally (but helpfully) judge your resume with zero mercy
          </p>
        </motion.div>

        {/* Input Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-5 border-border shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <Label className="text-sm font-semibold">Job Description</Label>
              <span className="font-mono text-[10px] text-muted-foreground ml-auto">paste_jd()</span>
            </div>
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={12}
              className="resize-none text-sm font-mono"
            />
          </Card>

          <Card className="p-5 border-border shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <Label className="text-sm font-semibold">Your Resume</Label>
              <div className="ml-auto flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">upload_or_paste()</span>
                <input type="file" accept=".pdf" onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isExtractingPdf} className="h-7 text-xs">
                  {isExtractingPdf ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Extracting</> : <><Upload className="w-3 h-3 mr-1" />PDF</>}
                </Button>
              </div>
            </div>
            {uploadedFileName && (
              <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground bg-muted/50 rounded px-3 py-1.5 font-mono">
                <FileText className="w-3 h-3" />
                {uploadedFileName}
              </div>
            )}
            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Upload a PDF or paste your resume text..."
              rows={uploadedFileName ? 10 : 12}
              className="resize-none text-sm font-mono"
            />
          </Card>
        </div>

        <div className="text-center mb-10">
          <Button
            onClick={runAnalysis}
            size="lg"
            variant="roast"
            disabled={isAnalyzing}
            className="gap-2 min-w-48"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Roasting...</>
            ) : (
              <><Flame className="w-5 h-5" />Roast My Resume 🔥</>
            )}
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

              {/* Score Card */}
              <Card className="p-8 border-border shadow-lg">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="text-center">
                    <div className="text-xs font-mono text-muted-foreground mb-1">match_score</div>
                    <div className={`text-7xl font-bold font-mono ${scoreColor}`}>
                      {analysisResult.matchScore}
                      <span className="text-3xl">%</span>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <Progress value={analysisResult.matchScore} className="h-3 mb-3" />
                    <div className="flex justify-between text-xs font-mono text-muted-foreground">
                      <span>0%</span>
                      <span className={scoreColor}>
                        {analysisResult.matchScore >= 80 ? "✅ Excellent match" :
                         analysisResult.matchScore >= 60 ? "⚠️ Good — needs tweaks" :
                         "🚨 Needs major revision"}
                      </span>
                      <span>100%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {[
                        { label: "Keywords Matched", value: analysisResult.matchedKeywords.length },
                        { label: "Skills Found", value: analysisResult.matchedSkills.length },
                        { label: "Skills Missing", value: analysisResult.missingSkills.length },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-muted/50 rounded-lg p-3 text-center">
                          <div className="text-xl font-bold font-mono">{value}</div>
                          <div className="text-[10px] text-muted-foreground">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Roast Section — always shown */}
              {(
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <Card className="p-6 border-destructive/30 bg-destructive/5 shadow-lg">
                    <div className="flex items-center gap-2 mb-5">
                      <Flame className="w-6 h-6 text-destructive" />
                      <h3 className="text-xl font-bold text-destructive">Resume Roast 🔥</h3>
                      <span className="ml-auto text-xs font-mono text-muted-foreground">// brutal_feedback()</span>
                    </div>
                    <div className="space-y-3">
                      {analysisResult.roastComments.map((comment, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3 p-4 bg-destructive/8 rounded-lg border border-destructive/15"
                        >
                          <span className="font-mono text-xs text-muted-foreground flex-shrink-0 mt-0.5">#{i + 1}</span>
                          <span className="text-sm leading-relaxed">{comment}</span>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-4 font-mono">
                      // remember: this is tough love — now fix it 💪
                    </p>
                  </Card>
                </motion.div>
              )}

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-5 border-border shadow-md">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <h3 className="font-semibold">Matched Skills</h3>
                    <span className="ml-auto font-mono text-xs text-success">{analysisResult.matchedSkills.length} found</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.matchedSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-success/10 text-success border border-success/20 rounded-md text-xs font-mono">
                        {skill}
                      </span>
                    ))}
                    {analysisResult.matchedSkills.length === 0 && (
                      <p className="text-muted-foreground text-xs font-mono">// no_skills_detected</p>
                    )}
                  </div>
                </Card>

                <Card className="p-5 border-border shadow-md">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <h3 className="font-semibold">Missing Skills</h3>
                    <span className="ml-auto font-mono text-xs text-destructive">{analysisResult.missingSkills.length} gaps</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-xs font-mono">
                        {skill}
                      </span>
                    ))}
                    {analysisResult.missingSkills.length === 0 && (
                      <p className="text-success text-xs font-mono">// all_skills_present ✓</p>
                    )}
                  </div>
                </Card>
              </div>

              {/* Priority Actions — always open */}
              <Card className="p-5 border-primary/20 bg-primary/5 shadow-md">
                <button
                  className="w-full flex items-center gap-2 text-left"
                  onClick={() => toggleSection("actionItems")}
                >
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold flex-1">Priority Action Items</h3>
                  <span className="font-mono text-xs text-muted-foreground">{analysisResult.detailedAnalysis.actionItems.length} actions</span>
                  {expandedSection === "actionItems" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <AnimatePresence>
                  {expandedSection === "actionItems" && (
                    <motion.ol
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 space-y-2 overflow-hidden"
                    >
                      {analysisResult.detailedAnalysis.actionItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="flex-shrink-0 font-mono text-xs text-primary mt-0.5">{String(i + 1).padStart(2, "0")}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </motion.ol>
                  )}
                </AnimatePresence>
              </Card>

              {/* Detailed Analysis — collapsible sections */}
              {[
                {
                  key: "skills",
                  icon: <Star className="w-5 h-5 text-primary" />,
                  label: "Skills to Add",
                  items: analysisResult.detailedAnalysis.skillsToAdd,
                  color: "text-primary",
                  bg: "bg-primary/5",
                },
                {
                  key: "gaps",
                  icon: <AlertCircle className="w-5 h-5 text-destructive" />,
                  label: "Experience Gaps",
                  items: analysisResult.detailedAnalysis.experienceGaps,
                  color: "text-destructive",
                  bg: "bg-destructive/5",
                },
                {
                  key: "keywords",
                  icon: <Code2 className="w-5 h-5 text-accent" />,
                  label: "Keyword Optimizations",
                  items: analysisResult.detailedAnalysis.keywordOptimizations,
                  color: "text-accent",
                  bg: "bg-accent/5",
                },
                {
                  key: "formatting",
                  icon: <FileText className="w-5 h-5 text-success" />,
                  label: "Formatting & Impact Tips",
                  items: analysisResult.detailedAnalysis.formattingTips,
                  color: "text-success",
                  bg: "bg-success/5",
                },
              ].map(({ key, icon, label, items, color, bg }) =>
                items.length > 0 ? (
                  <Card key={key} className="p-5 border-border shadow-md">
                    <button className="w-full flex items-center gap-2 text-left" onClick={() => toggleSection(key)}>
                      {icon}
                      <h3 className="font-semibold flex-1">{label}</h3>
                      <span className={`font-mono text-xs ${color}`}>{items.length} items</span>
                      {expandedSection === key ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === key && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className={`mt-4 space-y-2 overflow-hidden`}
                        >
                          {items.map((item, i) => (
                            <li key={i} className={`flex items-start gap-2 text-sm p-3 rounded-lg ${bg}`}>
                              <ArrowRight className={`w-4 h-4 flex-shrink-0 mt-0.5 ${color}`} />
                              {item}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </Card>
                ) : null
              )}

              {/* Resume Suggestions */}
              {analysisResult.resumeSuggestions.length > 0 && (
                <Card className="p-5 border-success/20 bg-success/5 shadow-md">
                  <button className="w-full flex items-center gap-2 text-left" onClick={() => toggleSection("resume")}>
                    <TrendingUp className="w-5 h-5 text-success" />
                    <h3 className="font-semibold flex-1">Resume Improvement Suggestions</h3>
                    <span className="font-mono text-xs text-success">{analysisResult.resumeSuggestions.length} tips</span>
                    {expandedSection === "resume" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {expandedSection === "resume" && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-2 overflow-hidden"
                      >
                        {analysisResult.resumeSuggestions.map((s, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm p-3 bg-card rounded-lg border border-success/10">
                            <span className="font-mono text-xs text-success flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}.</span>
                            {s}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

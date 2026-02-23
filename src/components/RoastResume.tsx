import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Loader2, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const roastPool = [
  { text: "This resume is so generic it could apply for literally any job, including 'Professional Napkin'.", emoji: "🔥" },
  { text: "Your skills section reads like a Wikipedia article — all breadth, zero depth.", emoji: "😬" },
  { text: "'Proficient in Microsoft Office' — bold move. Did you also add 'can use a fax machine'?", emoji: "💀" },
  { text: "I've seen more personality in a terms & conditions page.", emoji: "🙈" },
  { text: "Your summary is so vague, even you probably forgot what job you're applying for.", emoji: "😂" },
  { text: "Listing 'team player' as a skill is like listing 'breathing' on your resume.", emoji: "🤔" },
  { text: "Three pages? Recruiters have 7 seconds. Congrats on being a very long yawn.", emoji: "💤" },
  { text: "'Responsible for various tasks' — Wow. Riveting. What tasks? Watering plants?", emoji: "🤡" },
  { text: "Your bullet points are so passive they could put a caffeinated recruiter to sleep.", emoji: "😅" },
  { text: "This resume is like a mystery novel — no one can figure out what you actually do.", emoji: "🎭" },
  { text: "You've listed 'problem solver' but the biggest problem is this resume.", emoji: "🪄" },
  { text: "The only thing this resume is optimized for is rejection.", emoji: "📉" },
  { text: "Your career progression is so flat it makes a pancake look like Everest.", emoji: "🐌" },
  { text: "No numbers, no metrics, no proof. Are you a ghost? Do you even exist at work?", emoji: "😤" },
  { text: "Did you use a random word generator for your professional summary?", emoji: "🎲" },
  { text: "Your resume has more filler words than a bag of packing peanuts.", emoji: "📦" },
  { text: "This resume screams 'I Googled how to write a resume 10 minutes ago'.", emoji: "⏰" },
  { text: "Your experience section is so thin, it's basically see-through.", emoji: "👻" },
  { text: "I've seen more structure in a toddler's finger painting.", emoji: "🎨" },
  { text: "Your resume is the human equivalent of a participation trophy.", emoji: "🏆" },
];

const memeImages = [
  "https://i.imgflip.com/1bij.jpg", // One Does Not Simply
  "https://i.imgflip.com/26am.jpg", // Futurama Fry
  "https://i.imgflip.com/9ehk.jpg", // Disaster Girl
  "https://i.imgflip.com/1ur9b0.jpg", // Roll Safe
  "https://i.imgflip.com/30b1gx.jpg", // Drake
  "https://i.imgflip.com/1h7in3.jpg", // Expanding Brain
];

function generateRoast(resumeText: string): { mainRoast: string; emoji: string; memeUrl: string; details: string[] } {
  const lower = resumeText.toLowerCase();
  const details: string[] = [];
  let mainRoast = "";
  let emoji = "🔥";

  // Context-aware roasts
  if (lower.includes("responsible for")) {
    mainRoast = "'Responsible for' is doing all the heavy lifting on this resume — and it's exhausted.";
    emoji = "😴";
    details.push("Replace 'Responsible for' with action verbs: Led, Built, Shipped, Optimized");
  } else if (lower.includes("team player") || lower.includes("hard worker")) {
    mainRoast = "You listed 'team player' and 'hard worker'. Congratulations, you've described every person ever.";
    emoji = "🤡";
    details.push("Remove generic soft skills. Show teamwork through actual achievements instead.");
  } else if (!lower.match(/\d+%/) && !lower.match(/\d+\s*(increase|reduce|improve|grew|saved)/)) {
    mainRoast = "Not a single metric in sight. Your resume is all talk and zero receipts.";
    emoji = "📉";
    details.push("Add numbers: 'Increased revenue by 30%', 'Reduced load time by 2s', 'Managed team of 8'");
  } else if (lower.length < 300) {
    mainRoast = "This resume is shorter than a tweet thread. Are you applying for a job or ordering coffee?";
    emoji = "☕";
    details.push("Expand your experience with detailed bullet points showing impact and results.");
  } else if (!lower.includes("project") && !lower.includes("built") && !lower.includes("developed")) {
    mainRoast = "No projects listed. What have you been doing — watching tutorials and calling it experience?";
    emoji = "📺";
    details.push("Add a Projects section showcasing what you've actually built.");
  } else {
    const random = roastPool[Math.floor(Math.random() * roastPool.length)];
    mainRoast = random.text;
    emoji = random.emoji;
  }

  // Add general tips
  if (!lower.includes("summary") && !lower.includes("objective")) {
    details.push("Missing a Professional Summary — add 2-3 lines at the top tailored to your target role.");
  }
  if (!lower.includes("linkedin") && !lower.includes("github") && !lower.includes("portfolio")) {
    details.push("No links to LinkedIn, GitHub, or portfolio. Are you hiding from recruiters?");
  }
  if (lower.includes("microsoft office") || lower.includes("ms office")) {
    details.push("Remove 'Microsoft Office' from skills — it's 2025, everyone knows Office.");
  }

  // Pick random meme
  const memeUrl = memeImages[Math.floor(Math.random() * memeImages.length)];

  return { mainRoast, emoji, memeUrl, details };
}

export const RoastResume = () => {
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isRoasting, setIsRoasting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [roastResult, setRoastResult] = useState<{
    mainRoast: string;
    emoji: string;
    memeUrl: string;
    details: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return fullText;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid File", description: "Please upload a PDF.", variant: "destructive" });
      return;
    }
    setIsExtracting(true);
    setUploadedFileName(file.name);
    try {
      const text = await extractTextFromPdf(file);
      if (!text.trim()) throw new Error("No text");
      setResumeText(text);
      toast({ title: "PDF Extracted!", description: `${text.length} characters extracted.` });
    } catch {
      toast({ title: "Extraction Failed", description: "Try pasting manually.", variant: "destructive" });
      setUploadedFileName(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRoast = () => {
    if (!resumeText.trim()) {
      toast({ title: "No Resume", description: "Upload or paste your resume first.", variant: "destructive" });
      return;
    }
    setIsRoasting(true);
    setRoastResult(null);
    setTimeout(() => {
      const result = generateRoast(resumeText);
      setRoastResult(result);
      setIsRoasting(false);
      toast({ title: "Roast Complete 🔥", description: "Your resume has been absolutely destroyed." });
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border border-destructive/30 text-destructive mb-4">
            <Flame className="w-3 h-3" />
            roast_mode.activate()
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 tracking-tight">
            Resume Roast 🔥
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Upload your resume and get a single, brutally honest roast — complete with a comedy meme
          </p>
        </div>

        {/* Upload Section */}
        <Card className="p-5 border-border shadow-md mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <Label className="text-sm font-semibold">Your Resume</Label>
            <div className="ml-auto flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground">upload_or_paste()</span>
              <input type="file" accept=".pdf" onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isExtracting} className="h-7 text-xs">
                {isExtracting ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Extracting</> : <><Upload className="w-3 h-3 mr-1" />PDF</>}
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
            placeholder="Upload a PDF or paste your resume text here..."
            rows={10}
            className="resize-none text-sm font-mono"
          />
        </Card>

        {/* Roast Button */}
        <div className="text-center mb-10">
          <Button onClick={handleRoast} size="lg" variant="roast" disabled={isRoasting} className="gap-2 min-w-48">
            {isRoasting ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Roasting...</>
            ) : (
              <><Flame className="w-5 h-5" />Roast My Resume 🔥</>
            )}
          </Button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {roastResult && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", damping: 20 }}
              className="space-y-6"
            >
              {/* Main Roast Card */}
              <Card className="p-8 border-destructive/30 bg-destructive/5 shadow-xl overflow-hidden relative">
                <div className="absolute top-3 right-3 text-6xl opacity-20 select-none">{roastResult.emoji}</div>
                <div className="flex items-center gap-2 mb-6">
                  <Flame className="w-6 h-6 text-destructive" />
                  <h3 className="text-xl font-bold text-destructive">The Verdict</h3>
                </div>
                
                <div className="text-center mb-6">
                  <span className="text-7xl mb-4 block">{roastResult.emoji}</span>
                  <p className="text-lg sm:text-xl font-semibold leading-relaxed max-w-lg mx-auto">
                    "{roastResult.mainRoast}"
                  </p>
                </div>

                {/* Meme */}
                <div className="flex justify-center mb-6">
                  <div className="rounded-xl overflow-hidden border-2 border-destructive/20 shadow-lg max-w-xs">
                    <img
                      src={roastResult.memeUrl}
                      alt="Roast meme"
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground font-mono">
                  // don't cry — improve 💪
                </p>
              </Card>

              {/* Improvement Tips */}
              {roastResult.details.length > 0 && (
                <Card className="p-6 border-border shadow-md">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    How to Actually Fix It
                  </h3>
                  <div className="space-y-3">
                    {roastResult.details.map((tip, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg text-sm"
                      >
                        <span className="font-mono text-xs text-primary flex-shrink-0 mt-0.5">#{i + 1}</span>
                        <span>{tip}</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              )}

              {/* CTA */}
              <div className="text-center">
                <Button variant="outline" onClick={handleRoast} className="gap-2">
                  <Flame className="w-4 h-4" />
                  Roast Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

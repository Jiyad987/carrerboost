import { useState } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { JobMatcher } from "@/components/JobMatcher";
import { InterviewPractice } from "@/components/InterviewPractice";
import { LinkedInOptimizer } from "@/components/LinkedInOptimizer";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>("home");

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.h1 
              className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              CareerBoost
            </motion.h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveSection("home")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === "home"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveSection("resume")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === "resume"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Resume Builder
              </button>
              <button
                onClick={() => setActiveSection("matcher")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === "matcher"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Job Matcher
              </button>
              <button
                onClick={() => setActiveSection("interview")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === "interview"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Interview Prep
              </button>
              <button
                onClick={() => setActiveSection("linkedin")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeSection === "linkedin"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                LinkedIn
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {activeSection === "home" && (
          <HeroSection 
            onGetStarted={() => setActiveSection("resume")} 
            onNavigate={(section) => setActiveSection(section)}
          />
        )}
        {activeSection === "resume" && <ResumeBuilder />}
        {activeSection === "matcher" && <JobMatcher />}
        {activeSection === "interview" && <InterviewPractice />}
        {activeSection === "linkedin" && <LinkedInOptimizer />}
      </main>

      <footer className="bg-muted/30 border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 CareerBoost. Built for career success.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

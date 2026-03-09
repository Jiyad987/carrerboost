import { useState } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { JobMatcher } from "@/components/JobMatcher";
import { RoastResume } from "@/components/RoastResume";
import { InterviewPractice } from "@/components/InterviewPractice";
import { Services } from "@/components/Services";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "resume", label: "Resume" },
    { id: "matcher", label: "Job Matcher" },
    { id: "roast", label: "Roast Resume" },
    { id: "interview", label: "Interview" },
    { id: "services", label: "Services" },
  ];

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-hero w-full" />

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/90 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2.5 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => handleNavClick("home")}
            >
              <div className="relative">
                <img src={logo} alt="FixMyCareer.in Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg sm:text-xl font-bold bg-gradient-hero bg-clip-text text-transparent tracking-tight">
                  FixMyCareer.in
                </span>
                <span className="text-[10px] text-muted-foreground font-mono hidden sm:block">
                  career_boost.ai
                </span>
              </div>
            </motion.div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 lg:px-4 py-2 rounded-md font-medium transition-all text-sm relative ${
                    activeSection === item.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activeSection === item.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary/10 rounded-md border border-primary/20"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-3 pb-2 border-t border-border pt-3"
            >
              <div className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 rounded-md font-medium transition-all text-sm ${
                      activeSection === item.id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
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
        {activeSection === "roast" && <RoastResume />}
        {activeSection === "interview" && <InterviewPractice />}
        {activeSection === "services" && <Services />}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Panikittum" className="w-6 h-6 object-contain" />
              <span className="font-semibold text-sm">Panikittum</span>
              <span className="text-muted-foreground text-sm">by Eduwants Global</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <Terminal className="w-3 h-3" />
              <span>© 2024 Panikittum. Built for career success.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

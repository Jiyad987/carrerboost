import { useState } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { JobMatcher } from "@/components/JobMatcher";
import { InterviewPractice } from "@/components/InterviewPractice";
import { Services } from "@/components/Services";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "resume", label: "Resume" },
    { id: "matcher", label: "Matcher" },
    { id: "interview", label: "Interview" },
    { id: "services", label: "Services" },
  ];

  const handleNavClick = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <img src={logo} alt="Panikittum Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Panikittum
              </h1>
            </motion.div>

            {/* Theme toggle and mobile menu button */}
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

            {/* Desktop navigation */}
            <div className="hidden md:flex gap-1 lg:gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-2"
            >
              <div className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground shadow-md"
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
        {activeSection === "interview" && <InterviewPractice />}
        {activeSection === "services" && <Services />}
      </main>

      <footer className="bg-muted/30 border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Panikittum. Built for career success.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

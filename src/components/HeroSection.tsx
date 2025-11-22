import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Target, MessageSquare, Linkedin, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const features = [
    {
      icon: FileText,
      title: "ATS-Friendly Resume Builder",
      description: "Create professional resumes optimized for Applicant Tracking Systems"
    },
    {
      icon: Target,
      title: "Job Match Analyzer",
      description: "Compare your resume with job descriptions and get match scores"
    },
    {
      icon: MessageSquare,
      title: "Interview Practice",
      description: "Prepare with role-specific interview questions and tips"
    },
    {
      icon: Linkedin,
      title: "LinkedIn Optimizer",
      description: "Get actionable insights to enhance your LinkedIn profile"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      
      <div className="container mx-auto px-4 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-glow"
          >
            <Sparkles className="w-4 h-4" />
            Your Career Success Platform
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
            Land Your Dream Job with AI-Powered Career Tools
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Build ATS-optimized resumes, practice interviews, analyze job matches, and optimize your LinkedIn profile—all in one powerful platform.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="gradient" onClick={onGetStarted}>
              Get Started Free
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-border group hover:border-accent"
            >
              <div className="bg-gradient-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-6 bg-muted/50 rounded-2xl backdrop-blur-sm">
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Resumes Created</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-3xl font-bold text-secondary">95%</div>
              <div className="text-sm text-muted-foreground">ATS Pass Rate</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-3xl font-bold text-accent">5K+</div>
              <div className="text-sm text-muted-foreground">Job Matches</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

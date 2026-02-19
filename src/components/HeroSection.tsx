import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Target, MessageSquare, Sparkles, Search, Briefcase } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onNavigate: (section: string) => void;
}

export const HeroSection = ({ onGetStarted, onNavigate }: HeroSectionProps) => {
  const features = [
    {
      icon: FileText,
      title: "ATS-Friendly Resume Builder",
      description: "Create professional resumes optimized for Applicant Tracking Systems",
      section: "resume"
    },
    {
      icon: Search,
      title: "AI Job Finder",
      description: "Find jobs, get HR contacts, and generate cover letters with AI",
      section: "jobs"
    },
    {
      icon: Target,
      title: "Job Match Analyzer",
      description: "Compare your resume with job descriptions and get match scores",
      section: "matcher"
    },
    {
      icon: MessageSquare,
      title: "Interview Practice",
      description: "Prepare with role-specific interview questions and tips",
      section: "interview"
    },
    {
      icon: Briefcase,
      title: "Our Services",
      description: "Resume optimization, portfolio development, and professional guidance",
      section: "services"
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
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight px-2">
            Land Your Dream Job with AI-Powered Career Tools
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-2">
            Build ATS-optimized resumes, practice interviews, analyze job matches, and optimize your LinkedIn profile—all in one powerful platform.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="gradient" onClick={onGetStarted}>
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = 'https://wa.me/917676074209?text=Hi%20Panikittum%2C%20I%20need%20help%20with%20my%20career.'}
            >
              Contact Us
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6 max-w-2xl mx-auto">
            🔒 No login required • Your privacy is our priority • All tools work offline
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto px-2">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              onClick={() => onNavigate(feature.section)}
              className="bg-card rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-border group hover:border-accent cursor-pointer"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 bg-card rounded-2xl p-8 shadow-lg border border-border max-w-3xl mx-auto"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">Contact Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold mb-1">Company</h4>
                <p className="text-sm text-muted-foreground">Eduwants Global</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Location</h4>
                <p className="text-sm text-muted-foreground">Kochi, Kerala</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Phone</h4>
                <p className="text-sm text-muted-foreground">+91 7676074209</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Email</h4>
                <a 
                  href="mailto:sayedmuhammedjiyad@gmail.com" 
                  className="text-sm text-primary hover:underline"
                >
                  sayedmuhammedjiyad@gmail.com
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Send us a message</h4>
              <form 
                action={`https://formsubmit.co/jiyadsayydu@gmail.com`}
                method="POST"
                className="space-y-3"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  required
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                <Button type="submit" className="w-full" variant="gradient">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 sm:mt-20 text-center px-2"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-6 sm:px-8 py-4 sm:py-6 bg-muted/50 rounded-2xl backdrop-blur-sm">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Resumes Created</div>
            </div>
            <div className="w-16 h-px sm:h-12 sm:w-px bg-border" />
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-secondary">95%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">ATS Pass Rate</div>
            </div>
            <div className="w-16 h-px sm:h-12 sm:w-px bg-border" />
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-accent">5K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Job Matches</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

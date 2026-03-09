import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Target, MessageSquare, Sparkles, Briefcase, ArrowRight, Code2, Zap } from "lucide-react";

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
      section: "resume",
      tag: "builder",
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      icon: Target,
      title: "Job Match Analyzer",
      description: "Compare your resume with job descriptions and get detailed match scores",
      section: "matcher",
      tag: "analyzer",
      color: "text-secondary",
      bg: "bg-secondary/10 border-secondary/20",
    },
    {
      icon: Sparkles,
      title: "Resume Roast 🔥",
      description: "Get your resume brutally roasted with comedy memes and honest feedback",
      section: "roast",
      tag: "roast",
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
    },
    {
      icon: MessageSquare,
      title: "Interview Practice",
      description: "Prepare with role-specific interview questions and expert tips",
      section: "interview",
      tag: "practice",
      color: "text-accent",
      bg: "bg-accent/10 border-accent/20",
    },
    {
      icon: Briefcase,
      title: "Our Services",
      description: "Resume optimization, portfolio development, and professional guidance",
      section: "services",
      tag: "services",
      color: "text-warning",
      bg: "bg-warning/10 border-warning/20",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40" />
      
      {/* Gradient blobs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium mb-8 border border-primary/30 bg-primary/5 text-primary"
          >
            <Zap className="w-3 h-3" />
            AI-Powered Career Platform
            <Code2 className="w-3 h-3" />
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            Land Your{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              Dream Job
            </span>
            <br />
            with AI-Powered Tools
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Build ATS-optimized resumes, get your resume roasted, practice interviews, and analyze job matches — all in one powerful platform.
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" variant="gradient" onClick={onGetStarted} className="gap-2">
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* WhatsApp Quick Actions */}
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Button
              size="sm"
              variant="success"
              onClick={() => window.location.href = 'https://wa.me/917676074209?text=Hi%20FixMyCareer.in%2C%20I%20want%20to%20improve%20my%20business%20leads.'}
              className="gap-2 text-xs"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Improve Business Leads
            </Button>
            <Button
              size="sm"
              variant="success"
              onClick={() => window.location.href = 'https://wa.me/917676074209?text=Hi%20FixMyCareer.in%2C%20I%20need%20help%20finding%20a%20job.'}
              className="gap-2 text-xs"
            >
              <Target className="w-3.5 h-3.5" />
              Find a Job
            </Button>
            <Button
              size="sm"
              variant="success"
              onClick={() => window.location.href = 'https://wa.me/917676074209?text=Hi%20FixMyCareer.in%2C%20I%20need%20help%20with%20self%20branding.'}
              className="gap-2 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Self Branding
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-5 font-mono">
            // No login required · Privacy first · <span className="text-primary font-semibold">Resume Building</span> · <span className="text-secondary font-semibold">Interview Prep</span> · <span className="text-accent font-semibold">Career Services</span>
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.08 }}
              onClick={() => onNavigate(feature.section)}
              className="group relative bg-card rounded-xl p-5 border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${feature.bg} mb-4`}>
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <div className="font-mono text-[10px] text-muted-foreground mb-1">
                ./{feature.tag}
              </div>
              <h3 className="text-sm font-semibold mb-2 leading-snug">{feature.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-px max-w-lg mx-auto bg-border rounded-xl overflow-hidden mb-16"
        >
          {[
            { value: "10K+", label: "Resumes Created" },
            { value: "95%", label: "ATS Pass Rate" },
            { value: "5K+", label: "Job Matches" },
          ].map((stat, i) => (
            <div key={i} className="flex-1 min-w-[100px] bg-card px-6 py-4 text-center">
              <div className="text-xl font-bold font-mono text-primary">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card rounded-2xl border border-border p-8 max-w-3xl mx-auto shadow-lg"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <h3 className="text-xl font-bold">Contact Us</h3>
            <span className="font-mono text-xs text-muted-foreground ml-auto">// we're online</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                { label: "Company", value: "FixMyCareer.in" },
                { label: "Location", value: "Kochi, Kerala" },
                { label: "Phone", value: "+91 7676074209" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground w-16">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-16">Email</span>
                <a href="mailto:sayedmuhammedjiyad@gmail.com" className="text-sm text-primary hover:underline">
                  sayedmuhammedjiyad@gmail.com
                </a>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => window.location.href = 'https://wa.me/917676074209?text=Hi%20FixMyCareer.in%2C%20I%20need%20help%20with%20my%20career.'}
                  className="flex-1 text-xs"
                >
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:sayedmuhammedjiyad@gmail.com?subject=Career%20Help%20Request&body=Hi%20Panikittum%2C%20I%20need%20help%20with%20my%20career.'}
                  className="flex-1 text-xs"
                >
                  Email Us
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-3">// send_message()</p>
              <form
                action="https://formsubmit.co/jiyadsayydu@gmail.com"
                method="POST"
                className="space-y-3"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono placeholder:font-sans"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  required
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono placeholder:font-sans"
                />
                <textarea
                  name="message"
                  placeholder="Your message..."
                  required
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
                <Button type="submit" className="w-full" variant="gradient" size="sm">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

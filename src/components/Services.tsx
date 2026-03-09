import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Globe, UserCheck, Lightbulb, TrendingUp, MessageCircle, Mail, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: FileText,
      title: "Resume & Profile Optimization",
      description: "We optimize your resume and professional profiles to improve your chances of getting shortlisted by recruiters and ATS systems.",
    },
    {
      icon: Globe,
      title: "Portfolio Website Development",
      description: "We build professional portfolio websites to showcase your skills, projects, and achievements to potential employers.",
    },
    {
      icon: UserCheck,
      title: "Professional Presence Building",
      description: "Get guidance on building a strong professional presence across platforms to stand out in your industry.",
    },
    {
      icon: Lightbulb,
      title: "Personal Project Support",
      description: "We help you ideate, plan, and execute personal projects that strengthen your portfolio and skill set.",
    },
    {
      icon: TrendingUp,
      title: "Social Media Management",
      description: "We help businesses manage and optimize their social media profiles to improve digital presence and reach.",
      socialLogos: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Our Services
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            For users who are actively searching for jobs, we provide additional services to support your career growth, projects, and business goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6 h-full shadow-md hover:shadow-lg transition-shadow border border-border group hover:border-accent">
                <div className="bg-gradient-accent w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
                {(service as any).socialLogos && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                    <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                    <Facebook className="w-5 h-5 text-[#1877F2]" />
                    <Instagram className="w-5 h-5 text-[#E4405F]" />
                    <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 sm:p-8 shadow-lg text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3">Need Help?</h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              If you need help with any of these services, feel free to contact us. We are here to support your career growth, projects, and business goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="gradient"
                size="lg"
                onClick={() => window.location.href = "https://wa.me/917676074209?text=Hi%20FixMyCareer.in%2C%20I%20need%20help%20with%20my%20career."}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = "mailto:sayedmuhammedjiyad@gmail.com?subject=Career%20Support%20Inquiry&body=Hi%20Panikittum%2C%20I%20need%20help%20with%20my%20career."}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

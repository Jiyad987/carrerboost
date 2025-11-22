import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MessageSquare, Lightbulb, RefreshCw } from "lucide-react";

const interviewQuestions = {
  "software-engineer": [
    {
      question: "Tell me about a challenging technical problem you solved recently.",
      tips: "Use the STAR method (Situation, Task, Action, Result). Focus on your problem-solving process and technical decisions."
    },
    {
      question: "How do you stay updated with new technologies and industry trends?",
      tips: "Mention specific resources (blogs, conferences, courses). Show continuous learning mindset."
    },
    {
      question: "Describe your experience with version control and collaborative development.",
      tips: "Discuss Git workflows, code reviews, and team collaboration practices."
    },
    {
      question: "How do you approach debugging a complex issue in production?",
      tips: "Walk through your systematic approach: logging, reproducing, isolating, and fixing."
    },
    {
      question: "What's your experience with testing and ensuring code quality?",
      tips: "Discuss unit testing, integration testing, and your approach to writing maintainable code."
    }
  ],
  "data-scientist": [
    {
      question: "Explain a machine learning project you've worked on from start to finish.",
      tips: "Cover data collection, preprocessing, model selection, training, and evaluation. Include business impact."
    },
    {
      question: "How do you handle missing or incomplete data in your datasets?",
      tips: "Discuss various imputation techniques, when to remove data, and how you decide the best approach."
    },
    {
      question: "What's the difference between supervised and unsupervised learning?",
      tips: "Give clear definitions and real-world examples of when you'd use each approach."
    },
    {
      question: "How do you communicate technical findings to non-technical stakeholders?",
      tips: "Emphasize visualization, storytelling, and translating insights into business value."
    },
    {
      question: "Describe your experience with big data technologies and tools.",
      tips: "Mention specific tools (Spark, Hadoop, SQL) and explain scalability considerations."
    }
  ],
  "product-manager": [
    {
      question: "How do you prioritize features when you have limited resources?",
      tips: "Discuss frameworks like RICE or MoSCoW. Show data-driven decision making."
    },
    {
      question: "Tell me about a time you had to say no to a stakeholder request.",
      tips: "Demonstrate diplomacy while maintaining product vision and user focus."
    },
    {
      question: "How do you measure the success of a product feature?",
      tips: "Talk about KPIs, OKRs, user metrics, and how you tie features to business goals."
    },
    {
      question: "Describe your process for gathering and validating customer requirements.",
      tips: "Mention user research, interviews, surveys, and data analysis methods."
    },
    {
      question: "How do you work with engineering and design teams?",
      tips: "Emphasize collaboration, clear communication, and respecting each discipline's expertise."
    }
  ],
  "marketing-manager": [
    {
      question: "How do you develop and execute a go-to-market strategy?",
      tips: "Cover market research, positioning, channel selection, and success metrics."
    },
    {
      question: "Describe a successful campaign you've led and its results.",
      tips: "Use specific metrics (ROI, conversion rates, engagement). Explain your strategy and tactics."
    },
    {
      question: "How do you measure marketing ROI?",
      tips: "Discuss attribution models, KPIs, and how you track performance across channels."
    },
    {
      question: "What's your approach to content marketing and SEO?",
      tips: "Talk about content strategy, keyword research, and how you align content with buyer journey."
    },
    {
      question: "How do you use data to inform marketing decisions?",
      tips: "Mention analytics tools, A/B testing, and how you translate data into actionable insights."
    }
  ],
  "sales-representative": [
    {
      question: "Walk me through your sales process from lead to close.",
      tips: "Detail each stage: prospecting, qualification, presentation, objection handling, closing."
    },
    {
      question: "How do you handle rejection and stay motivated?",
      tips: "Show resilience, learning mindset, and strategies for maintaining positive attitude."
    },
    {
      question: "Describe a time you turned a difficult prospect into a customer.",
      tips: "Highlight persistence, listening skills, and creative problem-solving."
    },
    {
      question: "How do you build and maintain relationships with clients?",
      tips: "Discuss communication frequency, value-add interactions, and long-term relationship building."
    },
    {
      question: "What's your approach to hitting and exceeding sales targets?",
      tips: "Talk about goal-setting, pipeline management, and strategies for consistent performance."
    }
  ]
};

export const InterviewPractice = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);

  const loadQuestions = (role: string) => {
    setSelectedRole(role);
    setCurrentQuestions(interviewQuestions[role as keyof typeof interviewQuestions] || []);
  };

  const shuffleQuestions = () => {
    if (currentQuestions.length > 0) {
      const shuffled = [...currentQuestions].sort(() => Math.random() - 0.5);
      setCurrentQuestions(shuffled);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Interview Practice</h2>
          <p className="text-muted-foreground">Practice with role-specific interview questions</p>
        </div>

        <Card className="p-8 shadow-lg mb-8">
          <div className="space-y-4">
            <Label htmlFor="role" className="text-lg font-semibold">
              Select Your Target Role
            </Label>
            <Select onValueChange={loadQuestions}>
              <SelectTrigger id="role" className="w-full">
                <SelectValue placeholder="Choose a job role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software-engineer">Software Engineer</SelectItem>
                <SelectItem value="data-scientist">Data Scientist</SelectItem>
                <SelectItem value="product-manager">Product Manager</SelectItem>
                <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                <SelectItem value="sales-representative">Sales Representative</SelectItem>
              </SelectContent>
            </Select>
            
            {currentQuestions.length > 0 && (
              <Button onClick={shuffleQuestions} variant="outline" className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Shuffle Questions
              </Button>
            )}
          </div>
        </Card>

        {currentQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {currentQuestions.map((item, index) => (
              <Card key={index} className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-accent w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-3">
                      Question {index + 1}
                    </h3>
                    <p className="text-foreground mb-4 text-base">
                      {item.question}
                    </p>
                    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-accent" />
                        <span className="font-semibold text-sm">Answer Tips:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.tips}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {selectedRole && currentQuestions.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No questions available for this role yet.</p>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

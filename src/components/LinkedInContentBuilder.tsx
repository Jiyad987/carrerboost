import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hash, FileText, Copy, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LinkedInContentBuilder = () => {
  const { toast } = useToast();
  const [contentType, setContentType] = useState("");
  const [topic, setTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateContent = () => {
    if (!contentType || !topic) {
      toast({
        title: "Missing Information",
        description: "Please select content type and enter a topic.",
        variant: "destructive",
      });
      return;
    }

    // Simulate content generation
    setTimeout(() => {
      const templates: Record<string, string> = {
        "announcement": `🎉 Exciting News! 🎉

${topic}

I'm thrilled to share this milestone with my network. This journey has been incredible, and I'm grateful for the support along the way.

What's your experience with ${topic}? I'd love to hear your thoughts in the comments!`,
        "thought-leadership": `💡 Thoughts on ${topic}

After years in the industry, I've observed that ${topic} is reshaping how we work.

Here are 3 key insights:
1. The landscape is evolving faster than ever
2. Adaptability is becoming the most valuable skill
3. Collaboration drives innovation

What's your take on this? Let's discuss in the comments! 👇`,
        "case-study": `📊 Case Study: ${topic}

Recently, I worked on a project involving ${topic}. Here's what we learned:

🎯 Challenge: Identified key pain points
✅ Solution: Implemented strategic approach
📈 Results: Achieved measurable impact

Key Takeaway: Success comes from understanding the problem deeply before jumping to solutions.

Have you faced similar challenges? Share your experiences below!`,
        "tips": `🔑 5 Tips for ${topic}

1️⃣ Start with clear goals
2️⃣ Stay consistent with your efforts
3️⃣ Learn from failures and iterate
4️⃣ Build meaningful connections
5️⃣ Celebrate small wins

Which tip resonates with you most? Comment below! 💬`,
      };

      setGeneratedContent(templates[contentType] || templates["announcement"]);
      
      // Generate relevant hashtags
      const relevantHashtags = generateHashtags(topic);
      setHashtags(relevantHashtags);

      toast({
        title: "Content Generated!",
        description: "Your LinkedIn post is ready.",
      });
    }, 1000);
  };

  const generateHashtags = (topic: string): string[] => {
    const words = topic.toLowerCase().split(" ");
    const baseHashtags = words
      .filter(word => word.length > 3)
      .map(word => `#${word.charAt(0).toUpperCase() + word.slice(1)}`);
    
    const industryHashtags = [
      "#ProfessionalDevelopment",
      "#CareerGrowth",
      "#Leadership",
      "#Innovation",
      "#Networking",
      "#Success",
      "#Learning",
      "#Motivation"
    ];

    return [...baseHashtags, ...industryHashtags].slice(0, 10);
  };

  const copyToClipboard = () => {
    const fullContent = `${generatedContent}\n\n${hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullContent);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          LinkedIn Content Builder
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="contentType">Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger id="contentType" className="mt-2">
                <SelectValue placeholder="Choose content type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                <SelectItem value="case-study">Case Study</SelectItem>
                <SelectItem value="tips">Tips & Advice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="topic">Topic</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What do you want to post about?"
              className="mt-2"
              rows={2}
            />
          </div>

          <Button onClick={generateContent} variant="gradient" className="w-full">
            Generate Content
          </Button>
        </div>
      </Card>

      {generatedContent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generated Post</h3>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg mb-4 whitespace-pre-wrap">
              {generatedContent}
            </div>
          </Card>

          <Card className="p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-accent" />
              Suggested Hashtags
            </h3>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((hashtag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#0077B5]/10 text-[#0077B5] rounded-full text-sm font-medium"
                >
                  {hashtag}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
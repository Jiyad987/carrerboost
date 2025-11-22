import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const InterviewPractice = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startInterview = async () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose a job role to begin your practice interview",
        variant: "destructive",
      });
      return;
    }

    setIsStarted(true);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('interview-chat', {
        body: {
          messages: [{ role: 'user', content: 'Hello! I am ready to start the interview.' }],
          role: selectedRole,
        }
      });

      if (error) throw error;

      if (data?.message) {
        setMessages([{ role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: "Error",
        description: "Failed to start the interview. Please try again.",
        variant: "destructive",
      });
      setIsStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputText };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('interview-chat', {
        body: {
          messages: [...messages, userMessage],
          role: selectedRole,
        }
      });

      if (error) throw error;

      if (data?.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetInterview = () => {
    setMessages([]);
    setIsStarted(false);
    setInputText("");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-accent" />
            <h2 className="text-4xl font-bold">AI Interview Practice</h2>
          </div>
          <p className="text-muted-foreground">Practice with an AI interviewer tailored to your role</p>
        </div>

        {!isStarted ? (
          <Card className="p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <Label htmlFor="role" className="text-lg font-semibold">
                  Select Your Target Role
                </Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger id="role" className="w-full mt-2">
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
              </div>
              
              <Button 
                onClick={startInterview} 
                className="w-full bg-gradient-accent hover:opacity-90"
                disabled={!selectedRole || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Starting Interview...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start AI Interview
                  </>
                )}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  <span className="font-semibold">Interview in Progress</span>
                </div>
                <Button variant="outline" onClick={resetInterview} size="sm">
                  End Interview
                </Button>
              </div>

              <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-4 p-4 bg-secondary/20 rounded-lg">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent/10 border border-accent/20'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                      <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your answer here... (Press Enter to send)"
                  className="min-h-[80px] resize-none"
                  disabled={isLoading}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputText.trim() || isLoading}
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
};

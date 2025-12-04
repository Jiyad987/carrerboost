import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Loader2, Sparkles, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [feedback, setFeedback] = useState<{score: number, feedback: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition with voice activity detection
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);

        // Clear existing silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Set new silence timer - auto-submit after 2 seconds of silence
        silenceTimerRef.current = setTimeout(() => {
          if (transcript.trim() && recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            // Auto-submit the message
            setTimeout(() => {
              if (transcript.trim()) {
                sendMessage();
              }
            }, 100);
          }
        }, 2000);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech recognition error",
          description: "Please try again",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [toast]);

  const speak = (text: string) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech recognition not supported",
        description: "Please use a compatible browser",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

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
        speak(data.message);
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
        speak(data.message);
        
        // Display feedback if provided
        if (data.score !== undefined && data.feedback) {
          setFeedback({ score: data.score, feedback: data.feedback });
        }
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
    window.speechSynthesis.cancel();
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8 sm:mb-12 px-2">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-accent" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">AI Interview Practice</h2>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">Practice with an AI interviewer tailored to your role</p>
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
                    <SelectItem value="data-analyst">Data Analyst</SelectItem>
                    <SelectItem value="business-analyst">Business Analyst</SelectItem>
                    <SelectItem value="gtm-engineer">GTM Engineer</SelectItem>
                    <SelectItem value="devops-engineer">DevOps Engineer</SelectItem>
                    <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
                    <SelectItem value="backend-developer">Backend Developer</SelectItem>
                    <SelectItem value="fullstack-developer">Full Stack Developer</SelectItem>
                    <SelectItem value="product-manager">Product Manager</SelectItem>
                    <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                    <SelectItem value="sales-representative">Sales Representative</SelectItem>
                    <SelectItem value="qa-engineer">QA Engineer</SelectItem>
                    <SelectItem value="ui-ux-designer">UI/UX Designer</SelectItem>
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  <span className="text-sm sm:text-base font-semibold">Interview in Progress</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsSpeechEnabled(!isSpeechEnabled);
                      if (isSpeechEnabled) {
                        window.speechSynthesis.cancel();
                      }
                    }}
                  >
                    {isSpeechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" onClick={resetInterview} size="sm">
                    End
                  </Button>
                </div>
              </div>

              {feedback && (
                <div className="mb-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl font-bold text-accent">{feedback.score}/10</div>
                    <span className="text-sm font-semibold">Answer Score</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{feedback.feedback}</p>
                </div>
              )}

              <div className="space-y-4 min-h-[250px] sm:min-h-[400px] max-h-[350px] sm:max-h-[500px] overflow-y-auto mb-4 p-3 sm:p-4 bg-secondary/20 rounded-lg">
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

              <div className="flex flex-col sm:flex-row gap-2">
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type or speak your answer..."
                  className="min-h-[60px] sm:min-h-[80px] resize-none flex-1"
                  disabled={isLoading || isListening}
                />
                <div className="flex sm:flex-col gap-2 justify-end">
                  <Button 
                    onClick={toggleListening}
                    disabled={isLoading}
                    variant={isListening ? "destructive" : "outline"}
                    size="sm"
                    className="sm:size-auto"
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button 
                    onClick={sendMessage} 
                    disabled={!inputText.trim() || isLoading || isListening}
                    size="sm"
                    className="sm:size-auto"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
};

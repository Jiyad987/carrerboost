import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenLine, Send, Clock, User, Heart, Tag, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  author_name: string;
  title: string;
  content: string;
  tags: string[];
  likes_count: number;
  created_at: string;
}

export const Blog = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newPost, setNewPost] = useState({
    author_name: "",
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newPost.author_name || !newPost.title || !newPost.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name, title, and content.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const tagsArray = newPost.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { error } = await supabase
        .from('blog_posts')
        .insert({
          author_name: newPost.author_name,
          title: newPost.title,
          content: newPost.content,
          tags: tagsArray,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your post has been published.",
      });

      setNewPost({ author_name: "", title: "", content: "", tags: "" });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to publish your post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8 sm:mb-12 px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            Career Community Blog
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Share your career insights, tips, and experiences with the community
          </p>
        </div>

        <Tabs defaultValue="read" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="read" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Read Posts
            </TabsTrigger>
            <TabsTrigger value="write" className="flex items-center gap-2">
              <PenLine className="w-4 h-4" />
              Write Post
            </TabsTrigger>
          </TabsList>

          <TabsContent value="read" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to share your career insights!
                </p>
                <Button variant="outline">Write a Post</Button>
              </Card>
            ) : (
              posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likes_count}
                      </span>
                    </div>
                    <p className="text-foreground/80 mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="write">
            <Card className="p-6 shadow-lg">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="author">Your Name</Label>
                  <Input
                    id="author"
                    value={newPost.author_name}
                    onChange={(e) => setNewPost({ ...newPost, author_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Post Title</Label>
                  <Input
                    id="title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="5 Tips for Landing Your Dream Job"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Share your insights, experiences, or tips..."
                    rows={10}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="career tips, resume, interview"
                  />
                </div>
                <Button 
                  onClick={handleSubmit} 
                  variant="gradient" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Publishing..." : "Publish Post"}
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

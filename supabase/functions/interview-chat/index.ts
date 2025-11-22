import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, role } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // System prompts for different roles
    const rolePrompts = {
      "software-engineer": "You are an experienced technical interviewer for software engineering positions. Ask thoughtful, progressively challenging questions about coding, system design, algorithms, and problem-solving. Follow up on answers with deeper technical questions. Be encouraging but thorough. Ask one question at a time.",
      "data-scientist": "You are an experienced interviewer for data science positions. Ask questions about statistics, machine learning, data analysis, and business impact. Probe for understanding of methodologies and practical applications. Be supportive while assessing depth of knowledge. Ask one question at a time.",
      "product-manager": "You are an experienced interviewer for product management positions. Ask about product strategy, prioritization, stakeholder management, and user-centric thinking. Evaluate both strategic thinking and execution capabilities. Be collaborative in your approach. Ask one question at a time.",
      "marketing-manager": "You are an experienced interviewer for marketing positions. Ask about campaign strategy, metrics, ROI, content marketing, and go-to-market approaches. Assess both creative and analytical thinking. Be engaging and professional. Ask one question at a time.",
      "sales-representative": "You are an experienced interviewer for sales positions. Ask about sales methodology, relationship building, objection handling, and target achievement. Look for resilience, communication skills, and customer focus. Be direct but encouraging. Ask one question at a time."
    };

    const systemPrompt = rolePrompts[role as keyof typeof rolePrompts] || rolePrompts["software-engineer"];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to continue." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }), 
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({ message: content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Interview chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

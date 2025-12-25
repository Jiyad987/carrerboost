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
    const { query, filters, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'job-search') {
      systemPrompt = `You are a job search assistant. Based on the user's query and filters, generate a list of 5-8 realistic job listings. Each job should include:
- title: Job title
- company: Company name
- location: Location (consider remote if specified)
- salary: Salary range
- type: Full-time/Part-time/Contract
- experience: Years of experience required
- description: Brief job description (2-3 sentences)
- skills: Array of required skills
- postedDate: When posted (e.g., "2 days ago")

Return ONLY a valid JSON array of job objects.`;

      userPrompt = `Find jobs matching: "${query}"
Filters: ${JSON.stringify(filters || {})}`;
    } else if (type === 'hr-email') {
      systemPrompt = `You are a professional networking assistant. Based on the company name and job role, generate realistic HR and hiring manager contact information. Include:
- hrEmail: HR department email
- hrName: HR contact name
- recruiterEmail: Recruiter email if different
- companyEmail: General company email format
- linkedinTip: Tip for finding the hiring manager on LinkedIn
- emailTemplate: A brief professional outreach email template

Return ONLY valid JSON.`;

      userPrompt = `Company: "${query.company}"
Role: "${query.role || 'General inquiry'}"`;
    } else if (type === 'cover-letter') {
      systemPrompt = `You are a professional cover letter writer. Create a compelling, personalized cover letter based on the provided information. The letter should:
- Be professional yet personable
- Highlight relevant experience and skills
- Show enthusiasm for the company and role
- Be concise (3-4 paragraphs)
- Include proper formatting

Return the cover letter as plain text.`;

      userPrompt = `Write a cover letter for:
Company: ${query.company}
Position: ${query.position}
Candidate Name: ${query.name}
Candidate Summary: ${query.summary || 'Experienced professional'}
Key Skills: ${query.skills || 'Various professional skills'}`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI service error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let result;
    if (type === 'cover-letter') {
      result = { coverLetter: content };
    } else {
      // Try to parse JSON from the response
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        } else {
          result = content;
        }
      } catch {
        result = content;
      }
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('AI job search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

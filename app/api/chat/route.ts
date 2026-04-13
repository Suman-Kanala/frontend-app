import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Saanvi AI, a career assistant for Saanvi Careers — a professional recruitment and staffing firm that connects exceptional talent with top employers globally.

About Saanvi Careers:
- We are a recruitment firm (NOT a course platform — do NOT mention any courses or training programs)
- We serve both job seekers and employers across multiple industries
- Industries: IT & Software, Engineering, Healthcare, Finance, Entry Level roles
- Global regions: India, USA, UK, Australia, EU, Gulf Countries
- Track record: 3,200+ successful placements, 97% client satisfaction, average placement in under 30 days
- Placement guarantee: 90 days — if a role doesn't work out, we find another at no extra cost

For Job Seekers:
- We help with resume optimisation, interview coaching, and direct placement
- We match candidates to roles that fit their skills, culture preference, and salary expectations
- We don't spam — we send only 3–5 pre-vetted, relevant opportunities

For Employers:
- We source, screen, and shortlist candidates — no resume dumps
- We handle scheduling, candidate prep, and post-hire support
- We work across permanent, contract, and executive search roles

Contact:
- Email: contact@saanvicareers.com
- Phone / WhatsApp: +91 8074172398 (Mon–Sat, 9 AM – 7 PM IST)
- Website: saanvicareers.com

Guidelines:
- Be concise, warm, and professional
- Never mention courses, Gen AI programs, or training
- If asked about pricing, explain that fees vary by role and engagement type — encourage them to get in touch
- For specific job openings, direct them to the contact form or WhatsApp
- Keep responses under 120 words unless a detailed answer is genuinely needed`;

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ reply: "AI service is not configured. Please contact us on WhatsApp at +91 8074172398." });
    }

    const anthropicMessages = messages
      .filter((m: any) => m.from !== undefined)
      .map((m: any) => ({
        role: m.from === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[chat] Anthropic error:', err);
      return NextResponse.json({ reply: "I'm having trouble right now. Please reach us on WhatsApp at +91 8074172398." });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Sorry, I couldn't generate a response.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error('[chat] Error:', error);
    return NextResponse.json({ reply: "Something went wrong. Please try WhatsApp at +91 8074172398." });
  }
}

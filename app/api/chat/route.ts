import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are Saanvi AI, a helpful career assistant for Saanvi Careers — a platform offering a Gen AI Program and career development resources.

Key info:
- Gen AI Program: Comprehensive course covering AI/ML, prompt engineering, LLMs, and real-world projects
- Price: ₹6,000–₹8,000 depending on experience level
- Contact: contact@saanvicareers.com | WhatsApp: +91 8074172398
- Website: saanvicareers.com

Be concise, friendly, and helpful. Focus on career guidance, course details, and job opportunities.`;

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

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function stripMarkdown(text: string): string {
  return text
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const { currentResume, modifications, jobProfile } = await req.json();

    if (!currentResume || !modifications) {
      return NextResponse.json({ error: 'Current resume and modifications are required' }, { status: 400 });
    }

    const prompt = `Apply these modifications to the resume HTML below.

Modifications: ${modifications}
Target Job Profile: ${jobProfile || 'Not specified'}

Rules:
- Apply ONLY the requested changes
- Keep all other content intact
- Maintain ATS-optimized formatting
- Keep quantified metrics in all bullets
- Return ONLY the complete updated HTML, nothing else

Current Resume HTML:
${currentResume}`;

    let resumeHtml = '';

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: 'You are an expert resume writer. Apply changes precisely while maintaining professional quality. Always return only raw HTML — no markdown, no backticks.',
      });
      const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
      resumeHtml = stripMarkdown(result.response.text() || '');
    } catch (geminiErr: any) {
      console.log('Gemini modify failed, using Groq fallback...');
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 4000,
        temperature: 0.3,
        messages: [
          { role: 'system', content: 'You are an expert resume writer. Apply changes precisely. Always return only raw HTML — no markdown, no backticks.' },
          { role: 'user', content: prompt },
        ],
      });
      resumeHtml = stripMarkdown(completion.choices[0]?.message?.content ?? '');
    }

    return NextResponse.json({ success: true, resumeHtml });

  } catch (error: any) {
    console.error('ATS Resume modification error:', error);
    return NextResponse.json({ error: error.message || 'Failed to apply modifications' }, { status: 500 });
  }
}

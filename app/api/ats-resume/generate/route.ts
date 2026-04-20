import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

export const runtime = 'nodejs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GEMINI_MODEL = 'gemini-2.0-flash';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

function stripMarkdown(text: string): string {
  return text
    .replace(/^```html\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

async function extractTextFromFile(buffer: Buffer, fileName: string): Promise<string> {
  const lower = fileName.toLowerCase();

  if (lower.endsWith('.txt')) {
    return buffer.toString('utf-8');
  }

  if (lower.endsWith('.doc') || lower.endsWith('.docx')) {
    try {
      const mammoth = (await import('mammoth')).default;
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (e) {
      console.error('mammoth error:', e);
      return '';
    }
  }

  // PDF — Gemini handles PDFs natively, return base64
  return `__PDF_BASE64__:${buffer.toString('base64')}`;
}

async function callGemini(prompt: string, pdfBase64?: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: `You are an elite resume writer. Your resumes are ATS-optimized, filled with quantified achievements, and written in strong action verb + impact format. ALWAYS return only raw HTML when asked for HTML. Never use markdown code blocks or backticks.`,
  });

  const parts: any[] = [];
  if (pdfBase64) {
    parts.push({ inlineData: { mimeType: 'application/pdf', data: pdfBase64 } });
  }
  parts.push({ text: prompt });

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
      return result.response.text() || '';
    } catch (err: any) {
      if (err?.status === 429 && attempt < 2) {
        await new Promise(r => setTimeout(r, (attempt + 1) * 6000));
        continue;
      }
      throw err;
    }
  }
  return '';
}

// Fallback to Groq when Gemini is unavailable
async function callGroq(prompt: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    max_tokens: 4000,
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: 'You are an elite resume writer. Your resumes are ATS-optimized, filled with quantified achievements, and written in strong action verb + impact format. ALWAYS return only raw HTML when asked for HTML. Never use markdown code blocks or backticks.',
      },
      { role: 'user', content: prompt },
    ],
  });
  return completion.choices[0]?.message?.content ?? '';
}

// Smart caller — tries Gemini first, falls back to Claude on any error
async function callLLM(prompt: string, pdfBase64?: string): Promise<string> {
  if (pdfBase64) {
    // PDF must use Gemini
    return callGemini(prompt, pdfBase64);
  }
  try {
    return await callGemini(prompt);
  } catch (err: any) {
    const status = err?.status;
    // Fall back to Claude on quota, overload, or any server error
    if (status === 429 || status === 503 || status === 500 || status === 404 ||
        err?.message?.includes('quota') || err?.message?.includes('unavailable')) {
      console.log(`Gemini error (${status}), falling back to Groq...`);
      return callGroq(prompt);
    }
    throw err;
  }
}

function buildExtractPrompt(resumeText: string): string {
  return `Extract personal details from this resume. Be thorough.

Return ONLY a simple list:
- Full name
- Email
- Phone
- LinkedIn URL (if present)
- GitHub URL (if present)
- Education: institution, degree, years, GPA
- Work experience: company name + job title + dates only (NO descriptions)
- Certifications: name + issuer + year

Resume:
${resumeText}`;
}

function buildPrompt(
  personalDetails: string,
  jobProfile: string,
  variant: string,
  linkedInUrl: string,
  gitHubUrl: string,
  certText: string,
  includeCerts: boolean,
  jdKeywords = '',
): string {
  const contactExtra = [
    linkedInUrl ? `LinkedIn: ${linkedInUrl}` : '',
    gitHubUrl ? `GitHub: ${gitHubUrl}` : '',
  ].filter(Boolean).join(' | ');

  const certSection = includeCerts && certText.trim()
    ? `Include CERTIFICATIONS section with:\n${certText}`
    : includeCerts ? 'Include CERTIFICATIONS section from personal details'
    : 'No certifications section';

  return `Write a complete ATS-optimized HTML resume. Return ONLY raw HTML, no markdown, no backticks.

PERSONAL DETAILS (use exactly, never invent):
${personalDetails}
${contactExtra ? `Extra contact: ${contactExtra}` : ''}

TARGET ROLE: ${jobProfile}
STYLE: ${variant}

RULES:
- Rewrite all experience/skills/projects from scratch for ${jobProfile}
- Every bullet: action verb + what + metric (%, $, numbers)
- Skills: 5 categories, one line each, comma-separated
- 3-4 projects with tech stack and 3 metric bullets each
- Summary: 4-5 sentences with impact and technologies
- ${certSection}
- Include ALL education from personal details
- Use standard headings: PROFESSIONAL SUMMARY, TECHNICAL SKILLS, PROFESSIONAL EXPERIENCE, PROJECT HIGHLIGHTS, EDUCATION
${jdKeywords}

CSS to embed in <style>:
body{font-family:'Helvetica Neue',Arial,sans-serif;font-size:10pt;color:#111;padding:36px 54px;line-height:1.45}
h1{font-size:18pt;font-weight:700;text-transform:uppercase;text-align:center;margin-bottom:2px}
.subtitle{text-align:center;font-size:10pt;font-weight:600;color:#333}
.contact{text-align:center;font-size:8.5pt;color:#444;margin-top:4px}
.contact a{color:#111;text-decoration:none}
.section{margin-top:12px}
.section-title{font-size:10.5pt;font-weight:700;text-transform:uppercase;border-bottom:1.5px solid #111;padding-bottom:2px;margin-bottom:7px}
.skills-table{width:100%;table-layout:fixed;border-collapse:collapse}
.skills-table td{font-size:9.5pt;padding-bottom:3px;vertical-align:top}
.skills-table td:first-child{font-weight:700;width:170px;padding-right:8px;white-space:nowrap}
.exp-block{margin-bottom:10px}
.exp-row{display:flex;justify-content:space-between}
.company{font-weight:700;font-size:10pt}
.role{font-style:italic;font-size:9.5pt}
.dates,.location{font-size:8.5pt;color:#555}
ul{padding-left:16px;margin-top:4px}
li{font-size:9.5pt;margin-bottom:3px;line-height:1.45}
.proj-block{margin-bottom:9px}
.proj-name{font-weight:700;font-size:10pt}
.proj-tech{font-style:italic;font-size:8.5pt;color:#555}
.edu-block{margin-bottom:6px}
.edu-row{display:flex;justify-content:space-between}
.degree{font-weight:700;font-size:9.5pt}
.year{font-size:8.5pt;color:#555}
.school{font-size:9pt;color:#333}
@page{margin:0.4in}

Write the complete resume HTML now for ${jobProfile}.`;
}

function buildRatingPrompt(html: string, jobProfile: string): string {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 1500);
  return `Rate this resume for ${jobProfile}. Return ONLY valid JSON:
{"ats":9,"impact":9,"technical":9,"readability":9,"overall":9}
Scores 8-10 only. Resume: ${text}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get('resume') as File;
    const jobProfile = formData.get('jobProfile') as string;
    const jdText = (formData.get('jdText') as string) || '';

    if (!resumeFile || (!jobProfile && !jdText)) {
      return NextResponse.json({ error: 'Resume file and job profile are required' }, { status: 400 });
    }

    const arrayBuffer = await resumeFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const optionsRaw = formData.get('options') as string;
    const options = optionsRaw ? JSON.parse(optionsRaw) : {};
    const linkedInUrl = options.hasLinkedIn && options.linkedInUrl ? options.linkedInUrl : '';
    const gitHubUrl = options.hasGitHub && options.gitHubUrl ? options.gitHubUrl : '';
    const includeCerts = options.hasCertifications === true;
    const certText = options.certificationsText || '';

    // Handle JD Matcher mode
    let effectiveJobProfile = jobProfile || 'Professional';
    let jdKeywords = '';

    if (jdText.trim()) {
      const jdAnalysis = await callLLM(
        `Analyze this job description. Return ONLY JSON:
{"title":"job title","keywords":["keyword1","keyword2"],"requirements":["req1","req2","req3"]}

Job Description: ${jdText.substring(0, 2000)}`
      );
      try {
        const match = jdAnalysis.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          effectiveJobProfile = parsed.title || jobProfile;
          jdKeywords = `\nCRITICAL JD KEYWORDS (must appear in resume):\n${(parsed.keywords || []).join(', ')}\n\nKEY REQUIREMENTS:\n${(parsed.requirements || []).join('\n')}`;
        }
      } catch {}
    }

    // Extract text from file
    const rawText = await extractTextFromFile(buffer, resumeFile.name);
    const isPdf = rawText.startsWith('__PDF_BASE64__:');
    const pdfBase64 = isPdf ? rawText.replace('__PDF_BASE64__:', '') : undefined;
    const textContent = isPdf ? '' : rawText;

    // Step 1: Extract personal details
    let personalDetails = '';
    if (isPdf && pdfBase64) {
      personalDetails = await callLLM(buildExtractPrompt('(see attached PDF)'), pdfBase64);
    } else {
      personalDetails = await callLLM(buildExtractPrompt(textContent.substring(0, 4000)));
    }

    // Step 2: Generate 3 variants in parallel
    const variantStyles = [
      'Classic Professional: Clean, conservative, black-and-white. Strong technical depth.',
      'Impact-Driven: Every bullet leads with a bold metric. Results-focused. Use color #635bff for section titles only.',
      'Executive Modern: Minimal and elegant. Strong summary. Add style="border-left:3px solid #635bff;padding-left:8px;margin-bottom:8px" to each exp-block div.',
    ];

    const [v1, v2, v3] = await Promise.all(
      variantStyles.map(style =>
        callLLM(buildPrompt(personalDetails, effectiveJobProfile, style, linkedInUrl, gitHubUrl, certText, includeCerts, jdKeywords))
      )
    );

    const variants = [v1, v2, v3].map(stripMarkdown);

    // Step 3: Rate all 3 in parallel
    const [r1, r2, r3] = await Promise.all(
      variants.map(html => callLLM(buildRatingPrompt(html, effectiveJobProfile)))
    );

    const ratings = [r1, r2, r3].map(text => {
      try {
        const match = text.trim().match(/\{[^}]+\}/);
        if (match) {
          const p = JSON.parse(match[0]);
          const ats = Math.max(+p.ats || 8, 8);
          const impact = Math.max(+p.impact || 8, 8);
          const technical = Math.max(+p.technical || 8, 8);
          const readability = Math.max(+p.readability || 8, 8);
          const overall = Math.round(((ats + impact + technical + readability) / 4) * 10) / 10;
          return { ats, impact, technical, readability, overall };
        }
      } catch {}
      return { ats: 8.5, impact: 8.5, technical: 8.5, readability: 8.5, overall: 8.5 };
    });

    return NextResponse.json({ success: true, variants, ratings });

  } catch (error: any) {
    console.error('ATS Resume generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate resume' }, { status: 500 });
  }
}

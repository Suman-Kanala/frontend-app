/**
 * MCP (Model Context Protocol) server for Saanvi Careers ATS Resume Builder
 * Exposes resume generation as MCP tools that can be called by any MCP client
 */
import { NextRequest, NextResponse } from 'next/server';

// MCP Tool definitions
const TOOLS = [
  {
    name: 'generate_ats_resume',
    description: 'Generate 3 ATS-optimized resume variants from resume text and a target job role or job description. Returns HTML resumes with quality scores.',
    inputSchema: {
      type: 'object',
      properties: {
        resumeText: {
          type: 'string',
          description: 'The full text content of the candidate\'s current resume',
        },
        jobProfile: {
          type: 'string',
          description: 'Target job role (e.g., "Senior DevOps Engineer at Google"). Use this OR jobDescription.',
        },
        jobDescription: {
          type: 'string',
          description: 'Full job description text for JD Matcher mode. When provided, resume will match 90%+ of JD keywords.',
        },
        linkedInUrl: {
          type: 'string',
          description: 'Optional LinkedIn profile URL to include in resume header',
        },
        gitHubUrl: {
          type: 'string',
          description: 'Optional GitHub profile URL to include in resume header',
        },
        certifications: {
          type: 'string',
          description: 'Optional certifications to include (one per line)',
        },
      },
      required: ['resumeText'],
    },
  },
  {
    name: 'modify_ats_resume',
    description: 'Apply specific modifications to an existing ATS resume HTML. Returns the updated resume HTML.',
    inputSchema: {
      type: 'object',
      properties: {
        currentResumeHtml: {
          type: 'string',
          description: 'The current resume HTML to modify',
        },
        modifications: {
          type: 'string',
          description: 'Description of changes to apply (e.g., "Add more cloud skills", "Strengthen the summary")',
        },
        jobProfile: {
          type: 'string',
          description: 'Target job profile for context',
        },
      },
      required: ['currentResumeHtml', 'modifications'],
    },
  },
  {
    name: 'analyze_resume',
    description: 'Analyze a resume and return ATS scores, strengths, weaknesses, and improvement suggestions.',
    inputSchema: {
      type: 'object',
      properties: {
        resumeText: {
          type: 'string',
          description: 'Resume text or HTML to analyze',
        },
        jobProfile: {
          type: 'string',
          description: 'Target job role for context-specific analysis',
        },
      },
      required: ['resumeText'],
    },
  },
];

// Handle MCP protocol messages
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, params, id } = body;

    // MCP initialize
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: { tools: {} },
          serverInfo: {
            name: 'saanvi-ats-resume',
            version: '1.0.0',
            description: 'Saanvi Careers ATS Resume Builder — Generate professional, ATS-optimized resumes',
          },
        },
      });
    }

    // List tools
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        result: { tools: TOOLS },
      });
    }

    // Call tool
    if (method === 'tools/call') {
      const { name, arguments: args } = params;

      if (name === 'generate_ats_resume') {
        const result = await handleGenerateResume(args);
        return NextResponse.json({ jsonrpc: '2.0', id, result });
      }

      if (name === 'modify_ats_resume') {
        const result = await handleModifyResume(args);
        return NextResponse.json({ jsonrpc: '2.0', id, result });
      }

      if (name === 'analyze_resume') {
        const result = await handleAnalyzeResume(args);
        return NextResponse.json({ jsonrpc: '2.0', id, result });
      }

      return NextResponse.json({
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Unknown tool: ${name}` },
      });
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32601, message: `Unknown method: ${method}` },
    });

  } catch (error: any) {
    return NextResponse.json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32603, message: error.message || 'Internal error' },
    });
  }
}

// GET — return MCP server info
export async function GET() {
  return NextResponse.json({
    name: 'Saanvi Careers ATS Resume Builder',
    version: '1.0.0',
    description: 'MCP server for generating ATS-optimized resumes',
    tools: TOOLS.map(t => ({ name: t.name, description: t.description })),
    endpoint: '/api/mcp/ats-resume',
    protocol: 'MCP 2024-11-05',
  });
}

async function handleGenerateResume(args: any) {
  const { resumeText, jobProfile, jobDescription, linkedInUrl, gitHubUrl, certifications } = args;

  if (!resumeText) {
    return { content: [{ type: 'text', text: 'Error: resumeText is required' }], isError: true };
  }

  try {
    const blob = new Blob([resumeText], { type: 'text/plain' });
    const fd = new FormData();
    fd.append('resume', blob, 'resume.txt');
    fd.append('jobProfile', jobProfile || jobDescription?.substring(0, 100) || 'Professional');
    fd.append('jdText', jobDescription || '');
    fd.append('options', JSON.stringify({
      hasLinkedIn: !!linkedInUrl,
      linkedInUrl: linkedInUrl || '',
      hasGitHub: !!gitHubUrl,
      gitHubUrl: gitHubUrl || '',
      hasCertifications: !!certifications,
      certificationsText: certifications || '',
    }));

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/ats-resume/generate`, { method: 'POST', body: fd });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    const summary = data.variants.map((html: string, i: number) => {
      const r = data.ratings[i];
      return `Variant ${i + 1} (Score: ${r.overall}/10) — ATS: ${r.ats}, Impact: ${r.impact}, Technical: ${r.technical}, Readability: ${r.readability}`;
    }).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `Generated 3 ATS-optimized resume variants:\n\n${summary}\n\nVariant 1 HTML length: ${data.variants[0]?.length || 0} chars`,
        },
        {
          type: 'resource',
          resource: {
            uri: 'resume://variant-1',
            mimeType: 'text/html',
            text: data.variants[0] || '',
          },
        },
        {
          type: 'resource',
          resource: {
            uri: 'resume://variant-2',
            mimeType: 'text/html',
            text: data.variants[1] || '',
          },
        },
        {
          type: 'resource',
          resource: {
            uri: 'resume://variant-3',
            mimeType: 'text/html',
            text: data.variants[2] || '',
          },
        },
      ],
    };
  } catch (err: any) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
}

async function handleModifyResume(args: any) {
  const { currentResumeHtml, modifications, jobProfile } = args;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/ats-resume/modify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentResume: currentResumeHtml, modifications, jobProfile }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    return {
      content: [
        { type: 'text', text: 'Modifications applied successfully.' },
        { type: 'resource', resource: { uri: 'resume://modified', mimeType: 'text/html', text: data.resumeHtml } },
      ],
    };
  } catch (err: any) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
}

async function handleAnalyzeResume(args: any) {
  const { resumeText, jobProfile } = args;

  try {
    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const text = resumeText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 2000);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `Analyze this resume for a ${jobProfile || 'professional'} role. Return JSON:
{
  "scores": {"ats": 0-10, "impact": 0-10, "technical": 0-10, "readability": 0-10, "overall": 0-10},
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"]
}

Resume: ${text}`,
      }],
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const match = raw.match(/\{[\s\S]*\}/);
    const analysis = match ? JSON.parse(match[0]) : {};

    return {
      content: [{
        type: 'text',
        text: JSON.stringify(analysis, null, 2),
      }],
    };
  } catch (err: any) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
}

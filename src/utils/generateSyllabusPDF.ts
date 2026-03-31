import jsPDF from "jspdf";

interface ColorRGB {
  [key: string]: [number, number, number];
}

interface StatData {
  num: string;
  label: string;
  sub: string;
}

interface InfoItem {
  label: string;
  value: string;
}

interface AudienceItem {
  title: string;
  desc: string;
  color: [number, number, number];
  bg: [number, number, number];
}

interface ModuleData {
  day: string;
  title: string;
  topics: string[];
  deliverable: string;
}

interface ProjectData {
  title: string;
  tag: string;
  desc: string;
  tools: string[];
  color: [number, number, number];
  bg: [number, number, number];
}

interface ToolCategory {
  cat: string;
  items: string;
  color: [number, number, number];
}

export function generateSyllabusPDF(): void {
  const doc = new jsPDF("p", "mm", "a4");
  const W = doc.internal.pageSize.getWidth(); // 210
  const H = doc.internal.pageSize.getHeight(); // 297
  const ml = 18; // left margin
  const mr = 18; // right margin
  const cW = W - ml - mr; // content width
  let y = 0;

  // ── Professional Color Palette ──
  const c: Record<string, [number, number, number]> = {
    primary: [37, 99, 235],      // blue-600
    primaryDark: [29, 78, 216],   // blue-700
    secondary: [109, 40, 217],    // purple-600
    dark: [15, 23, 42],           // slate-900
    heading: [30, 41, 59],        // slate-800
    body: [71, 85, 105],          // slate-500
    muted: [148, 163, 184],       // slate-400
    border: [226, 232, 240],      // slate-200
    bgLight: [248, 250, 252],     // slate-50
    white: [255, 255, 255],
    accent: [14, 165, 233],       // sky-500
    green: [34, 197, 94],         // green-500
    greenDark: [22, 163, 74],     // green-600
    greenBg: [240, 253, 244],     // green-50
    blueBg: [239, 246, 255],      // blue-50
    purpleBg: [245, 243, 255],    // purple-50
    orange: [249, 115, 22],       // orange-500
    orangeBg: [255, 247, 237],    // orange-50
  };

  // ── Helpers ──
  const addPage = (): void => { doc.addPage(); y = 25; };
  const need = (n: number = 30): void => { if (y + n > H - 20) addPage(); };

  const roundedRect = (x: number, yy: number, w: number, h: number, fill: [number, number, number], r: number = 3): void => {
    doc.setFillColor(...fill);
    doc.roundedRect(x, yy, w, h, r, r, "F");
  };

  const roundedRectBorder = (x: number, yy: number, w: number, h: number, fill: [number, number, number], stroke: [number, number, number], r: number = 3): void => {
    doc.setFillColor(...fill);
    doc.setDrawColor(...stroke);
    doc.setLineWidth(0.4);
    doc.roundedRect(x, yy, w, h, r, r, "FD");
  };

  const accentLine = (x: number, yy: number, len: number, color: [number, number, number]): void => {
    doc.setFillColor(...color);
    doc.roundedRect(x, yy, len, 2.5, 1.2, 1.2, "F");
  };

  const sectionTitle = (title: string, subtitle?: string): void => {
    need(20);
    accentLine(ml, y, 30, c.primary);
    y += 7;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...c.heading);
    doc.text(title, ml, y);
    if (subtitle) {
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...c.muted);
      doc.text(subtitle, ml, y);
    }
    y += 8;
  };

  // ── Footer on every page ──
  const drawFooter = (): void => {
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      (doc as any).setPage(i);
      // Footer line
      doc.setDrawColor(...c.border);
      doc.setLineWidth(0.3);
      doc.line(ml, H - 14, W - mr, H - 14);
      // Footer text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...c.muted);
      doc.text("Saanvi Careers", ml, H - 9);
      doc.text(`Page ${i} of ${totalPages}`, W - mr, H - 9, { align: "right" });
      doc.text("saanvicareers.com  |  +91 8074172398", W / 2, H - 9, { align: "center" });
    }
  };

  // ═══════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ═══════════════════════════════════════════════════════════

  // Dark header block
  doc.setFillColor(...c.dark);
  doc.rect(0, 0, W, 88, "F");

  // Gradient accent strip at bottom of header
  doc.setFillColor(...c.primary);
  doc.rect(0, 88, W * 0.6, 2.5, "F");
  doc.setFillColor(...c.secondary);
  doc.rect(W * 0.6, 88, W * 0.4, 2.5, "F");

  // Brand name
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("SAANVI CAREERS", ml, 22);

  // Thin separator
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.3);
  doc.line(ml, 26, ml + 25, 26);

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(...c.white);
  doc.text("Generative AI", ml, 42);
  doc.text("Career Program", ml, 55);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(148, 163, 184);
  doc.text("14-Day Intensive  |  Complete Syllabus & Curriculum Guide", ml, 67);

  // Tech tags
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("ChatGPT   /   Prompt Engineering   /   LangChain   /   RAG   /   AI Agents   /   Python", ml, 80);

  // ── Stats Row ──
  y = 100;
  const stats = [
    { num: "14", label: "Days", sub: "Intensive" },
    { num: "5-7", label: "Projects", sub: "Deployed" },
    { num: "500+", label: "Students", sub: "Enrolled" },
    { num: "95%", label: "Placement", sub: "Rate" },
  ];
  const statW = (cW - 12) / 4;
  stats.forEach((s, i) => {
    const sx = ml + i * (statW + 4);
    roundedRectBorder(sx, y, statW, 24, c.white, c.border, 4);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...c.primary);
    doc.text(s.num, sx + statW / 2, y + 11, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...c.body);
    doc.text(s.label + " " + s.sub, sx + statW / 2, y + 18, { align: "center" });
  });

  // ── Program Overview ──
  y = 136;
  sectionTitle("Program Overview");

  const info = [
    { label: "Duration", value: "14 Days (2-3 hours/day)  —  Online, Live + Self-Paced" },
    { label: "Prerequisites", value: "None — beginner-friendly, no coding experience needed" },
    { label: "Tools Covered", value: "ChatGPT, Claude, OpenAI API, Python, Streamlit, LangChain, ChromaDB" },
    { label: "Outcome", value: "5-7 deployed portfolio projects, AI resume, placement support" },
    { label: "Investment", value: "Rs. 4,999 (Launch Offer)  |  Regular: Rs. 9,999" },
  ];

  info.forEach((item) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...c.primary);
    doc.text(item.label, ml + 2, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...c.body);
    doc.text(item.value, ml + 32, y);
    y += 7;
  });

  // ── Who Is This For ──
  y += 5;
  sectionTitle("Who Is This For?");

  const audiences = [
    { title: "Job Seekers", desc: "Add Gen AI & Prompt Engineering to your resume and stand out", color: c.primary, bg: c.blueBg },
    { title: "Freshers / Students", desc: "Build real projects and get placed — no experience needed", color: c.secondary, bg: c.purpleBg },
    { title: "Career Switchers", desc: "Transition from any background into high-paying Gen AI roles", color: c.greenDark, bg: c.greenBg },
  ];
  const audW = (cW - 8) / 3;
  audiences.forEach((a: any, i: number) => {
    const ax = ml + i * (audW + 4);
    roundedRectBorder(ax, y, audW, 24, a.bg as [number, number, number], c.border, 4);
    // Accent dot
    doc.setFillColor(...(a.color as [number, number, number]));
    doc.circle(ax + 6, y + 7, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...(a.color as [number, number, number]));
    doc.text(a.title, ax + 10, y + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...c.body);
    const lines = doc.splitTextToSize(a.desc, audW - 10);
    doc.text(lines, ax + 6, y + 15);
  });

  y += 32;

  // ── What You Graduate With ──
  sectionTitle("What You Graduate With");

  const outcomes = [
    "5-7 portfolio projects with live deployed URLs",
    "Prompt Engineering mastery (zero-shot, few-shot, CoT)",
    "RAG, LangChain & AI Agents hands-on experience",
    "Professional GitHub portfolio & LinkedIn profile",
    "AI-optimized resume & interview preparation",
    "Placement support & hiring partner connections",
  ];
  const colW = cW / 2;
  outcomes.forEach((o, i) => {
    const col = i < 3 ? 0 : 1;
    const row = i < 3 ? i : i - 3;
    const ox = ml + col * colW + 2;
    const oy = y + row * 6;
    doc.setFillColor(...c.green);
    doc.circle(ox + 1.5, oy - 1, 1.5, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...c.body);
    doc.text(o, ox + 6, oy);
  });

  // ═══════════════════════════════════════════════════════════
  // PAGE 2 — WEEK 1 CURRICULUM
  // ═══════════════════════════════════════════════════════════
  addPage();

  // Week header bar
  roundedRect(ml, y - 4, cW, 16, c.dark, 4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...c.white);
  doc.text("WEEK 1", ml + 8, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("Foundations & Core Skills", ml + 34, y + 5);
  y += 18;

  const week1 = [
    { day: "01", title: "Introduction to Generative AI", topics: ["What is Gen AI vs Traditional AI vs Machine Learning", "How LLMs work — tokens, training, inference (simplified)", "Explore ChatGPT, Claude & Gemini side-by-side"], deliverable: "AI tool comparison report" },
    { day: "02", title: "Prompt Engineering Mastery", topics: ["The Perfect Prompt Formula — role, context, task, format", "Zero-shot, few-shot & chain-of-thought prompting", "Build a prompt library for 10 real-world use cases"], deliverable: "Personal prompt playbook" },
    { day: "03", title: "AI for Writing, Research & Productivity", topics: ["AI-powered content writing, editing & fact-checking", "Document summarization & research workflows", "Summarize a 20-page PDF, draft a blog post"], deliverable: "AI writing toolkit" },
    { day: "04", title: "AI Image & Visual Content Generation", topics: ["Text-to-image: DALL-E, Midjourney, Stable Diffusion", "Prompt crafting for visual AI & variation techniques", "Generate a brand kit — logos, social media graphics"], deliverable: "5-image AI visual portfolio" },
    { day: "05", title: "AI Audio, Video & Multimodal Content", topics: ["Text-to-speech (ElevenLabs), speech-to-text (Whisper)", "AI video generation & multimodal workflows", "Create a 60-second AI video with narration"], deliverable: "AI multimedia content piece" },
    { day: "06", title: "Python Foundations for Gen AI", topics: ["Python basics in Google Colab — no installation needed", "Variables, functions, libraries & API basics", "First Python script + first OpenAI API call"], deliverable: "Simple chatbot in 20 lines of Python" },
    { day: "07", title: "Build Your First AI Web App", topics: ["OpenAI API deep dive — chat completions, system prompts", "Building a Streamlit web app from scratch", "Build & deploy a personal AI chatbot"], deliverable: "Deployed AI chatbot with live URL" },
  ];

  const renderDay = (mod: ModuleData, weekColor: [number, number, number], weekBg: [number, number, number], isLast: boolean): void => {
    need(36);

    // Left accent bar
    doc.setFillColor(...weekColor);
    doc.roundedRect(ml, y, 2, 26, 1, 1, "F");

    // Day number
    roundedRect(ml + 6, y, 14, 7, weekColor, 3);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...c.white);
    doc.text("DAY " + mod.day, ml + 13, y + 4.5, { align: "center" });

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...c.heading);
    doc.text(mod.title, ml + 24, y + 5);
    y += 11;

    // Topics
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    mod.topics.forEach((t) => {
      doc.setTextColor(...c.muted);
      doc.text("-", ml + 24, y);
      doc.setTextColor(...c.body);
      doc.text(t, ml + 28, y);
      y += 4.5;
    });

    // Deliverable badge
    y += 1;
    const badgeText = "Deliverable:  " + mod.deliverable;
    const badgeW = doc.getTextWidth(badgeText) + 10;
    roundedRect(ml + 24, y - 3, Math.min(badgeW * 1.5, cW - 28), 7, weekBg, 3);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...weekColor);
    doc.text(badgeText, ml + 28, y + 0.5);
    y += 9;

    // Separator
    if (!isLast) {
      doc.setDrawColor(...c.border);
      doc.setLineWidth(0.15);
      doc.line(ml + 6, y - 3, W - mr, y - 3);
    }
  };

  week1.forEach((mod, i) => renderDay(mod, c.primary, c.blueBg, i === 6));

  // ═══════════════════════════════════════════════════════════
  // PAGE 3 — WEEK 2 CURRICULUM
  // ═══════════════════════════════════════════════════════════
  addPage();

  // Week 2 header bar
  roundedRect(ml, y - 4, cW, 16, [88, 28, 135], 4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...c.white);
  doc.text("WEEK 2", ml + 8, y + 5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(200, 180, 220);
  doc.text("Advanced Skills & Portfolio Building", ml + 34, y + 5);
  y += 18;

  const week2 = [
    { day: "08", title: "RAG — Chat with Your Documents", topics: ["What is RAG & why enterprises need it", "Embeddings, vector databases & retrieval pipelines", "Build a 'Chat with PDF' app using LangChain + ChromaDB"], deliverable: "RAG-powered document Q&A app" },
    { day: "09", title: "LangChain & AI Workflow Frameworks", topics: ["LangChain architecture — chains, prompts, memory, tools", "Building multi-step AI workflows with data sources", "Build an AI research assistant"], deliverable: "AI research assistant" },
    { day: "10", title: "AI Agents & Automation", topics: ["What are AI agents — planning, reasoning, tool use", "Building agents that take actions autonomously", "Build an agent that researches & writes reports"], deliverable: "Autonomous AI research agent" },
    { day: "11", title: "Industry Project — AI Content Generator", topics: ["Advanced prompt chaining for multi-format content", "Blog posts, ad copy, social media & email generation", "Build & deploy the full AI Content Generator"], deliverable: "Deployed AI Content Generator" },
    { day: "12", title: "Industry Project — AI Resume Analyzer", topics: ["Resume parsing, skill extraction & job matching", "No-code/low-code deployment (Streamlit, HuggingFace)", "Build & deploy the Resume Analyzer + Job Matcher"], deliverable: "Deployed Resume Analyzer" },
    { day: "13", title: "Portfolio Building & Personal Branding", topics: ["GitHub portfolio setup with professional READMEs", "LinkedIn optimization for Gen AI careers", "Deploy all projects with live URLs, record demo videos"], deliverable: "Complete portfolio with 5+ projects" },
    { day: "14", title: "Career Prep, Interviews & Graduation", topics: ["Gen AI interview questions — RAG, prompting, LLMs", "AI-focused resume building & mock interviews", "Placement guidance & hiring partner connections"], deliverable: "AI resume + project pitch video" },
  ];

  week2.forEach((mod, i) => renderDay(mod, c.secondary, c.purpleBg, i === 6));

  // ═══════════════════════════════════════════════════════════
  // PAGE 4 — PROJECTS & TOOLS
  // ═══════════════════════════════════════════════════════════
  addPage();

  sectionTitle("Real-World Projects You'll Build", "Industry-level use cases that impress recruiters — not toy demos");

  const projects = [
    {
      title: "AI Customer Support Chatbot",
      tag: "INDUSTRY",
      desc: "Build a context-aware chatbot using OpenAI API + LangChain with conversation memory, system prompts, and a deployed Streamlit UI.",
      tools: ["OpenAI API", "LangChain", "Streamlit", "Python"],
      color: c.primary,
      bg: c.blueBg,
    },
    {
      title: "AI Content Generator",
      tag: "BUSINESS",
      desc: "Create a marketing content pipeline that generates blog posts, ad copy, social media captions, and email sequences from a single brief.",
      tools: ["ChatGPT API", "Prompt Chains", "Streamlit", "Python"],
      color: c.secondary,
      bg: c.purpleBg,
    },
    {
      title: "AI Resume Analyzer + Job Matcher",
      tag: "HIRING",
      desc: "Develop an AI tool that parses resumes, extracts skills using NLP, scores them against job descriptions — like real ATS systems.",
      tools: ["OpenAI API", "PDF Parsing", "Embeddings", "Streamlit"],
      color: c.greenDark,
      bg: c.greenBg,
    },
  ];

  projects.forEach((p: any) => {
    need(34);
    // Card background with border
    roundedRectBorder(ml, y, cW, 30, p.bg as [number, number, number], c.border, 5);

    // Left colored accent
    doc.setFillColor(...(p.color as [number, number, number]));
    doc.roundedRect(ml, y, 3, 30, 1.5, 1.5, "F");
    // Overdraw left inner to make it flush
    doc.setFillColor(...(p.bg as [number, number, number]));
    doc.rect(ml + 1.5, y + 1, 2, 28, "F");
    doc.setFillColor(...(p.color as [number, number, number]));
    doc.rect(ml, y + 2, 2.5, 26, "F");

    // Tag badge
    const tagW = doc.setFont("helvetica", "bold").setFontSize(6) && doc.getTextWidth(p.tag) + 6;
    roundedRect(ml + 8, y + 4, tagW, 5, p.color as [number, number, number], 2);
    doc.setTextColor(...c.white);
    doc.setFontSize(6);
    doc.text(p.tag, ml + 11, y + 7.5);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...c.heading);
    doc.text(p.title, ml + 8 + tagW + 4, y + 8);

    // Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...c.body);
    const descLines = doc.splitTextToSize(p.desc, cW - 18);
    doc.text(descLines, ml + 8, y + 15);

    // Tools row
    let tx = ml + 8;
    const ty = y + 24;
    doc.setFontSize(6.5);
    doc.setTextColor(...c.muted);
    doc.text("TOOLS:", tx, ty);
    tx += 14;
    p.tools.forEach((tool: string, ti: number) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...(p.color as [number, number, number]));
      doc.text(tool, tx, ty);
      tx += doc.getTextWidth(tool) + 2;
      if (ti < p.tools.length - 1) {
        doc.setTextColor(...(c.muted as [number, number, number]));
        doc.text("/", tx, ty);
        tx += 4;
      }
    });

    y += 35;
  });

  // ── Tools & Technologies Section ──
  y += 2;
  sectionTitle("Tools & Technologies");

  const toolCats = [
    { cat: "LLM Providers", items: "ChatGPT, Claude, Gemini, OpenAI API", color: c.primary },
    { cat: "Frameworks", items: "LangChain, LlamaIndex, Streamlit, Gradio", color: c.secondary },
    { cat: "Vector Databases", items: "ChromaDB, FAISS, Pinecone (concepts)", color: c.accent },
    { cat: "Image & Video AI", items: "DALL-E, Midjourney, Stable Diffusion, Whisper", color: c.orange },
    { cat: "Dev Tools", items: "Python, Google Colab, GitHub, Streamlit Cloud", color: c.greenDark },
    { cat: "No-Code AI", items: "Custom GPTs, Zapier AI, Make.com, HuggingFace", color: [168, 85, 247] },
  ];

  const tColW = (cW - 6) / 2;
  toolCats.forEach((t: any, i: number) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const tx = ml + col * (tColW + 6);
    const ty = y + row * 14;

    // Small dot
    doc.setFillColor(...(t.color as [number, number, number]));
    doc.circle(tx + 2, ty - 1, 1.2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...(t.color as [number, number, number]));
    doc.text(t.cat, tx + 6, ty);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...c.body);
    doc.text(t.items, tx + 6, ty + 5.5);
  });

  y += 48;

  // ═══════════════════════════════════════════════════════════
  // CTA FOOTER
  // ═══════════════════════════════════════════════════════════
  need(52);

  // Dark CTA box
  roundedRect(ml, y, cW, 50, c.dark, 6);

  // Accent line inside CTA
  doc.setFillColor(...c.primary);
  doc.roundedRect(ml + 10, y + 8, 30, 2, 1, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...c.white);
  doc.text("Ready to Start Your", ml + 10, y + 20);
  doc.text("Gen AI Career?", ml + 10, y + 28);

  // Right side info
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Launch Price", ml + cW - 10, y + 14, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...c.white);
  doc.text("Rs. 4,999", ml + cW - 10, y + 22, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Regular: Rs. 9,999", ml + cW - 10, y + 28, { align: "right" });

  // Contact row
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text("WhatsApp: +91 8074172398   |   Email: contact@saanvicareers.com   |   saanvicareers.com", ml + 10, y + 42);

  // ── Draw footers on all pages ──
  drawFooter();

  doc.save("Saanvi-Careers-GenAI-Program-Syllabus.pdf");
}

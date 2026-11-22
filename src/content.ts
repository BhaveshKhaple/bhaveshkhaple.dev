export const profile = {
  name: "Bhavesh Khaple",
  first: "Bhavesh",
  last: "Khaple",
  headline: "AI Engineer in the making: RAG, LLM evaluation, MLOps",
  tagline:
    "Final-year AI & DS student who ships retrieval systems and measures where they fail.",
  intro:
    "RAG pipelines, honest evals, and the MLOps glue that keeps them running.",
  location: "Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, India",
  locationShort: "Chhatrapati Sambhajinagar",
  availability:
    "Open to remote AI/ML, GenAI, RAG, agents or MLOps internships: full-time from Jan 2027; part-time evenings from 7 Dec 2026.",
  upcoming: "Joining CRHDRI as AI/ML Intern (remote), Dec 2026.",
  email: "bhaveshkhaple2@gmail.com",
  about:
    "I'm a final-year B.Tech student in AI & Data Science (Honors) at MIT Chhatrapati Sambhajinagar, graduating March 2027 with a CGPA of 8.87. Most of my time goes into retrieval systems: parsing messy documents, tuning chunking and reranking, and writing the benchmark before I believe a number. Right now I lead FinVault AI, an offline document-audit assistant for auditors, as my final-year major project. I've done two remote internships (SmaranAI and Suvidha Foundation), won MGM Glitch & Fix in Feb 2025, and earned my first bug bounty in June 2026 after reporting a hijacked AWS Educate login page. Outside code I'm Service Project Chair at Rotaract Club MIT CSN.",
} as const

export const links = {
  github: "https://github.com/BhaveshKhaple",
  linkedin: "https://linkedin.com/in/bhavesh-khaple-348063268",
  email: "mailto:bhaveshkhaple2@gmail.com",
  x: "https://x.com/idkwhoisbhavesh",
  medium: "https://medium.com/@bhaveshkhaple2",
  skillsLibrary: "https://github.com/BhaveshKhaple/bhavesh-claude-skills",
} as const

export type Project = {
  id: string
  name: string
  repo: string
  role?: string
  status: string
  summary: string
  stack: string[]
  highlights?: string[]
  caveat?: string
  featured?: boolean
  demoVideo?: {
    id: string
    title: string
    href: string
  }
}

export const projects: Project[] = [
  {
    id: "finvault",
    name: "FinVault AI",
    repo: "https://github.com/BhaveshKhaple/legalvault-ai",
    role: "Project lead, 4-person final-year team",
    status: "Major project, in progress",
    summary:
      "Offline, evidence-first document-audit assistant for auditors and assistant CAs. Ask questions across reports and get answers that cite the exact source region. A Report Shield checks finished reports against source documents.",
    stack: [
      "FastAPI",
      "LlamaIndex",
      "Docling",
      "Qdrant",
      "BM25 hybrid retrieval",
      "cross-encoder reranking",
      "Ollama (local LLMs)",
    ],
    highlights: [
      "I defined the problem and designed the 5-layer architecture: ingestion, processing, retrieval, audit, presentation. I write most of the code.",
    ],
    caveat:
      "Recall@5 of 95.7% is on 23 queries over 10 synthetic English PDFs (text and tables), with 100% refusal on out-of-scope questions. Real-world messy PDFs, OCR, and multilingual documents are not tested yet. The first Report Shield caught 1 of 13 planted errors on a real audit report. v2 is being rebuilt against a ground-truth corpus, with 116 tests passing.",
    featured: true,
    demoVideo: {
      id: "9JjOcRSG_lw",
      title: "FinVault AI prototype demo",
      href: "https://youtu.be/9JjOcRSG_lw",
    },
  },
  {
    id: "rag-commercial",
    name: "RAG-commercial",
    repo: "https://github.com/BhaveshKhaple/RAG-commercial",
    status: "Built 2025",
    summary:
      "Document Q&A over uploaded PDFs and TXT, with hybrid semantic and keyword search, source citations, chapter summaries, and voice input.",
    stack: ["Python", "Gemini", "Sentence Transformers", "Streamlit"],
    featured: true,
  },
  {
    id: "rag-prototype",
    name: "RAG-prototype-Pipeline",
    repo: "https://github.com/BhaveshKhaple/RAG-prototype-Pipeline",
    status: "Built Jul 2025",
    summary:
      "End-to-end RAG prototype: chunking with overlap, Sentence-Transformer embeddings, a FAISS index, and Gemini answers with source citations in a Streamlit chat UI.",
    stack: ["FAISS", "Sentence Transformers", "Gemini", "Streamlit"],
    featured: true,
  },
  {
    id: "clinical-nlq",
    name: "Clinical NLQ AI Assistant (T5)",
    repo: "https://github.com/BhaveshKhaple/NLQ-AI-Assistant-for-Clinical-Data-T5-Based-",
    role: "Co-contributor, development and evaluation",
    status: "Co-contributor",
    summary:
      "Ask clinical questions in plain English and get SQL run against a Synthea-generated clinical PostgreSQL database. The app routes between a fine-tuned T5, Gemini, or a hybrid with fallbacks, and it adds schema-aware RAG context.",
    stack: ["T5", "Gemini", "FastAPI", "PostgreSQL", "Streamlit", "Synthea"],
    highlights: [
      "I designed a 35-query clinical text-to-SQL benchmark across ten categories and ran the ablation that isolates the dual-source RAG layer.",
      "My role was co-contributor on development and evaluation. The related manuscript, still in preparation, lists Y. Khaple and M. D. Shelar as authors. My name is not on that author list.",
    ],
    featured: true,
  },
  {
    id: "nlq-2-sql",
    name: "NLQ-2-SQL",
    repo: "https://github.com/BhaveshKhaple/NLQ-2-SQL",
    status: "Jul 2025",
    summary:
      "Notebook that fine-tunes T5 on natural-language and SQL pairs. It was the groundwork for the clinical assistant.",
    stack: ["T5", "Transformers", "Python"],
  },
  {
    id: "multimodal",
    name: "Multimodal RAG v4 (offline)",
    repo: "https://github.com/BhaveshKhaple/Multimodal-SIH",
    status: "v4, Aug 2026 · participant entry",
    summary:
      "Document QA with table-aware extraction, dense plus BM25 hybrid retrieval, cross-encoder reranking, and voice I/O. v4 runs fully offline on Mistral 7B via Ollama. It started as a Smart India Hackathon entry, where I was a participant. FinVault grew out of this prototype.",
    stack: ["Mistral 7B", "Ollama", "BM25", "Cross-encoder", "Streamlit"],
  },
  {
    id: "saferide",
    name: "SafeRide SOS",
    repo: "https://github.com/BhaveshKhaple/CAB_SOS",
    role: "Co-builder with a friend",
    status: "MVP, 2026",
    summary:
      "IoT SOS monitoring for women's safety in cabs: a hidden trigger sends a live operator alert in under 2 seconds, with a GPS map, role-based access, and a device simulator.",
    stack: ["React", "TypeScript", "Firebase", "Cloud Functions", "Leaflet"],
  },
  {
    id: "skills",
    name: "Agent skills library",
    repo: "https://github.com/BhaveshKhaple/bhavesh-claude-skills",
    status: "Public, MIT",
    summary:
      "Reusable agent skills: graph-engineering (loops-and-graphs agent design), linkedin-hook-writer, and viral-content-creator.",
    stack: ["Markdown", "Agent workflows"],
  },
]

export const sideAssignment = {
  name: "Medical imaging assignment (SN Matrix)",
  repo: "https://github.com/BhaveshKhaple/advanced-ai-medical-intelligence-platform",
  demo: "https://pneumoniadetection1.streamlit.app",
  status: "Internship side assignment, Jul 2026",
  summary:
    "EfficientNet-B0 chest X-ray classifier with Grad-CAM, Gemini-written reports, FastAPI, and Docker. Validation accuracy was 97.77% on this assignment. It is a side assignment, kept off the featured row.",
  stack: ["PyTorch", "EfficientNet-B0", "Grad-CAM", "FastAPI", "Docker"],
} as const

export const experience = [
  {
    id: "crhdri",
    org: "CRHDRI",
    title: "AI/ML Intern",
    mode: "Remote",
    dates: "Starting Dec 2026",
    upcoming: true,
    note: "Upcoming. The joining date is still being confirmed with HR, so no specific day is listed here.",
  },
  {
    id: "abhyudaya",
    org: "Abhyudaya Education Consultancy",
    title: "AI & Workflow Automation Intern",
    mode: "Hybrid",
    dates: "Jul 2025 to Aug 2025",
    bullets: [
      "Collaborated on Persona365, a full-stack Generative AI application using Python, Flask, JavaScript, HTML and CSS, integrating large language models for automated personality assessment and analysis.",
      "Integrated the OpenAI API with structured prompt engineering to process questionnaire responses, generate AI-powered personality insights and produce structured assessment reports for counselling.",
      "Developed Flask REST API workflows for LLM integration, automated report generation and email delivery; deployed the frontend on Vercel and the backend on Render.",
    ],
  },
  {
    id: "smaran",
    org: "SmaranAI.in",
    title: "Developer Intern",
    mode: "Remote",
    dates: "Jul 2025 to Aug 2025",
    bullets: [
      "Built a RAG pipeline with LangChain, Hugging Face, and ChromaDB for document question answering.",
      "Built a T5-based assistant that turns clinical questions into SQL over a structured clinical database.",
      "Set up a modular repo, CI/CD, and Docker packaging for the pipelines.",
    ],
  },
  {
    id: "suvidha",
    org: "Suvidha Foundation",
    title: "AI Research Intern",
    mode: "Remote, 45 days, international NGO",
    dates: "14 Jul to 28 Aug 2025",
    bullets: [
      "Benchmarked BART, PEGASUS, and T5 for abstractive summarization with ROUGE-1/2/L and BERTScore.",
    ],
  },
] as const

export const campus = [
  {
    title: "Service Project Chair, Rotaract Club MIT CSN",
    dates: "2026 to 27",
  },
  {
    title: "Training & Placement Student Coordinator, MIT Chhatrapati Sambhajinagar",
    dates: "until 31 Oct 2026",
  },
] as const

export const education = {
  school:
    "MIT Chhatrapati Sambhajinagar (Maharashtra Institute of Technology, Aurangabad)",
  degree: "B.Tech, Artificial Intelligence & Data Science (Honors)",
  dates: "Aug 2023 to Mar 2027",
  cgpa: "8.87 / 10",
} as const

export const achievements = [
  {
    title: "Winner, MGM Glitch & Fix hackathon",
    date: "Feb 2025",
  },
  {
    title:
      "First bug bounty: reported a ShinyHunters extortion page served on the AWS Educate login flow",
    date: "Jun 2026",
  },
  {
    title: "GSSoC (GirlScript Summer of Code) contributor",
    date: "",
  },
] as const

export const skills: { group: string; items: string[] }[] = [
  {
    group: "GenAI / RAG",
    items: [
      "LangChain",
      "LlamaIndex",
      "Ollama",
      "Gemini API",
      "OpenAI API",
      "Mistral 7B",
      "Hugging Face",
      "Sentence Transformers",
      "reranking",
      "agentic patterns",
    ],
  },
  {
    group: "Evaluation",
    items: ["Recall@k", "ROUGE", "BERTScore", "benchmark design", "ablations", "Grad-CAM"],
  },
  {
    group: "MLOps",
    items: [
      "Docker",
      "Kubernetes (Minikube/Kind)",
      "MLflow",
      "DVC",
      "GitHub Actions",
      "FastAPI",
      "KServe",
      "Evidently",
      "Great Expectations",
    ],
  },
  {
    group: "Data / Cloud",
    items: [
      "PostgreSQL",
      "ChromaDB",
      "Qdrant",
      "FAISS",
      "Snowflake",
      "AWS",
      "Firebase",
      "Vercel",
      "Streamlit",
    ],
  },
  {
    group: "ML / DL",
    items: [
      "PyTorch",
      "TensorFlow/Keras",
      "scikit-learn",
      "Transformers",
      "T5",
      "EfficientNet",
      "XGBoost",
    ],
  },
  {
    group: "Languages",
    items: ["Python", "SQL", "TypeScript/JavaScript", "Bash"],
  },
]

export const bentoStack = [
  "LlamaIndex",
  "Qdrant",
  "FastAPI",
  "Ollama",
  "PyTorch",
  "Docker",
  "PostgreSQL",
  "Gemini",
] as const

export const updates: {
  date: string
  kicker: string
  title: string
  body: string
  href?: string
}[] = [
  {
    date: "Now",
    kicker: "Building",
    title: "FinVault AI, final-year major project",
    body: "Offline document-audit assistant. The first Report Shield caught 1 of 13 planted errors on a real audit report, so v2 is being rebuilt against a ground-truth corpus. 116 tests are passing.",
    href: "https://github.com/BhaveshKhaple/legalvault-ai",
  },
  {
    date: "Dec 2026",
    kicker: "Upcoming",
    title: "Joining CRHDRI as an AI/ML intern",
    body: "Remote. The exact start date is still being confirmed with HR, so this stays at December 2026.",
  },
  {
    date: "Aug 2026",
    kicker: "Build",
    title: "Multimodal RAG v4 runs offline",
    body: "Table-aware extraction, dense plus BM25 retrieval, cross-encoder reranking, and voice I/O, on Mistral 7B through Ollama. It started as a Smart India Hackathon entry. I was a participant. FinVault grew out of this prototype.",
    href: "https://github.com/BhaveshKhaple/Multimodal-SIH",
  },
  {
    date: "Jul 2026",
    kicker: "Side assignment",
    title: "Chest X-ray classifier for SN Matrix",
    body: "Internship side assignment. EfficientNet-B0 with Grad-CAM, Gemini-written reports, FastAPI, and Docker. Validation accuracy was 97.77% on that assignment.",
    href: "https://github.com/BhaveshKhaple/advanced-ai-medical-intelligence-platform",
  },
  {
    date: "Jun 2026",
    kicker: "Security",
    title: "First bug bounty",
    body: "Reported a ShinyHunters extortion page served on the AWS Educate login flow.",
  },
  {
    date: "2026",
    kicker: "Build",
    title: "SafeRide SOS MVP",
    body: "Co-built with a friend. A hidden trigger reaches a live operator in under 2 seconds, with a GPS map, role-based access, and a device simulator.",
    href: "https://github.com/BhaveshKhaple/CAB_SOS",
  },
  {
    date: "Jul to Aug 2025",
    kicker: "Internship",
    title: "Developer intern at SmaranAI.in",
    body: "Remote. A RAG pipeline with LangChain, Hugging Face, and ChromaDB, a T5 clinical text-to-SQL assistant, and Docker plus CI/CD around the repos.",
  },
  {
    date: "14 Jul to 28 Aug 2025",
    kicker: "Internship",
    title: "AI research intern at Suvidha Foundation",
    body: "Remote, 45 days, with an international NGO. Benchmarked BART, PEGASUS, and T5 for abstractive summarization using ROUGE-1/2/L and BERTScore.",
  },
  {
    date: "Jul 2025",
    kicker: "Build",
    title: "RAG prototype and NLQ-2-SQL",
    body: "A Streamlit RAG prototype with overlap chunking, Sentence Transformers, and FAISS, plus a notebook that fine-tunes T5 on natural-language and SQL pairs for the clinical assistant.",
    href: "https://github.com/BhaveshKhaple/RAG-prototype-Pipeline",
  },
  {
    date: "Feb 2025",
    kicker: "Win",
    title: "MGM Glitch & Fix",
    body: "Won the hackathon.",
  },
]

export const socials = [
  { label: "GitHub", href: links.github },
  { label: "LinkedIn", href: links.linkedin },
  { label: "X", href: links.x },
  { label: "Medium", href: links.medium },
  { label: "Email", href: links.email },
] as const

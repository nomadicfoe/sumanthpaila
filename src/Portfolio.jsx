import { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from 'lucide-react';
import { useForm, ValidationError } from '@formspree/react';


const FLOATING_IMAGES = [
  process.env.PUBLIC_URL + "/floating-icons/asteroid1.png",
  process.env.PUBLIC_URL + "/floating-icons/asteroid2.png",
  process.env.PUBLIC_URL + "/floating-icons/github.png",
  process.env.PUBLIC_URL + "/floating-icons/python.png",
  process.env.PUBLIC_URL + "/floating-icons/rprogram.png"
];

// Shown whenever a project thumbnail fails to load, so a missing file in
// public/project-images/ is obvious instead of just showing a blank box.
const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%231f2937'/%3E%3Ctext x='50%25' y='50%25' fill='%236b7280' font-family='monospace' font-size='14' text-anchor='middle' dominant-baseline='middle'%3Eimage not found%3C/text%3E%3C/svg%3E";

function getRandomStartPosition() {
  const edge = Math.floor(Math.random() * 4);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const offset = 100;
  switch (edge) {
    case 0: return { x: Math.random() * vw, y: -offset, vx: randomVelocity(), vy: randomVelocity() };
    case 1: return { x: vw + offset, y: Math.random() * vh, vx: -randomVelocity(), vy: randomVelocity() };
    case 2: return { x: Math.random() * vw, y: vh + offset, vx: randomVelocity(), vy: -randomVelocity() };
    case 3: return { x: -offset, y: Math.random() * vh, vx: randomVelocity(), vy: randomVelocity() };
    default: return { x: 0, y: 0, vx: 1, vy: 1 };
  }
}

function randomVelocity() {
  return 0.3 + Math.random() * 0.4;
}

function ContactForm() {
  const [state, handleSubmit] = useForm("mgvybzne"); // your Formspree ID
  if (state.succeeded) {
    return <p className="text-green-400 font-semibold">Thanks! I'll be in touch shortly. 🚀</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div>
        <label htmlFor="email" className="block text-sm text-gray-300 mb-1">Email Address</label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-gray-300 mb-1">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows="4"
          className="w-full bg-gray-800 text-white border border-gray-600 rounded px-4 py-2 resize-none"
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
      >
        {state.submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}


export default function Portfolio() {
  const [floaters, setFloaters] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [activeSection, setActiveSection] = useState('about');
  const [projectImageIndices, setProjectImageIndices] = useState({});

  const sectionRefs = {
    about: useRef(null),
    skills: useRef(null),
    experience: useRef(null),
    projects: useRef(null),
    contact: useRef(null)
  };

  useEffect(() => {
    const sectionIds = ["about", "skills", "experience", "projects", "contact"];
    const observers = [];

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.6 }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  useEffect(() => {
    if (!selectedProject || !selectedProject.images) return;

    const interval = setInterval(() => {
      setProjectImageIndices((prev) => {
        const currentIndex = prev[selectedProject.title] || 0;
        const nextIndex = (currentIndex + 1) % selectedProject.images.length;
        return {
          ...prev,
          [selectedProject.title]: nextIndex,
        };
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedProject]);

  useEffect(() => {
    document.title = "Sumanth Paila | Portfolio";
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    let mouseX = 0;
    let mouseY = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const createStars = () => {
      stars = Array.from({ length: 2000 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        baseR: Math.random() * 1.5 + 0.5,
        twinklePhase: Math.random() * Math.PI * 2,
        glow: 0,
        strength: 0.5 + Math.random() * 0.5,
      }));
    };

    const createShootingStar = () => {
      if (shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height / 2,
          vx: -10 - Math.random() * 3,
          vy: 10 + Math.random() * 3,
          length: Math.random() * 80 + 50,
          life: 0,
          maxLife: 90
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() * 0.004;

      if (Math.random() < 0.02) createShootingStar();

      stars.forEach(star => {
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        star.glow = Math.max(0, 60 - dist) / 60;

        const twinkle = Math.sin(time + star.twinklePhase) * 0.3 + 1;
        const size = (star.baseR + star.glow) * twinkle;

        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + star.glow * star.strength})`;
        ctx.fill();
      });

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        const gradient = ctx.createLinearGradient(s.x, s.y, s.x + s.length, s.y - s.length);
        gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
        gradient.addColorStop(0.5, 'rgba(255,220,180,0.4)');
        gradient.addColorStop(1, 'rgba(255,100,50,0.1)');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.length, s.y - s.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.25;
        ctx.stroke();

        s.x += s.vx;
        s.y += s.vy;
        s.life++;
        if (s.life > s.maxLife) shootingStars.splice(i, 1);
      }

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars();
    });

    createStars();
    animate();
    const interval = setInterval(() => createShootingStar(), 3000);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const initial = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      ...getRandomStartPosition(),
      angle: Math.random() * 360,
      spin: 0.1 + Math.random() * 0.05,
      image: FLOATING_IMAGES[i % FLOATING_IMAGES.length]
    }));
    setFloaters(initial);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFloaters((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...getRandomStartPosition(),
          angle: Math.random() * 360,
          spin: 0.1 + Math.random() * 0.05,
          image: FLOATING_IMAGES[Math.floor(Math.random() * FLOATING_IMAGES.length)],
        },
      ]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let animationId;
    const animateFloaters = () => {
      setFloaters(prev =>
        prev
          .map(f => ({ ...f, x: f.x + f.vx, y: f.y + f.vy, angle: f.angle + f.spin }))
          .filter(f => f.x > -100 && f.x < window.innerWidth + 100 && f.y > -100 && f.y < window.innerHeight + 100)
      );
      animationId = requestAnimationFrame(animateFloaters);
    };
    animateFloaters();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleFloaterClick = (id) => {
    setFloaters(prev =>
      prev.map(f => (f.id === id ? { ...f, vx: -f.vx, vy: -f.vy, spin: -f.spin } : f))
    );
  };

  // Kept your original three, added three new ones below.
  // NOTE: github links for the three new projects are placeholders in the
  // form github.com/nomadicfoe/<repo-name> — swap in your real repo slugs.
  // Same for image paths: drop matching files into public/project-images/
  // with these exact names (case-sensitive) or the fallback box will show.
  const projects = [
    {
      title: "QueryCase – Legal Document Semantic Search",
      description: "Semantic search engine for U.S. court opinions with natural language query support and AI-generated relevance explanations.",
      extendedDescription: `
        QueryCase is a Python-based semantic search tool for U.S. court opinions. It ingests court case PDFs from CourtListener, extracts and chunks their content using PyMuPDF, and generates dense embeddings with SentenceTransformers, storing them in a FAISS index for fast approximate-nearest-neighbor retrieval.

        On top of retrieval, I added an OpenAI-based explanation layer that summarizes why a given case was surfaced for a query, so results are interpretable rather than a black-box ranked list. Currently extending the pipeline with batch checkpointing so the index can be incrementally updated as new opinions are ingested, instead of requiring a full rebuild.
      `,
      images: [
        `${process.env.PUBLIC_URL}/project-images/querycase.png`
      ],
      link: "https://github.com/nomadicfoe/querycase"
    },
    {
      title: "Medicaid Drug Utilization Forecasting",
      description: "Forecasting drug costs using Medicaid data for policy planning.",
      extendedDescription: `
        Built a centralized data lake of Medicaid drug utilization and reimbursement records by pulling from the Medicaid Open Data API, then cleaned and standardized the data across reporting periods and states.

        Used ARIMA time-series models to forecast future drug costs and flag likely policy impact areas. Results were surfaced through an interactive Tableau dashboard showing regional utilization trends, giving stakeholders a way to explore cost drivers by drug class and geography to support evidence-based policy decisions.
      `,
      images: [`${process.env.PUBLIC_URL}/project-images/SDU.png`],
      link: "https://github.com/nomadicfoe/medicaid-forecasting"
    },
    {
      title: "Space Debris Visualization & Collision Risk Analysis",
      description: "3D visualization of orbital paths and collision risks using Python.",
      extendedDescription: `
        Built a modular Python tool that classifies tracked space objects by orbital regime (LEO/MEO/GEO) and models proximity-based collision risk between them.

        Orbital paths are rendered as interactive 3D visualizations using PyVista and Plotly, letting a user rotate and inspect debris fields over time. I used NetworkX to model pairwise proximity between objects as a graph, which made it possible to simulate collision-risk clustering and identify which debris populations pose the highest compounding risk.
      `,
      images: [
        `${process.env.PUBLIC_URL}/project-images/orbit.png`,
        `${process.env.PUBLIC_URL}/project-images/orbitviz.png`
      ],
      link: "https://github.com/nomadicfoe/space-debris-visualization"
    },
    {
      title: "KnowBase – Multi-Tenant Enterprise RAG Platform",
      description: "Full-stack retrieval-augmented generation platform for accurate document Q&A across large, multi-tenant document sets.",
      extendedDescription: `
        KnowBase is a full-stack RAG platform built to let an organization ask natural-language questions over its own document set and get accurate, sourced answers back instead of generic LLM output. It's multi-tenant, so each organization's documents and queries stay isolated from every other tenant on the same deployment.

        The core of the project was closing the gap between a naive RAG setup and one that's actually reliable at scale: better chunking strategy, retrieval tuning, and prompt design, evaluated against a held-out question set. That work took answer accuracy from a 33% baseline up to 93% across a corpus of 8,400+ documents.
      `,
      images: [
        `${process.env.PUBLIC_URL}/project-images/knowbase.png`
      ],
      link: "https://github.com/nomadicfoe/knowbase"
    },
    {
      title: "MTR-Lite – Map-Aware Motion Forecasting",
      description: "Multi-modal trajectory forecasting model for autonomous driving, trained on the Waymo Open Motion Dataset.",
      extendedDescription: `
        MTR-Lite predicts multiple plausible future trajectories for road agents (vehicles, pedestrians, cyclists) using the Waymo Open Motion Dataset (WOMD v1.3.1). The model is map-aware — it conditions its predictions on lane and road-graph context, not just an agent's past motion, which matters a lot for realistic multi-modal forecasts at intersections and merges.

        Trained and evaluated end-to-end on GCP using Vertex AI, the model achieved 1.88m minADE@6, a 64% reduction in displacement error compared to a GRU baseline — a meaningful jump in how closely the predicted trajectory set matches real future behavior.
      `,
      images: [
        `${process.env.PUBLIC_URL}/project-images/mtr-lite.png`
      ],
      link: "https://github.com/nomadicfoe/mtr-lite"
    },
    {
      title: "LocoFinder – AI Business Location Intelligence",
      description: "AI-powered platform that recommends business locations in San Diego using demographic and points-of-interest data.",
      extendedDescription: `
        LocoFinder was my BDA600 capstone: a full-stack tool that helps someone scoping a new business location in San Diego reason about where to open, backed by real data instead of gut feel. The frontend is built in Next.js with a FastAPI backend.

        It pulls points-of-interest and competitor density from the Google Places API, layers in Census ACS demographic data by tract, and uses GeoPandas for the underlying spatial joins and analysis. A Groq-hosted LLM turns the raw spatial and demographic output into a plain-language summary and recommendation for a given business type and neighborhood.
      `,
      images: [
        `${process.env.PUBLIC_URL}/project-images/locofinder.png`
      ],
      link: "https://github.com/nomadicfoe/locofinder"
    }
  ];

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const experiences = [
    {
      period: "Oct 2024 – Present",
      role: "Research Assistant (ML Engineer) · San Diego State Research Foundation",
      summary: "Built cloud-based geospatial ML pipelines for agricultural monitoring, plus a real-time streaming pipeline for molecular dynamics simulation data.",
      projects: [
        {
          title: "Geospatial Data & ML Pipeline Engineer",
          description:
            "• Developed a cloud-based data pipeline on AWS to process Sentinel-2 satellite imagery for agricultural and land-use monitoring.\n" +
            "• Applied preprocessing (cloud/water masking, NDVI/NDWI), documented metadata, and built LSTM models that boosted classification accuracy from 72% to 85%.\n" +
            "• Collaborated with interdisciplinary teams to deliver actionable geospatial insights with version-controlled QA/QC workflows."
        },
        {
          title: "Molecular Dynamics Streaming Pipeline (MoStream)",
          description:
            "• Built MoStream, a real-time streaming pipeline for molecular dynamics simulation output using Apache Kafka and Apache Flink to ingest and process high-throughput trajectory data.\n" +
            "• Integrated TensorFlow-based models into the streaming pipeline for on-the-fly analysis of molecular trajectories as data arrived, instead of batch post-processing.\n" +
            "• Deployed and tested the pipeline on CloudLab, validating throughput and latency under realistic simulation workloads."
        }
      ]
    },
    {
      period: "Aug 2025 – Present",
      role: "Research Assistant (ML Engineer) · HDMA Lab",
      summary: "Built a computer vision pipeline for street-level homeless site detection, training and comparing multiple object detection models.",
      projects: [
        {
          title: "Street View Object Detection for Homeless Site Identification",
          description:
            "• Built a computer vision data pipeline using Google Street View imagery from high-density homeless areas and manually annotated datasets into four object classes for supervised object detection\n" +
            "• Trained and evaluated multiple object detection models (YOLOv8, RT-DETR/RT-DETRv2, SSD, YOLO-NAS), iteratively improving model performance from an initial 70% accuracy while analyzing accuracy–latency trade-offs for deployment readiness.\n" +
            "• Developed a scalable annotation-to-inference workflow and deployed an initial pre-production Streamlit application to test real-time street-level mapping using recorded video feeds, supporting responsible urban planning and outreach initiatives."
        }
      ]
    },
    {
      period: "Jun 2023 – Jul 2023",
      role: "Research & Project Intern · Bhabha Atomic Research Center (CAD)",
      summary: "Designed a full-stack analytics platform to detect defects in nuclear systems and automated the ETL pipeline for defect logs.",
      projects: [
        {
          title: "Full Stack Data Tools Developer",
          description:
            "• Designed a full-stack analytics platform to detect defects in nuclear systems using Flask (API), React (UI), and MySQL.\n" +
            "• Automated end-to-end ETL pipelines for defect log parsing and reduced manual handling.\n" +
            "• Authored technical documentation and presented data-driven risk reports to stakeholders."
        }
      ]
    }
  ];

  return (
    <div className="snap-y snap-proximity h-screen overflow-y-scroll scroll-smooth bg-gradient-to-r from-gray-900 to-black text-white font-sans">
      <canvas id="starfield" className="fixed top-0 left-0 w-full h-full z-0"></canvas>

      {floaters.map(f => (
        <img
          key={f.id}
          src={f.image}
          onClick={() => handleFloaterClick(f.id)}
          alt=""
          style={{
            transform: `translate(${f.x}px, ${f.y}px) rotate(${f.angle}deg)`,
            position: "fixed",
            width: "100px",
            height: "100px",
            pointerEvents: "auto",
            transition: "transform 0.1s linear",
            zIndex: 1
          }}
          className="opacity-40 hover:opacity-80 cursor-pointer"
        />
      ))}

      {/* Navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 text-sm font-mono uppercase tracking-wider">
        <nav className="flex gap-6 px-8 py-2 border border-gray-700 backdrop-blur bg-black/60 rounded-full shadow-md">
          {[
            { id: "about", label: "// 01 Home" },
            { id: "skills", label: "// 02 Skills" },
            { id: "experience", label: "// 03 Experience" },
            { id: "projects", label: "// 04 Projects" },
            { id: "contact", label: "// 05 Contact" }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`hover:text-white ${
                activeSection === item.id ? "text-indigo-400" : "text-gray-400"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      {/* Hero Section */}
      <section
        id="about"
        className="h-screen snap-start relative z-10 px-6 flex flex-col items-center justify-center text-center"
      >
        <div className="fixed top-6 left-6 z-50 text-xl font-bold tracking-tight text-white font-mono">
          <span className="text-indigo-400">S.</span>P
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-4">
          {"SUMANTH.PAILA".split("").map((char, i) => (
            <span
              key={i}
              className="inline-block transition duration-300 hover:text-indigo-400 hover:[text-shadow:_0_0_12px_rgba(99,102,241,0.6)]"
            >
              {char}
            </span>
          ))}
        </h1>
        <p className="text-lg text-gray-400 tracking-wide mb-6">
          Machine Learning Engineer & Data Analyst
        </p>
        <div className="flex gap-5 text-gray-400">
          <a href="https://www.linkedin.com/in/sumanth-paila/" target="_blank" rel="noreferrer">
            <Linkedin className="w-6 h-6 hover:text-blue-500" />
          </a>
          <a href="mailto:sumanthpaila1@gmail.com">
            <Mail className="w-6 h-6 hover:text-red-400" />
          </a>
          <a href="https://github.com/nomadicfoe" target="_blank" rel="noreferrer">
            <Github className="w-6 h-6 hover:text-green-400" />
          </a>
        </div>
        <div className="mt-8 max-w-xl px-4 text-gray-400 text-sm md:text-base leading-relaxed text-center">
          <p>
            I'm Sumanth Paila, a machine learning engineer with an MS in Big Data Analytics from San Diego State University (May 2026). I build computer vision, geospatial ML, and LLM-based systems, from object detection pipelines analyzing street-level imagery to retrieval-augmented generation platforms handling thousands of documents. My work spans NSF and CARB funded research, satellite imagery analysis, and full-stack systems from data pipeline to deployment. I'm looking for ML Engineer, Data Engineer, or Computer Vision Engineer roles where I can turn messy real-world data into something that actually works.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="h-screen snap-start px-6 py-12 flex flex-col justify-center relative z-10 border-b border-gray-800"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">Skills</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left text-gray-300 text-sm">

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-white mb-3">Development</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Python (Flask, FastAPI)</li>
                <li>JavaScript (basic)</li>
                <li>R</li>
                <li>SQL (MySQL), NoSQL (MongoDB)</li>
              </ul>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-white mb-3">Data Science & ML</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Pandas, NumPy, Scikit-learn, XGBoost</li>
                <li>Deep Learning: TensorFlow, Keras, PyTorch</li>
                <li>LLMs: GPT-4, Claude, Llama, Langchain</li>
                <li>RAG Pipelines & Semantic Search</li>
              </ul>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
              <h3 className="text-lg font-semibold text-white mb-3">Cloud, Tools & Visualization</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>AWS (S3, Athena)</li>
                <li>Power BI, Tableau, Google Data Studio</li>
                <li>Excel (VLOOKUP, PivotTables)</li>
                <li>Git & GitHub for version control</li>
                <li>Microsoft Suite, Internet Research</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="min-h-screen snap-start px-6 py-16 flex flex-col justify-center relative z-10 border-b border-gray-800">
        <div className="max-w-3xl mx-auto w-full">
          <h2 className="text-4xl font-bold mb-12 text-center">Experience</h2>
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <div key={idx} className="flex items-stretch gap-3 md:gap-6">
                <span className="hidden sm:block w-24 md:w-36 shrink-0 text-right text-xs text-gray-500 font-mono pt-6">
                  {exp.period}
                </span>
                <div className="flex flex-col items-center shrink-0">
                  <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 border-4 border-gray-900 mt-6 shrink-0"></span>
                  {idx < experiences.length - 1 && (
                    <span className="w-px flex-1 bg-gray-700 mt-1"></span>
                  )}
                </div>
                <div
                  className="flex-1 mb-1 bg-gray-800/60 border border-gray-700 rounded-lg p-5 cursor-pointer group hover:border-indigo-500 transition-colors"
                  onClick={() => setSelectedExperience(exp)}
                >
                  <span className="sm:hidden block text-xs text-gray-500 font-mono mb-1">{exp.period}</span>
                  <h3 className="text-lg font-semibold text-white mb-1">{exp.role}</h3>
                  <p
                    className="text-gray-400 text-sm"
                    style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  >
                    {exp.summary}
                  </p>
                  <span className="inline-block mt-2 text-xs text-indigo-400 group-hover:text-indigo-300">
                    View details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen snap-start px-6 py-16 flex flex-col justify-center relative z-10">
        <h2 className="text-4xl font-bold mb-10 text-center">Projects</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto w-full"
          initial="hidden"
          animate="visible"
          variants={container}
        >
          {projects.map((project, index) => (
            <motion.div key={index} variants={item} className="h-full">
              <div className="bg-gray-800 border border-gray-700 rounded-lg shadow overflow-hidden flex flex-col h-full">
                {/* Fixed-height thumbnail slot for every card, image or not,
                    so card height never depends on whether the image loaded */}
                <div className="h-48 w-full shrink-0 bg-gray-700 overflow-hidden">
                  <img
                    src={project.images && project.images.length > 0 ? project.images[0] : FALLBACK_IMAGE}
                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "3.2rem" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-gray-300 mb-4 flex-grow"
                    style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  >
                    {project.description}
                  </p>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-auto"
                  >
                    View Project
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="h-screen snap-start flex items-center justify-center border-t border-gray-800 relative z-10 px-6">
        <div className="max-w-xl w-full text-center">
          <h2 className="text-4xl font-bold mb-6">Contact</h2>
          <p className="text-gray-400 mb-8">
            Reach out to me via this form. I'll get back to you as soon as I can!
          </p>
          <p className="text-gray-400">
            LinkedIn: <a href="https://www.linkedin.com/in/sumanth-paila/" target="_blank" rel="noreferrer" className="text-blue-400">SumanthPaila</a>
          </p>

          <ContactForm />
        </div>
      </section>

      {selectedProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative bg-gray-900 border border-gray-700 rounded-xl max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto p-8 shadow-lg">

            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-6 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>

            <h3 className="text-3xl font-bold mb-4">{selectedProject.title}</h3>

            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="relative mb-6 w-full bg-gray-700 rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                {selectedProject.images.map((image, idx) => (
                  <img
                    key={idx}
                    src={image}
                    onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                    alt={`${selectedProject.title} screenshot ${idx + 1}`}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                      (projectImageIndices[selectedProject.title] ?? 0) === idx
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                ))}

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {selectedProject.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setProjectImageIndices((prev) => ({
                          ...prev,
                          [selectedProject.title]: idx,
                        }))
                      }
                      className={`w-2 h-2 rounded-full transition-colors ${
                        (projectImageIndices[selectedProject.title] ?? 0) === idx
                          ? "bg-indigo-400"
                          : "bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="text-gray-400 space-y-4 text-sm leading-relaxed whitespace-pre-line">
              {selectedProject.extendedDescription || selectedProject.description}
            </div>

            <a
              href={selectedProject.link}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              View on GitHub
            </a>
          </div>
        </div>
      )}

      {selectedExperience && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="relative bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 shadow-lg">
            <button
              onClick={() => setSelectedExperience(null)}
              className="absolute top-4 right-6 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>

            <span className="text-xs text-gray-500 font-mono">{selectedExperience.period}</span>
            <h3 className="text-2xl font-bold mt-1 mb-6">{selectedExperience.role}</h3>

            <div className="space-y-6">
              {selectedExperience.projects.map((proj, pidx) => (
                <div key={pidx} className={pidx > 0 ? "pt-6 border-t border-gray-800" : ""}>
                  <p className="text-sm text-indigo-400 italic mb-2">{proj.title}</p>
                  <p className="text-gray-300 text-sm md:text-base whitespace-pre-line leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
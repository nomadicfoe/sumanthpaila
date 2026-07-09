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
      { threshold: 0.6 } // Adjust threshold for earlier/later activation
    );

    observer.observe(section);
    observers.push(observer);
  });

  return () => observers.forEach((obs) => obs.disconnect());
}, []);


  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      Object.values(sectionRefs).forEach(ref => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
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
    }, 4000); // Change image every 4 seconds

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

  const projects = [
  {
    title: "QueryCase – Legal Document Semantic Search",
    description: "Semantic search engine for U.S. court opinions with natural language query support.",
    extendedDescription: `
      QueryCase is a Python-based semantic search tool for U.S. court opinions. It ingests court case PDFs from CourtListener, extracts and embeds their content using PyMuPDF + SentenceTransformers, and stores vectors in a FAISS index for rapid retrieval.
      I also implemented OpenAI-based explanation generation to help users understand why a case was retrieved. Currently adding batch checkpointing for scalable updates and incremental retraining.
    `,
    images: [
      `${process.env.PUBLIC_URL}/project-images/querycase.png`
    ],
    link: "https://github.com/yourusername/querycase"
  },
  {
    title: "Medicaid Drug Utilization Forecasting",
    description: "Forecasting drug costs using Medicaid data for policy planning.",
    extendedDescription: `
      This project leveraged the Medicaid Open Data API to build a centralized data lake of utilization and reimbursement records.
      I used ARIMA models to forecast future drug costs and policy impact. An interactive Tableau dashboard visualized regional trends and guided evidence-based policy development.
    `,
    images: [`${process.env.PUBLIC_URL}/project-images/SDU.png`],
    link: "https://github.com/yourusername/medicaid-forecasting"
  },
  {
    title: "Space Debris Visualization & Collision Risk Analysis",
    description: "3D visualization of orbital paths and collision risks using Python.",
    extendedDescription: `
      Built a modular Python tool to analyze orbital paths, space object classification (LEO/MEO/GEO), and collision risks.
      Implemented interactive 3D visualizations using PyVista and Plotly. Used NetworkX to simulate proximity-based collision risks and assess orbital debris clustering.
    `,
    images: [
      `${process.env.PUBLIC_URL}/project-images/orbit.png`,
      `${process.env.PUBLIC_URL}/project-images/orbitviz.png`
    ],
    link: "https://github.com/yourusername/space-debris-visualization"
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
    role: "Research Assistant (Ml Engineer) · San Diego State Research Foundation",
    title: "Geospatial Data & ML Pipeline Engineer",
    description:
      "• Developed a cloud-based data pipeline on AWS to process Sentinel-2 satellite imagery for agricultural and land-use monitoring.\n" +
      "• Applied preprocessing (cloud/water masking, NDVI/NDWI), documented metadata, and built LSTM models that boosted classification accuracy from 72% to 85%.\n" +
      "• Collaborated with interdisciplinary teams to deliver actionable geospatial insights with version-controlled QA/QC workflows."
  },
   {
    period: "Aug 2025 – Present",
    role: "Research Assistant (ML Engineer) · San Diego State Research Foundation",
    title: "treet View Object Detection for Homeless Site Identification",
    description:
      "• Built a computer vision data pipeline using Google Street View imagery from high-density homeless areas and manually annotated datasets into four object classes for supervised object detection\n" +
      "• Trained and evaluated multiple object detection models (YOLOv8, RT-DETR/RT-DETRv2, SSD, YOLO-NAS), iteratively improving model performance from an initial 70% accuracy while analyzing accuracy–latency trade-offs for deployment readiness.\n" +
      "• Developed a scalable annotation-to-inference workflow and deployed an initial pre-production Streamlit application to test real-time street-level mapping using recorded video feeds, supporting responsible urban planning and outreach initiatives."
  },
  {
    period: "Jun 2023 – Jul 2023",
    role: "Research & Project Intern · Bhabha Atomic Research Center (CAD)",
    title: "Full Stack Data Tools Developer",
    description:
      "• Designed a full-stack analytics platform to detect defects in nuclear systems using Flask (API), React (UI), and MySQL.\n" +
      "• Automated end-to-end ETL pipelines for defect log parsing and reduced manual handling.\n" +
      "• Authored technical documentation and presented data-driven risk reports to stakeholders."
  }
];





  return (
    <div className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth bg-gradient-to-r from-gray-900 to-black text-white font-sans">
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
          I’m a creative technologist and data-driven problem solver passionate about building intelligent tools.
          I love working at the intersection of code, data, and design.Graduate student in Big Data Analytics with practical experience in machine learning, backend development, and automating data
pipelines. I’m looking for opportunities where I can contribute to data-driven research and help design intelligent systems
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
      
      {/* Development */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold text-white mb-3">Development</h3>
        <ul className="space-y-1 list-disc list-inside">
          <li>Python (Flask, FastAPI)</li>
          <li>JavaScript (basic)</li>
          <li>R</li>
          <li>SQL (MySQL), NoSQL (MongoDB)</li>
        </ul>
      </div>

      {/* Data Science & Machine Learning */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold text-white mb-3">Data Science & ML</h3>
        <ul className="space-y-1 list-disc list-inside">
          <li>Pandas, NumPy, Scikit-learn, XGBoost</li>
          <li>Deep Learning: TensorFlow, Keras, PyTorch</li>
          <li>LLMs: GPT-4, Claude, Llama, Langchain</li>
          <li>RAG Pipelines & Semantic Search</li>
        </ul>
      </div>

      {/* Cloud, Tools & Visualization */}
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
    <section id="experience" className="h-screen snap-start px-6 py-12 flex flex-col justify-center relative z-10 border-b border-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-10">Experience</h2>
        <div className="space-y-10">
          {experiences.map((exp, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-start md:gap-12">
              <span className="text-gray-500 w-32 shrink-0 mb-2 md:mb-0 text-sm md:text-base">{exp.period}</span>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                <p className="text-sm text-gray-400 italic">{exp.title}</p>
                <p className="text-gray-300 text-sm md:text-base">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Projects Section */}
    <section id="projects" className="h-screen snap-start px-6 py-12 flex flex-col justify-center relative z-10">
      <h2 className="text-4xl font-bold mb-10 text-center">Projects</h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        {projects.map((project, index) => (
          <motion.div key={index} variants={item}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow overflow-hidden flex flex-col h-full">
              {project.images && project.images.length > 0 && (
                <div 
                  className="h-48 bg-gray-700 bg-cover bg-center"
                  style={{ backgroundImage: `url('${project.images[0]}')` }}
                />
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4 flex-grow">{project.description}</p>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
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
      Reach out to me via this form. I’ll get back to you as soon as I can!
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
      
      {/* Close Button */}
      <button
        onClick={() => setSelectedProject(null)}
        className="absolute top-4 right-6 text-gray-400 hover:text-white text-2xl"
      >
        ×
      </button>

      {/* Project Title */}
      <h3 className="text-3xl font-bold mb-4">{selectedProject.title}</h3>

      {/* Image Carousel */}
      {selectedProject.images && selectedProject.images.length > 0 && (
        <div className="relative mb-6 w-full bg-gray-700 rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
          {selectedProject.images.map((image, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ${
                (projectImageIndices[selectedProject.title] ?? 0) === idx
                  ? "opacity-100"
                  : "opacity-0"
              }`}
              style={{
                backgroundImage: `url('${image}')`,
              }}
            />
          ))}
          
          {/* Image Indicators */}
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

      {/* Project Description */}
      <div className="text-gray-400 space-y-4 text-sm leading-relaxed">
  {selectedProject.extendedDescription || selectedProject.description}
</div>

    
      

      {/* GitHub Link */}
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


    </div>   
  )
}


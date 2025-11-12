import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";

function LoadingScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1600);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-50 overflow-hidden">
      <CanvasRain />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4 animate-pulse">JovanStar</h1>
        <div className="w-40 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-white/70" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.2, ease: 'linear' }} />
        </div>
      </motion.div>
    </div>
  );
}

function CanvasRain() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const chars = ("あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン中日人日語。！？").split("");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const fontSize = 18;
    ctx.font = `${fontSize}px monospace`;

    function buildDrops() {
      const cols = Math.floor(width / fontSize) + 1;
      const drops = new Array(cols).fill(0).map(() => ({
        y: Math.random() * height - height,
        speed: 0.6 + Math.random() * 2.4,
        x: 0,
        char: chars[Math.floor(Math.random() * chars.length)],
        switchInterval: 5 + Math.floor(Math.random() * 30),
        counter: 0,
      }));
      drops.forEach((d, i) => (d.x = i * fontSize));
      return drops;
    }

    let drops = buildDrops();

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      drops = buildDrops();
    }

    window.addEventListener("resize", resize);

    function draw() {
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.counter++;
        if (d.counter % d.switchInterval === 0) {
          d.char = chars[Math.floor(Math.random() * chars.length)];
        }
        ctx.fillStyle = "rgba(200,220,255,0.9)";
        ctx.fillText(d.char, d.x, d.y);
        d.y += d.speed * (0.5 + Math.random() * 1.5);
        if (d.y > height + 20) {
          d.y = -20 - Math.random() * height * 0.5;
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
}

function AgeCounter({ birthISO = "2008-06-21T00:00:00+05:00" }) {
  const [age, setAge] = React.useState("");

  React.useEffect(() => {
    const tick = () => {
      const now = new Date();
      const years = now.getFullYear() - 2008;
      const months = String(now.getMonth() + 1).padStart(2, '0');
      const days = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setAge(`${years}.${months}${days}${hours}${seconds}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-mono">{age}</span>;
}


function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans">
      <Helmet>
        <title>JovanStar Portfolio</title>
        <meta name="description" content="Your Description" />
        <meta name="keywords" content="portfolio, developer, projects, coding, hardware" />
        <meta name="author" content="JovanStar" />
        <link rel="icon" href="https://i.ibb.co/hJXwDvWD/profilepic.jpg" />
      </Helmet>
      <CanvasRain />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl bg-black/75 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-6 flex flex-col justify-start mt-[-40px]">
          <Header />
          <div className="mt-6">{children}</div>
        </div>
      </div>
      <div className="pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/40 z-20">© {new Date().getFullYear()} JovanStar</div>
    </div>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md overflow-hidden">
          <img src="https://i.ibb.co/RTNpJhSM/Copilot-20251019-203307-removebg-preview.png" alt="Logo" className="200 154 object-cover" />
        </div>
      </div>
      <nav className="flex gap-8 text-sm text-white/80">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/links">Links</NavLink>
      </nav>
    </div>
  );
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="relative group text-white/80">
      <span className="transition-all duration-200 group-hover:underline underline-offset-4 decoration-gray-400 font-bold">{children}</span>
    </Link>
  );
}

function HomePage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
      <div className="flex-shrink-0">
        <div className="w-28 h-28 rounded-md border-2 border-gray-500 overflow-hidden relative">
          <img src="https://i.ibb.co/hJXwDvWD/profilepic.jpg" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="flex-1 text-sm text-white/85 leading-relaxed">
        <p className="text-lg font-semibold flex items-center justify-center sm:justify-start gap-3">
          Hi I'm Jovan <span className="bg-white/10 px-2 py-0.5 rounded-md border border-gray-600 text-xs text-white/80">(he/him)</span>
        </p>
        <p className="mt-1">Im <AgeCounter /> years old.</p>
        <p className="mt-3">
I have been doing minecraft plugin/server development for more than 2 years!
I also have my own studio where all my previous plugins can be viewed. You can see my works on the next page!
I am ready to help your server with plugins or similar.</p> <span className='bg-white/10 px-2 py-0.5 rounded-md border border-gray-600 text-xs text-white/80'>And i do exist :3</span>
        <div className="mt-4 flex justify-center sm:justify-start gap-3">
          <a href="mailto:jovanstardev@gmail.com" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md border border-gray-500 transition-all flex items-center gap-2">
            <img src="https://img.icons8.com/ios/50/FFFFFF/new-post--v1.png" alt="Email" className="w-5 h-5" /> Email
          </a>
          <a href="https://discord.gg/starstudiomc" className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md border border-gray-500 transition-all flex items-center gap-2">
            <img src="https://img.icons8.com/ios-filled/50/FFFFFF/discord-logo.png" alt="Discord" className="w-5 h-5" /> Discord
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function ContactPage() {
  const contact = [
    { name: "Email", img: "https://img.icons8.com/ios/50/FFFFFF/new-post--v1.png", link: "mailto:jovanstardev@gmail.com" },
    { name: "Discord", img: "https://img.icons8.com/ios-filled/50/FFFFFF/discord-logo.png", link: "https://discord.gg/ffv7N2jkV8" },
    { name: "Instagram", img: "https://img.icons8.com/ios/50/FFFFFF/instagram-new--v1.png", link: "https://instagram.com/jovanvuv3" },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <h2 className="text-2xl mb-4 font-bold">Contacts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {contact.map((f) => (
          <a key={f.name} href={f.link} className="bg-white/6 p-4 rounded-xl flex flex-col items-center hover:bg-white/12 transition-all">
            <img src={f.img} alt={f.name} className="w-16 h-16 object-cover mb-2" />
            <p className="text-lg font-bold">{f.name}</p>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <h2 className="text-2xl mb-4 font-bold">Projects</h2>
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <a href="https://builtbybit.com/creators/jovanstar.407417/" target="_blank" rel="noreferrer" className="bg-white/6 p-3 rounded-xl border border-gray-500 hover:bg-white/12 transition-all flex items-center gap-3 justify-center">
          <img src="https://avatars.githubusercontent.com/u/86993355?s=200&v=4" alt="BuiltByBit" className="w-10 h-10 rounded-md" />
          <span className="font-bold">BuiltByBit</span>
        </a>
        <a href="https://discord.gg/starstudiomc" target="_blank" rel="noreferrer" className="bg-white/6 p-3 rounded-xl border border-gray-500 hover:bg-white/12 transition-all flex items-center gap-3 justify-center">
          <img src="https://avatars.githubusercontent.com/u/71634013?s=200&v=4" alt="Polymart" className="w-10 h-10 rounded-md" />
          <span className="font-bold">My Studio</span>
        </a>
      </div>
    </motion.div>
  );
}

function LinksPage() {
  const links = [
    { name: "GitHub", url: "https://github.com/jovanstardev", icon: "https://img.icons8.com/ios-glyphs/60/FFFFFF/github.png" },
    { name: "Discord", url: "https://discord.com/starstudiomc", icon: "https://img.icons8.com/ios-glyphs/30/FFFFFF/discord-logo.png" },
    { name: "Instagram", url: "https://instagram.com/jovanvuv3", icon: "https://img.icons8.com/ios/50/FFFFFF/instagram-new--v1.png" },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <h2 className="text-2xl mb-4 font-bold">Links</h2>
      <div className="flex flex-col items-start gap-3 mx-auto w-fit">
        {links.map((l) => (
          <a key={l.name} href={l.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white/6 hover:bg-white/12 px-4 py-2 rounded-lg border border-gray-500 transition-all">
            <img src={l.icon} alt={l.name} className="w-5 h-5" />
            <span className="font-bold text-sm">{l.name}</span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}

export default function PortfolioApp() {
  const [loading, setLoading] = useState(true);
  if (loading) return <LoadingScreen onFinish={() => setLoading(false)} />;
  return (
    <Router>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/links" element={<LinksPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </Router>
  );
}
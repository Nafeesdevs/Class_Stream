// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { Sparkles, Search, ArrowRight, Play, Pause, CheckCircle, Users, MousePointer2 } from "lucide-react";

// /* ------------------------------------------------------------------
//    "CHANNELS": the hero behaves like a live streaming wall.
//    Tags, headline word, colours, player image, chapters and search
//    placeholder all change together when the channel changes.
// ------------------------------------------------------------------- */
// const FALLBACK_IMG =
//   "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80";

// const CHANNELS = [
//   {
//     tag: "Full Stack",
//     word: "Full-Stack",
//     query: "full stack developer",
//     title: "Full-Stack Cloud Architecture",
//     seconds: 760,
//     c1: "#2563eb",
//     c2: "#06b6d4",
//     img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&auto=format&fit=crop&q=80",
//     chapters: ["Project blueprint", "APIs & databases", "Deploy to the cloud", "Scale & monitor"],
//   },
//   {
//     tag: "Python & AI",
//     word: "Python & AI",
//     query: "python machine learning",
//     title: "Python for Machine Learning",
//     seconds: 905,
//     c1: "#7c3aed",
//     c2: "#ec4899",
//     img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80",
//     chapters: ["Data foundations", "Training a model", "Evaluating results", "Ship to production"],
//   },
//   {
//     tag: "System Design",
//     word: "System Design",
//     query: "system design",
//     title: "Designing Systems at Scale",
//     seconds: 1180,
//     c1: "#059669",
//     c2: "#0ea5e9",
//     img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80",
//     chapters: ["Requirements", "Load balancing", "Caching & queues", "Failure & recovery"],
//   },
//   {
//     tag: "DevOps",
//     word: "DevOps",
//     query: "devops cloud",
//     title: "CI/CD & Kubernetes Essentials",
//     seconds: 640,
//     c1: "#ea580c",
//     c2: "#f59e0b",
//     img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=900&auto=format&fit=crop&q=80",
//     chapters: ["Pipelines", "Containers", "Kubernetes basics", "Observability"],
//   },
// ];

// const GLYPHS = [
//   { t: "</>", s: { left: "49%", top: "24%" }, d: 40, r: -8, dur: 7 },
//   { t: "{ }", s: { left: "47%", top: "9%" }, d: -30, r: 6, dur: 8 },
//   { t: "AI", s: { right: "2%", top: "52%" }, d: 55, r: 10, dur: 9 },
//   { t: "git", s: { left: "44%", bottom: "8%" }, d: -45, r: -5, dur: 7.5 },
//   { t: "npm", s: { left: "51%", bottom: "24%" }, d: 25, r: 7, dur: 8.5 },
//   { t: "k8s", s: { right: "30%", bottom: "5%" }, d: -60, r: -9, dur: 9.5 },
// ];

// const CYCLE_SECONDS = 9; // how long each channel plays before auto-switching
// const clamp01 = (v) => Math.max(0, Math.min(1, v));
// const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
// const chapterAt = (ch, p) => Math.min(ch.chapters.length - 1, Math.floor(p * ch.chapters.length));

// /* Button that is gently pulled toward the cursor */
// const Magnetic = ({ children, strength = 0.32 }) => {
//   const ref = useRef(null);
//   const move = (e) => {
//     if (e.pointerType !== "mouse" || !ref.current) return;
//     const r = ref.current.getBoundingClientRect();
//     const x = (e.clientX - (r.left + r.width / 2)) * strength;
//     const y = (e.clientY - (r.top + r.height / 2)) * strength;
//     ref.current.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
//   };
//   const leave = () => ref.current && (ref.current.style.transform = "");
//   return (
//     <span ref={ref} className="hx-mag" onPointerMove={move} onPointerLeave={leave}>
//       {children}
//     </span>
//   );
// };

// const CountUp = ({ to, duration = 1800 }) => {
//   const [v, setV] = useState(0);
//   useEffect(() => {
//     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
//       setV(to);
//       return undefined;
//     }
//     let raf;
//     let start;
//     const step = (t) => {
//       if (start === undefined) start = t;
//       const k = Math.min((t - start) / duration, 1);
//       setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
//       if (k < 1) raf = requestAnimationFrame(step);
//     };
//     raf = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(raf);
//   }, [to, duration]);
//   return <>{v.toLocaleString("en-US")}+</>;
// };

// const HEADLINE_WORDS = [
//   ["with", false],
//   ["studio-grade", false],
//   ["course", true],
//   ["streaming", true],
// ];

// export const HeroSection = () => {
//   const navigate = useNavigate();
//   const [query, setQuery] = useState("");
//   const [placeholder, setPlaceholder] = useState("Search full stack, python, UI/UX, cloud...");
//   const [idx, setIdx] = useState(0);
//   const [prev, setPrev] = useState(-1);
//   const [chap, setChap] = useState(0);
//   const [playing, setPlaying] = useState(true);
//   const [dragging, setDragging] = useState(false);

//   const heroRef = useRef(null);
//   const scrubRef = useRef(null);
//   const tipRef = useRef(null);
//   const timeRef = useRef(null);
//   const videoRef = useRef(null);
//   const cursorRef = useRef(null);

//   // Everything the animation loop needs lives in one ref: no re-render per frame.
//   const live = useRef({
//     idx: 0, chap: 0, p: 0, playing: true, drag: false, inView: true, reduce: false,
//     w: 1, h: 1, tx: 0, ty: 0, x: 0, y: 0, thx: 0, thy: 0, hx: 0, hy: 0, lastMove: 0,
//   });

//   const select = useCallback((i) => {
//     const L = live.current;
//     if (i === L.idx) return;
//     setPrev(L.idx);
//     L.idx = i;
//     L.p = 0;
//     L.chap = 0;
//     setIdx(i);
//     setChap(0);
//   }, []);

//   /* ---------------- the engine: playback + cursor smoothing ---------------- */
//   useEffect(() => {
//     const L = live.current;
//     const hero = heroRef.current;
//     L.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     const measure = () => {
//       L.w = hero.offsetWidth || 1;
//       L.h = hero.offsetHeight || 1;
//     };
//     measure();
//     L.hx = L.thx = L.w * 0.7;
//     L.hy = L.thy = L.h * 0.3;
//     window.addEventListener("resize", measure);

//     const io = new IntersectionObserver(([e]) => (L.inView = e.isIntersecting), { threshold: 0 });
//     io.observe(hero);

//     let raf;
//     let last = performance.now();
//     const tick = (now) => {
//       raf = requestAnimationFrame(tick);
//       if (!L.inView) {
//         last = now;
//         return;
//       }
//       const dt = Math.min((now - last) / 1000, 0.05);
//       last = now;

//       // 1) simulated playback
//       if (L.playing && !L.drag && !L.reduce) {
//         L.p += dt / CYCLE_SECONDS;
//         if (L.p >= 1) {
//           const next = (L.idx + 1) % CHANNELS.length;
//           setPrev(L.idx);
//           L.idx = next;
//           L.p = 0;
//           L.chap = 0;
//           setIdx(next);
//           setChap(0);
//         }
//       }
//       hero.style.setProperty("--p", L.p.toFixed(4));
//       const ch = CHANNELS[L.idx];
//       if (timeRef.current) timeRef.current.textContent = `${fmt(L.p * ch.seconds)} / ${fmt(ch.seconds)}`;
//       const c = chapterAt(ch, L.p);
//       if (c !== L.chap) {
//         L.chap = c;
//         setChap(c);
//       }

//       // 2) cursor smoothing (falls back to a slow idle drift so touch devices stay alive)
//       if (!L.reduce) {
//         if (now - L.lastMove > 2500) {
//           L.tx = Math.sin(now / 2600) * 0.35;
//           L.ty = Math.cos(now / 3300) * 0.28;
//           L.thx = L.w * (0.55 + 0.25 * Math.sin(now / 3000));
//           L.thy = L.h * (0.45 + 0.25 * Math.cos(now / 3700));
//         }
//         L.x += (L.tx - L.x) * 0.07;
//         L.y += (L.ty - L.y) * 0.07;
//         L.hx += (L.thx - L.hx) * 0.16;
//         L.hy += (L.thy - L.hy) * 0.16;
//         hero.style.setProperty("--nx", L.x.toFixed(3));
//         hero.style.setProperty("--ny", L.y.toFixed(3));
//         hero.style.setProperty("--hx", `${L.hx.toFixed(1)}px`);
//         hero.style.setProperty("--hy", `${L.hy.toFixed(1)}px`);
//       }
//     };
//     raf = requestAnimationFrame(tick);

//     return () => {
//       cancelAnimationFrame(raf);
//       io.disconnect();
//       window.removeEventListener("resize", measure);
//     };
//   }, []);

//   /* ---------------- typewriter placeholder, follows the channel ---------------- */
//   useEffect(() => {
//     const text = `Search "${CHANNELS[idx].query}"...`;
//     if (live.current.reduce) {
//       setPlaceholder(text);
//       return undefined;
//     }
//     let i = 0;
//     const id = setInterval(() => {
//       i += 1;
//       setPlaceholder(text.slice(0, i));
//       if (i >= text.length) clearInterval(id);
//     }, 28);
//     return () => clearInterval(id);
//   }, [idx]);

//   /* ---------------- pointer handlers ---------------- */
//   const onHeroMove = (e) => {
//     if (e.pointerType === "touch") return;
//     const r = heroRef.current.getBoundingClientRect();
//     const L = live.current;
//     L.thx = e.clientX - r.left;
//     L.thy = e.clientY - r.top;
//     L.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
//     L.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
//     L.lastMove = performance.now();
//   };
//   const onHeroLeave = () => {
//     const L = live.current;
//     L.tx = 0;
//     L.ty = 0;
//     L.lastMove = performance.now();
//   };

//   const onVideoMove = (e) => {
//     if (e.pointerType !== "mouse" || !videoRef.current || !cursorRef.current) return;
//     const r = videoRef.current.getBoundingClientRect();
//     cursorRef.current.style.transform = `translate(${e.clientX - r.left + 16}px, ${e.clientY - r.top + 16}px)`;
//   };

//   const togglePlay = () => {
//     const next = !live.current.playing;
//     live.current.playing = next;
//     setPlaying(next);
//   };

//   /* ---------------- scrubbing ---------------- */
//   const pFromEvent = (e) => {
//     const r = scrubRef.current.getBoundingClientRect();
//     return clamp01((e.clientX - r.left) / r.width);
//   };
//   const updateTip = (p) => {
//     if (!tipRef.current) return;
//     const ch = CHANNELS[live.current.idx];
//     tipRef.current.style.left = `${Math.min(Math.max(p, 0.17), 0.83) * 100}%`;
//     tipRef.current.textContent = `${fmt(p * ch.seconds)} · ${ch.chapters[chapterAt(ch, p)]}`;
//   };
//   const onScrubDown = (e) => {
//     e.currentTarget.setPointerCapture(e.pointerId);
//     live.current.drag = true;
//     setDragging(true);
//     live.current.p = pFromEvent(e);
//   };
//   const onScrubMove = (e) => {
//     const p = pFromEvent(e);
//     updateTip(p);
//     if (live.current.drag) live.current.p = p;
//   };
//   const onScrubUp = () => {
//     live.current.drag = false;
//     setDragging(false);
//   };
//   const onScrubKey = (e) => {
//     const L = live.current;
//     if (e.key === "ArrowRight") L.p = clamp01(L.p + 0.05);
//     else if (e.key === "ArrowLeft") L.p = clamp01(L.p - 0.05);
//     else if (e.key === "Home") L.p = 0;
//     else if (e.key === "End") L.p = 0.999;
//     else if (e.key === " " || e.key === "Enter") togglePlay();
//     else return;
//     e.preventDefault();
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     navigate(query.trim() ? `/courses?keyword=${encodeURIComponent(query.trim())}` : "/courses");
//   };

//   const ch = CHANNELS[idx];

//   return (
//     <section
//       ref={heroRef}
//       className="hx-hero"
//       style={{ "--hx-c1": ch.c1, "--hx-c2": ch.c2 }}
//       onPointerMove={onHeroMove}
//       onPointerLeave={onHeroLeave}
//     >
//       {/* ---------- background layers ---------- */}
//       <div className="hx-grid" />
//       <div className="hx-grid-lit" />
//       <div className="hx-spot" />
//       <div className="hx-aurora animate-aurora" />
//       {GLYPHS.map((g) => (
//         <span
//           key={g.t}
//           className="hx-glyph"
//           aria-hidden="true"
//           style={{ ...g.s, "--d": g.d, "--r": `${g.r}deg`, "--t": `${g.dur}s` }}
//         >
//           <b>{g.t}</b>
//         </span>
//       ))}

//       <div className="container" style={{ position: "relative", zIndex: 2 }}>
//         <div className="hero-section-wrapper hx-wrap">
//           {/* ============ LEFT: copy ============ */}
//           <div className="hero-content hx-content">
//             <div className="hx-pill hx-in" style={{ "--i": 0 }}>
//               <span className="ping-indicator hx-dot" />
//               <Sparkles size={14} color="var(--hx-c1)" />
//               <span>Next-Gen Video Learning Platform</span>
//             </div>

//             <h1 className="hx-h1">
//               <span className="hx-line hx-in" style={{ "--i": 1 }}>
//                 Master{" "}
//                 <span className="hx-roller" aria-label={ch.word}>
//                   {CHANNELS.map((c, i) => (
//                     <span
//                       key={c.word}
//                       aria-hidden="true"
//                       className={i === idx ? "is-on" : i === prev ? "is-out" : ""}
//                     >
//                       {c.word}
//                     </span>
//                   ))}
//                 </span>
//               </span>
//               <span className="hx-line">
//                 {HEADLINE_WORDS.map(([w, grad], i) => (
//                   <React.Fragment key={w}>
//                     <span className={`hx-w hx-in${grad ? " hx-grad" : ""}`} style={{ "--i": i + 2 }}>
//                       {w}
//                     </span>{" "}
//                   </React.Fragment>
//                 ))}
//               </span>
//             </h1>

//             <p className="hx-lead hx-in" style={{ "--i": 6 }}>
//               Experience zero-buffering high definition learning tracks in Full-Stack, AI, System Design, and Modern
//               Cloud. Watch free trial lectures with verified syllabi before enrolling.
//             </p>

//             <form className="hx-search hx-in" style={{ "--i": 7 }} onSubmit={handleSearchSubmit}>
//               <Search size={18} color="var(--text-muted)" style={{ marginRight: "0.65rem", flexShrink: 0 }} />
//               <input
//                 type="text"
//                 placeholder={placeholder}
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 aria-label="Search courses"
//               />
//               <Magnetic strength={0.25}>
//                 <button type="submit" className="btn btn-primary btn-sm hx-search-btn">
//                   Search
//                 </button>
//               </Magnetic>
//             </form>

//             <div className="hx-tags hx-in" style={{ "--i": 8 }}>
//               <span className="hx-tags-label">
//                 <i /> Now streaming:
//               </span>
//               {CHANNELS.map((c, i) => (
//                 <button
//                   key={c.tag}
//                   type="button"
//                   className={`hx-tag${i === idx ? " is-on" : ""}`}
//                   style={{ "--tc": c.c1 }}
//                   onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
//                   onFocus={() => select(i)}
//                   onClick={() => navigate(`/courses?keyword=${encodeURIComponent(c.tag)}`)}
//                 >
//                   {c.tag}
//                   {i === idx && <em className="hx-tag-fill" />}
//                 </button>
//               ))}
//             </div>

//             <div className="hero-buttons hx-btns hx-in" style={{ "--i": 9 }}>
//               <Magnetic>
//                 <Link to="/courses" className="btn btn-primary btn-lg hover-elevate hx-cta">
//                   Explore Catalog <ArrowRight size={18} />
//                 </Link>
//               </Magnetic>
//               <Magnetic>
//                 <Link to="/register" className="btn btn-outline btn-lg hover-elevate hx-cta-alt">
//                   Get Started Free
//                 </Link>
//               </Magnetic>
//             </div>
//           </div>

//           {/* ============ RIGHT: interactive player (must stay the LAST child) ============ */}
//           <div className="hx-stage">
//             <div className="hx-tilt">
//               <div className="hx-player">
//                 <div className="hx-chrome">
//                   <div className="hx-lights">
//                     <i style={{ background: "#ef4444" }} />
//                     <i style={{ background: "#f59e0b" }} />
//                     <i style={{ background: "#10b981" }} />
//                   </div>
//                   <div className="hx-quality">
//                     <span className="ping-indicator hx-dot hx-dot--sm" />
//                     <span>4K UHD • 60fps Stream</span>
//                   </div>
//                 </div>

//                 <div className="hx-video" ref={videoRef} onPointerMove={onVideoMove}>
//                   {CHANNELS.map((c, i) => (
//                     <img
//                       key={c.img}
//                       className={`hx-shot${i === idx ? " is-on" : ""}`}
//                       src={c.img}
//                       alt={i === idx ? `${c.title} preview` : ""}
//                       aria-hidden={i !== idx}
//                       loading={i === 0 ? "eager" : "lazy"}
//                       onError={(e) => {
//                         if (e.currentTarget.dataset.fb) return;
//                         e.currentTarget.dataset.fb = "1";
//                         e.currentTarget.src = FALLBACK_IMG;
//                       }}
//                     />
//                   ))}
//                   <i className="hx-tint" />

//                   <button
//                     type="button"
//                     className={`hx-hit${playing ? "" : " is-paused"}`}
//                     onClick={togglePlay}
//                     aria-label={playing ? "Pause preview" : "Play preview"}
//                   >
//                     <span className="hx-play">
//                       {playing ? <Pause size={24} fill="#fff" /> : <Play size={26} fill="#fff" style={{ marginLeft: 3 }} />}
//                     </span>
//                   </button>

//                   <span className="hx-cursor" ref={cursorRef} aria-hidden="true">
//                     <MousePointer2 size={13} /> {playing ? "Click to pause" : "Click to play"}
//                   </span>

//                   <div className="hx-bottom">
//                     <div
//                       ref={scrubRef}
//                       className={`hx-scrub${dragging ? " is-drag" : ""}`}
//                       role="slider"
//                       tabIndex={0}
//                       aria-label="Lesson timeline"
//                       aria-valuemin={0}
//                       aria-valuemax={100}
//                       aria-valuetext={`${ch.chapters[chap]}`}
//                       onPointerDown={onScrubDown}
//                       onPointerMove={onScrubMove}
//                       onPointerUp={onScrubUp}
//                       onPointerCancel={onScrubUp}
//                       onKeyDown={onScrubKey}
//                     >
//                       <div className="hx-bar">
//                         <i className="hx-fill" />
//                         {ch.chapters.slice(1).map((_, i) => (
//                           <i key={i} className="hx-tick" style={{ left: `${((i + 1) / ch.chapters.length) * 100}%` }} />
//                         ))}
//                         <i className="hx-thumb" />
//                       </div>
//                       <span className="hx-tip" ref={tipRef} />
//                     </div>

//                     <div className="hx-row">
//                       <div style={{ minWidth: 0 }}>
//                         <div className="hx-title">Lesson 0{idx + 1}: {ch.title}</div>
//                         <div className="hx-sub">
//                           <span key={`${idx}-${chap}`} className="hx-swap">
//                             Ch. {chap + 1}/{ch.chapters.length} · {ch.chapters[chap]}
//                           </span>
//                           <span className="hx-sub-dot">•</span>
//                           <span ref={timeRef}>00:00 / {fmt(ch.seconds)}</span>
//                         </div>
//                       </div>
//                       <Link to="/courses" className="badge badge-free hx-trial">
//                         Try free <ArrowRight size={11} />
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//                 <i className="hx-glare" />
//               </div>

//               {/* floating badges sit at different 3D depths */}
//               <div className="hx-badge hx-badge--bl">
//                 <div className="hx-badge-in animate-float">
//                   <div className="hx-badge-ico" style={{ background: "var(--success-bg)", color: "var(--success)", borderColor: "var(--success-border)" }}>
//                     <CheckCircle size={22} />
//                   </div>
//                   <div>
//                     <div className="hx-badge-t">100% Industry Ready</div>
//                     <div className="hx-badge-s">Production-Grade Projects</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="hx-badge hx-badge--tr">
//                 <div className="hx-badge-in animate-float-reverse">
//                   <div className="hx-badge-ico" style={{ background: "var(--primary-light)", color: "var(--primary)", borderColor: "rgba(37,99,235,.2)" }}>
//                     <Users size={20} />
//                   </div>
//                   <div>
//                     <div className="hx-badge-t">
//                       <CountUp to={14200} />
//                     </div>
//                     <div className="hx-badge-s">Active Learners Streaming</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;


import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Search, ArrowRight, Play, Pause, CheckCircle, Users, MousePointer2 } from "lucide-react";

/* ------------------------------------------------------------------
   "CHANNELS": the hero behaves like a live streaming wall.
   Tags, headline word, colours, player image, chapters and search
   placeholder all change together when the channel changes.
------------------------------------------------------------------- */
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80";

const CHANNELS = [
  {
    tag: "Full Stack",
    word: "Full-Stack",
    query: "full stack developer",
    title: "Full-Stack Cloud Architecture",
    seconds: 760,
    c1: "#2563eb",
    c2: "#3b82f6",
    img: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&auto=format&fit=crop&q=80",
    chapters: ["Project blueprint", "APIs & databases", "Deploy to the cloud", "Scale & monitor"],
  },
  {
    tag: "Python & AI",
    word: "Python & AI",
    query: "python machine learning",
    title: "Python for Machine Learning",
    seconds: 905,
    c1: "#1d4ed8",
    c2: "#60a5fa",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80",
    chapters: ["Data foundations", "Training a model", "Evaluating results", "Ship to production"],
  },
  {
    tag: "System Design",
    word: "System Design",
    query: "system design",
    title: "Designing Systems at Scale",
    seconds: 1180,
    c1: "#1e3a8a",
    c2: "#3b82f6",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80",
    chapters: ["Requirements", "Load balancing", "Caching & queues", "Failure & recovery"],
  },
  {
    tag: "DevOps",
    word: "DevOps",
    query: "devops cloud",
    title: "CI/CD & Kubernetes Essentials",
    seconds: 640,
    c1: "#0f172a",
    c2: "#2563eb",
    img: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=900&auto=format&fit=crop&q=80",
    chapters: ["Pipelines", "Containers", "Kubernetes basics", "Observability"],
  },
];

const GLYPHS = [
  { t: "</>", s: { left: "49%", top: "24%" }, d: 40, r: -8, dur: 7 },
  { t: "{ }", s: { left: "47%", top: "9%" }, d: -30, r: 6, dur: 8 },
  { t: "AI", s: { right: "2%", top: "52%" }, d: 55, r: 10, dur: 9 },
  { t: "git", s: { left: "44%", bottom: "8%" }, d: -45, r: -5, dur: 7.5 },
  { t: "npm", s: { left: "51%", bottom: "24%" }, d: 25, r: 7, dur: 8.5 },
  { t: "k8s", s: { right: "30%", bottom: "5%" }, d: -60, r: -9, dur: 9.5 },
];

const CYCLE_SECONDS = 9; // how long each channel plays before auto-switching
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const chapterAt = (ch, p) => Math.min(ch.chapters.length - 1, Math.floor(p * ch.chapters.length));

/* Button that is gently pulled toward the cursor */
const Magnetic = ({ children, strength = 0.32 }) => {
  const ref = useRef(null);
  const move = (e) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  const leave = () => ref.current && (ref.current.style.transform = "");
  return (
    <span ref={ref} className="hx-mag" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </span>
  );
};

const CountUp = ({ to, duration = 1800 }) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return undefined;
    }
    let raf;
    let start;
    const step = (t) => {
      if (start === undefined) start = t;
      const k = Math.min((t - start) / duration, 1);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{v.toLocaleString("en-US")}+</>;
};

const HEADLINE_WORDS = [
  ["with", false],
  ["studio-grade", false],
  ["course", true],
  ["streaming", true],
];

export const HeroSection = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("Search full stack, python, UI/UX, cloud...");
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [chap, setChap] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [dragging, setDragging] = useState(false);

  const heroRef = useRef(null);
  const scrubRef = useRef(null);
  const tipRef = useRef(null);
  const timeRef = useRef(null);
  const videoRef = useRef(null);
  const cursorRef = useRef(null);

  // Everything the animation loop needs lives in one ref: no re-render per frame.
  const live = useRef({
    idx: 0, chap: 0, p: 0, playing: true, drag: false, inView: true, reduce: false,
    w: 1, h: 1, tx: 0, ty: 0, x: 0, y: 0, thx: 0, thy: 0, hx: 0, hy: 0, lastMove: 0,
  });

  const select = useCallback((i) => {
    const L = live.current;
    if (i === L.idx) return;
    setPrev(L.idx);
    L.idx = i;
    L.p = 0;
    L.chap = 0;
    setIdx(i);
    setChap(0);
  }, []);

  /* ---------------- the engine: playback + cursor smoothing ---------------- */
  useEffect(() => {
    const L = live.current;
    const hero = heroRef.current;
    L.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      L.w = hero.offsetWidth || 1;
      L.h = hero.offsetHeight || 1;
    };
    measure();
    L.hx = L.thx = L.w * 0.7;
    L.hy = L.thy = L.h * 0.3;
    window.addEventListener("resize", measure);

    const io = new IntersectionObserver(([e]) => (L.inView = e.isIntersecting), { threshold: 0 });
    io.observe(hero);

    let raf;
    let last = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!L.inView) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // 1) simulated playback
      if (L.playing && !L.drag && !L.reduce) {
        L.p += dt / CYCLE_SECONDS;
        if (L.p >= 1) {
          const next = (L.idx + 1) % CHANNELS.length;
          setPrev(L.idx);
          L.idx = next;
          L.p = 0;
          L.chap = 0;
          setIdx(next);
          setChap(0);
        }
      }
      hero.style.setProperty("--p", L.p.toFixed(4));
      const ch = CHANNELS[L.idx];
      if (timeRef.current) timeRef.current.textContent = `${fmt(L.p * ch.seconds)} / ${fmt(ch.seconds)}`;
      const c = chapterAt(ch, L.p);
      if (c !== L.chap) {
        L.chap = c;
        setChap(c);
      }

      // 2) cursor smoothing (falls back to a slow idle drift so touch devices stay alive)
      if (!L.reduce) {
        if (now - L.lastMove > 2500) {
          L.tx = Math.sin(now / 2600) * 0.35;
          L.ty = Math.cos(now / 3300) * 0.28;
          L.thx = L.w * (0.55 + 0.25 * Math.sin(now / 3000));
          L.thy = L.h * (0.45 + 0.25 * Math.cos(now / 3700));
        }
        L.x += (L.tx - L.x) * 0.07;
        L.y += (L.ty - L.y) * 0.07;
        L.hx += (L.thx - L.hx) * 0.16;
        L.hy += (L.thy - L.hy) * 0.16;
        hero.style.setProperty("--nx", L.x.toFixed(3));
        hero.style.setProperty("--ny", L.y.toFixed(3));
        hero.style.setProperty("--hx", `${L.hx.toFixed(1)}px`);
        hero.style.setProperty("--hy", `${L.hy.toFixed(1)}px`);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* ---------------- typewriter placeholder, follows the channel ---------------- */
  useEffect(() => {
    const text = `Search "${CHANNELS[idx].query}"...`;
    if (live.current.reduce) {
      setPlaceholder(text);
      return undefined;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setPlaceholder(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [idx]);

  /* ---------------- pointer handlers ---------------- */
  const onHeroMove = (e) => {
    if (e.pointerType === "touch") return;
    const r = heroRef.current.getBoundingClientRect();
    const L = live.current;
    L.thx = e.clientX - r.left;
    L.thy = e.clientY - r.top;
    L.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    L.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    L.lastMove = performance.now();
  };
  const onHeroLeave = () => {
    const L = live.current;
    L.tx = 0;
    L.ty = 0;
    L.lastMove = performance.now();
  };

  const onVideoMove = (e) => {
    if (e.pointerType !== "mouse" || !videoRef.current || !cursorRef.current) return;
    const r = videoRef.current.getBoundingClientRect();
    cursorRef.current.style.transform = `translate(${e.clientX - r.left + 16}px, ${e.clientY - r.top + 16}px)`;
  };

  const togglePlay = () => {
    const next = !live.current.playing;
    live.current.playing = next;
    setPlaying(next);
  };

  /* ---------------- scrubbing ---------------- */
  const pFromEvent = (e) => {
    const r = scrubRef.current.getBoundingClientRect();
    return clamp01((e.clientX - r.left) / r.width);
  };
  const updateTip = (p) => {
    if (!tipRef.current) return;
    const ch = CHANNELS[live.current.idx];
    tipRef.current.style.left = `${Math.min(Math.max(p, 0.17), 0.83) * 100}%`;
    tipRef.current.textContent = `${fmt(p * ch.seconds)} · ${ch.chapters[chapterAt(ch, p)]}`;
  };
  const onScrubDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    live.current.drag = true;
    setDragging(true);
    live.current.p = pFromEvent(e);
  };
  const onScrubMove = (e) => {
    const p = pFromEvent(e);
    updateTip(p);
    if (live.current.drag) live.current.p = p;
  };
  const onScrubUp = () => {
    live.current.drag = false;
    setDragging(false);
  };
  const onScrubKey = (e) => {
    const L = live.current;
    if (e.key === "ArrowRight") L.p = clamp01(L.p + 0.05);
    else if (e.key === "ArrowLeft") L.p = clamp01(L.p - 0.05);
    else if (e.key === "Home") L.p = 0;
    else if (e.key === "End") L.p = 0.999;
    else if (e.key === " " || e.key === "Enter") togglePlay();
    else return;
    e.preventDefault();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/courses?keyword=${encodeURIComponent(query.trim())}` : "/courses");
  };

  const ch = CHANNELS[idx];

  return (
    <section
      ref={heroRef}
      className="hx-hero"
      style={{ "--hx-c1": ch.c1, "--hx-c2": ch.c2 }}
      onPointerMove={onHeroMove}
      onPointerLeave={onHeroLeave}
    >
      {/* ---------- background layers ---------- */}
      <div className="hx-grid" />
      <div className="hx-grid-lit" />
      <div className="hx-spot" />
      <div className="hx-aurora animate-aurora" />
      {GLYPHS.map((g) => (
        <span
          key={g.t}
          className="hx-glyph"
          aria-hidden="true"
          style={{ ...g.s, "--d": g.d, "--r": `${g.r}deg`, "--t": `${g.dur}s` }}
        >
          <b>{g.t}</b>
        </span>
      ))}

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div className="hero-section-wrapper hx-wrap">
          {/* ============ LEFT: copy ============ */}
          <div className="hero-content hx-content">
            <div className="hx-pill hx-in" style={{ "--i": 0 }}>
              <span className="ping-indicator hx-dot" />
              <Sparkles size={14} color="var(--hx-c1)" />
              <span>Next-Gen Video Learning Platform</span>
            </div>

            <h1 className="hx-h1">
              <span className="hx-line hx-in" style={{ "--i": 1 }}>
                Master{" "}
                <span className="hx-roller" aria-label={ch.word}>
                  {CHANNELS.map((c, i) => (
                    <span
                      key={c.word}
                      aria-hidden="true"
                      className={i === idx ? "is-on" : i === prev ? "is-out" : ""}
                    >
                      {c.word}
                    </span>
                  ))}
                </span>
              </span>
              <span className="hx-line">
                {HEADLINE_WORDS.map(([w, grad], i) => (
                  <React.Fragment key={w}>
                    <span className={`hx-w hx-in${grad ? " hx-grad" : ""}`} style={{ "--i": i + 2 }}>
                      {w}
                    </span>{" "}
                  </React.Fragment>
                ))}
              </span>
            </h1>

            <p className="hx-lead hx-in" style={{ "--i": 6 }}>
              Experience zero-buffering high definition learning tracks in Full-Stack, AI, System Design, and Modern
              Cloud. Watch free trial lectures with verified syllabi before enrolling.
            </p>

            <form className="hx-search hx-in" style={{ "--i": 7 }} onSubmit={handleSearchSubmit}>
              <Search size={18} color="var(--text-muted)" style={{ marginRight: "0.65rem", flexShrink: 0 }} />
              <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search courses"
              />
              <Magnetic strength={0.25}>
                <button type="submit" className="btn btn-primary btn-sm hx-search-btn">
                  Search
                </button>
              </Magnetic>
            </form>

            <div className="hx-tags hx-in" style={{ "--i": 8 }}>
              <span className="hx-tags-label">
                <i /> Now streaming:
              </span>
              {CHANNELS.map((c, i) => (
                <button
                  key={c.tag}
                  type="button"
                  className={`hx-tag${i === idx ? " is-on" : ""}`}
                  style={{ "--tc": c.c1 }}
                  onPointerEnter={(e) => e.pointerType === "mouse" && select(i)}
                  onFocus={() => select(i)}
                  onClick={() => navigate(`/courses?keyword=${encodeURIComponent(c.tag)}`)}
                >
                  {c.tag}
                  {i === idx && <em className="hx-tag-fill" />}
                </button>
              ))}
            </div>

            <div className="hero-buttons hx-btns hx-in" style={{ "--i": 9 }}>
              <Magnetic>
                <Link to="/courses" className="btn btn-primary btn-lg hover-elevate hx-cta">
                  Explore Catalog <ArrowRight size={18} />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/register" className="btn btn-outline btn-lg hover-elevate hx-cta-alt">
                  Get Started Free
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* ============ RIGHT: interactive player (must stay the LAST child) ============ */}
          <div className="hx-stage">
            <div className="hx-tilt">
              <div className="hx-player">
                <div className="hx-chrome">
                  <div className="hx-lights">
                    <i /><i /><i />
                  </div>
                  <div className="hx-quality">
                    <span className="ping-indicator hx-dot hx-dot--sm" />
                    <span>4K UHD • 60fps Stream</span>
                  </div>
                </div>

                <div className="hx-video" ref={videoRef} onPointerMove={onVideoMove}>
                  {CHANNELS.map((c, i) => (
                    <img
                      key={c.img}
                      className={`hx-shot${i === idx ? " is-on" : ""}`}
                      src={c.img}
                      alt={i === idx ? `${c.title} preview` : ""}
                      aria-hidden={i !== idx}
                      loading={i === 0 ? "eager" : "lazy"}
                      onError={(e) => {
                        if (e.currentTarget.dataset.fb) return;
                        e.currentTarget.dataset.fb = "1";
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                  ))}
                  <i className="hx-tint" />

                  <button
                    type="button"
                    className={`hx-hit${playing ? "" : " is-paused"}`}
                    onClick={togglePlay}
                    aria-label={playing ? "Pause preview" : "Play preview"}
                  >
                    <span className="hx-play">
                      {playing ? <Pause size={24} fill="#fff" /> : <Play size={26} fill="#fff" style={{ marginLeft: 3 }} />}
                    </span>
                  </button>

                  <span className="hx-cursor" ref={cursorRef} aria-hidden="true">
                    <MousePointer2 size={13} /> {playing ? "Click to pause" : "Click to play"}
                  </span>

                  <div className="hx-bottom">
                    <div
                      ref={scrubRef}
                      className={`hx-scrub${dragging ? " is-drag" : ""}`}
                      role="slider"
                      tabIndex={0}
                      aria-label="Lesson timeline"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuetext={`${ch.chapters[chap]}`}
                      onPointerDown={onScrubDown}
                      onPointerMove={onScrubMove}
                      onPointerUp={onScrubUp}
                      onPointerCancel={onScrubUp}
                      onKeyDown={onScrubKey}
                    >
                      <div className="hx-bar">
                        <i className="hx-fill" />
                        {ch.chapters.slice(1).map((_, i) => (
                          <i key={i} className="hx-tick" style={{ left: `${((i + 1) / ch.chapters.length) * 100}%` }} />
                        ))}
                        <i className="hx-thumb" />
                      </div>
                      <span className="hx-tip" ref={tipRef} />
                    </div>

                    <div className="hx-row">
                      <div style={{ minWidth: 0 }}>
                        <div className="hx-title">Lesson 0{idx + 1}: {ch.title}</div>
                        <div className="hx-sub">
                          <span key={`${idx}-${chap}`} className="hx-swap">
                            Ch. {chap + 1}/{ch.chapters.length} · {ch.chapters[chap]}
                          </span>
                          <span className="hx-sub-dot">•</span>
                          <span ref={timeRef}>00:00 / {fmt(ch.seconds)}</span>
                        </div>
                      </div>
                      <Link to="/courses" className="hx-trial">
                        Try free <ArrowRight size={11} />
                      </Link>
                    </div>
                  </div>
                </div>
                <i className="hx-glare" />
              </div>

              {/* floating badges sit at different 3D depths */}
              <div className="hx-badge hx-badge--bl">
                <div className="hx-badge-in animate-float">
                  <div className="hx-badge-ico" style={{ background: "var(--primary-light)", color: "var(--primary)", borderColor: "rgba(37,99,235,.2)" }}>
                    <CheckCircle size={22} />
                  </div>
                  <div>
                    <div className="hx-badge-t">100% Industry Ready</div>
                    <div className="hx-badge-s">Production-Grade Projects</div>
                  </div>
                </div>
              </div>

              <div className="hx-badge hx-badge--tr">
                <div className="hx-badge-in animate-float-reverse">
                  <div className="hx-badge-ico" style={{ background: "var(--primary-light)", color: "var(--primary)", borderColor: "rgba(37,99,235,.2)" }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="hx-badge-t">
                      <CountUp to={14200} />
                    </div>
                    <div className="hx-badge-s">Active Learners Streaming</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
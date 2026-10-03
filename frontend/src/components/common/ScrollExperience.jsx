import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/* ---------------------------------------------------------------
   1. WHAT REVEALS ON SCROLL
   Add data-reveal to any element to make it reveal too.
---------------------------------------------------------------- */
const REVEAL_SELECTOR = [
  "main > section",
  "main .section-header",
  "main .card",
  "main .cc-wrap",
  "main .pg",
  "main [data-reveal]",
  "main .auth-split-wrapper > div",
  ".video-learning-page .video-learning-container",
].join(",");

/* ---------------------------------------------------------------
   2. WHAT MOVES AT A DIFFERENT SPEED (parallax layers)
   factor  = vertical px moved per px of distance from viewport centre
   limit   = max vertical travel (px)
   NOTE: never put a layer on an element that is also a reveal target,
   both use the CSS `translate` property.
---------------------------------------------------------------- */
const PARALLAX_LAYERS = [
  { selector: ".animate-aurora", factor: -0.18, limit: 110, xFactor: 0.04, xLimit: 40, scale: 0.05 },
  { selector: ".home-page .hero-section-wrapper > .hero-content", factor: 0.08, limit: 56, xFactor: 0.02, xLimit: 20, scale: 0.014 },
  { selector: ".home-page .hero-section-wrapper > :last-child", factor: -0.16, limit: 120, xFactor: -0.05, xLimit: 56, scale: 0.04 },
  { selector: "main .card img", factor: -0.035, limit: 22, xFactor: 0.006, xLimit: 8, scale: 0.018 },
  { selector: ".cc-media-img", factor: 0.045, limit: 16, xFactor: 0, xLimit: 0, scale: 0 },
  { selector: "main .section-title", factor: 0.07, limit: 26, xFactor: 0, xLimit: 0, scale: 0 },
  { selector: "main .section-subtitle", factor: -0.035, limit: 16, xFactor: 0, xLimit: 0, scale: 0 },
  { selector: ".auth-banner-side > div", factor: 0.045, limit: 22, xFactor: 0.012, xLimit: 10, scale: 0.01 },
];

const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
const lerp = (current, target, t) => {
  const next = current + (target - current) * t;
  return Math.abs(target - next) < 0.005 ? target : next;
};

const ScrollExperience = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const revealTargets = new Set();
    const parallaxTargets = new Map();
    const sectionTargets = new Set();

    /* ---------- reveal on scroll ---------- */
    const revealObserver =
      !reducedMotion && "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries, observer) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("scroll-motion-visible");
                observer.unobserve(entry.target);
              });
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
          )
        : null;

    const delayFor = (node) => {
      // cards stagger by their column so a row cascades left -> right
      if (node.classList.contains("cc-wrap") && node.parentElement) {
        const index = Array.prototype.indexOf.call(node.parentElement.children, node);
        return (index % 3) * 120;
      }
      return (revealTargets.size % 5) * 65;
    };

    const addRevealTarget = (node) => {
      if (!(node instanceof Element) || revealTargets.has(node)) return;
      revealTargets.add(node);
      node.classList.add("scroll-motion-target");
      node.style.setProperty("--scroll-motion-delay", `${delayFor(node)}ms`);
      if (revealObserver) revealObserver.observe(node);
      else node.classList.add("scroll-motion-visible");
    };

    /* ---------- parallax layers ---------- */
    const addParallaxTarget = (node, layer) => {
      if (node instanceof Element && !parallaxTargets.has(node)) {
        parallaxTargets.set(node, { ...layer, currentX: 0, currentY: 0, currentScale: 1 });
        node.classList.add("scroll-parallax-layer");
      }
    };

    // <div data-parallax="0.2"> -> moves 0.2px per px (negative = opposite way)
    const addAttributeParallax = (node) => {
      const speed = parseFloat(node.getAttribute("data-parallax"));
      if (Number.isNaN(speed)) return;
      addParallaxTarget(node, { factor: speed, limit: 220, xFactor: 0, xLimit: 0, scale: 0 });
    };

    const scan = (scope) => {
      if (!(scope instanceof Element || scope instanceof Document)) return;
      if (scope instanceof Element && scope.matches(REVEAL_SELECTOR)) addRevealTarget(scope);
      scope.querySelectorAll(REVEAL_SELECTOR).forEach(addRevealTarget);

      PARALLAX_LAYERS.forEach((layer) => {
        if (scope instanceof Element && scope.matches(layer.selector)) addParallaxTarget(scope, layer);
        scope.querySelectorAll(layer.selector).forEach((node) => addParallaxTarget(node, layer));
      });

      if (scope instanceof Element && scope.matches("[data-parallax]")) addAttributeParallax(scope);
      scope.querySelectorAll("[data-parallax]").forEach(addAttributeParallax);

      if (scope instanceof Element && scope.matches("main > section.section")) sectionTargets.add(scope);
      scope.querySelectorAll("main > section.section").forEach((node) => sectionTargets.add(node));
    };

    scan(document);

    const mutationObserver = new MutationObserver((records) => {
      let added = false;
      records.forEach((record) =>
        record.addedNodes.forEach((n) => {
          scan(n);
          added = true;
        })
      );
      if (added && !reducedMotion) scheduleUpdate();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    /* ---------- the animation loop ---------- */
    let frame = null;
    let lastY = window.scrollY;
    let skew = 0;

    const update = () => {
      frame = null;
      const vh = window.innerHeight;
      const viewportCenter = vh / 2;
      const isMobile = window.innerWidth <= 768;
      const motionScale = isMobile ? 0.6 : 1;
      let stillEasing = false;

      // (a) scroll progress bar
      const maxScroll = root.scrollHeight - vh;
      root.style.setProperty("--scroll-progress", maxScroll > 0 ? (window.scrollY / maxScroll).toFixed(4) : "0");

      // (b) velocity skew: cards lean slightly into fast scrolling, then settle
      const velocity = window.scrollY - lastY;
      lastY = window.scrollY;
      const skewLimit = isMobile ? 1 : 1.8;
      skew = lerp(skew, clamp(velocity * 0.07, skewLimit), 0.14);
      if (Math.abs(velocity) < 0.5 && Math.abs(skew) < 0.01) skew = 0;
      root.style.setProperty("--scroll-skew", `${skew.toFixed(3)}deg`);
      if (skew !== 0) stillEasing = true;

      // (c) parallax layers
      parallaxTargets.forEach((layer, node) => {
        const bounds = node.getBoundingClientRect();
        if (bounds.bottom < -300 || bounds.top > vh + 300) return; // skip far off-screen
        const layerCenter = bounds.top + bounds.height / 2;
        const distance = viewportCenter - layerCenter;
        const targetX = clamp(distance * layer.xFactor * motionScale, layer.xLimit);
        const targetY = clamp(distance * layer.factor * motionScale, layer.limit);
        const depth = vh ? distance / vh : 0;
        const targetScale = 1 + clamp(depth * layer.scale * motionScale, layer.scale);

        layer.currentX = lerp(layer.currentX, targetX, 0.14);
        layer.currentY = lerp(layer.currentY, targetY, 0.14);
        layer.currentScale = lerp(layer.currentScale, targetScale, 0.14);
        node.style.setProperty("--scroll-parallax-x", `${layer.currentX.toFixed(1)}px`);
        node.style.setProperty("--scroll-parallax-y", `${layer.currentY.toFixed(1)}px`);
        node.style.setProperty("--scroll-parallax-scale", layer.currentScale.toFixed(3));
        stillEasing ||=
          layer.currentX !== targetX || layer.currentY !== targetY || layer.currentScale !== targetScale;
      });

      // (d) per-section progress (-1 .. 1) drives the drifting background blobs
      sectionTargets.forEach((section) => {
        const b = section.getBoundingClientRect();
        if (b.bottom < -200 || b.top > vh + 200) return;
        const p = (viewportCenter - (b.top + b.height / 2)) / (vh / 2 + b.height / 2);
        section.style.setProperty("--sp", clamp(p, 1).toFixed(3));
      });

      if (stillEasing) frame = window.requestAnimationFrame(update);
    };

    function scheduleUpdate() {
      if (frame === null) frame = window.requestAnimationFrame(update);
    }

    if (!reducedMotion) {
      scheduleUpdate();
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate);
    }

    /* ---------- cleanup ---------- */
    return () => {
      revealObserver?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) window.cancelAnimationFrame(frame);
      root.style.removeProperty("--scroll-skew");
      revealTargets.forEach((node) => {
        node.classList.remove("scroll-motion-target", "scroll-motion-visible");
        node.style.removeProperty("--scroll-motion-delay");
      });
      parallaxTargets.forEach((_, node) => {
        node.classList.remove("scroll-parallax-layer");
        node.style.removeProperty("--scroll-parallax-x");
        node.style.removeProperty("--scroll-parallax-y");
        node.style.removeProperty("--scroll-parallax-scale");
      });
      sectionTargets.forEach((node) => node.style.removeProperty("--sp"));
    };
  }, [location.pathname]);

  return <div className="scroll-progress" aria-hidden="true" />;
};

export default ScrollExperience;
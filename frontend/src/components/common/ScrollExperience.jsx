import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const REVEAL_SELECTOR = [
  "main > section",
  "main .section-header",
  "main .card",
  "main .auth-split-wrapper > div",
  ".video-learning-page .video-learning-container",
].join(",");

const PARALLAX_LAYERS = [
  { selector: ".animate-aurora", factor: -0.12, limit: 64, xFactor: 0.025, xLimit: 24, scale: 0.035 },
  { selector: ".home-page .hero-section-wrapper > .hero-content", factor: 0.055, limit: 36, xFactor: 0.015, xLimit: 14, scale: 0.012 },
  { selector: ".home-page .hero-section-wrapper > :last-child", factor: -0.11, limit: 76, xFactor: -0.035, xLimit: 38, scale: 0.03 },
  { selector: "main .card img", factor: -0.035, limit: 22, xFactor: 0.006, xLimit: 8, scale: 0.018 },
  { selector: ".auth-banner-side > div", factor: 0.045, limit: 22, xFactor: 0.012, xLimit: 10, scale: 0.01 },
];

const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));

const ScrollExperience = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = new Set();
    const parallaxTargets = new Map();
    const revealObserver = !reducedMotion && "IntersectionObserver" in window
      ? new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("scroll-motion-visible");
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" })
      : null;

    const addRevealTarget = (node) => {
      if (!(node instanceof Element) || revealTargets.has(node)) return;
      revealTargets.add(node);
      node.classList.add("scroll-motion-target");
      node.style.setProperty("--scroll-motion-delay", `${(revealTargets.size % 5) * 65}ms`);
      if (revealObserver) {
        revealObserver.observe(node);
      } else {
        node.classList.add("scroll-motion-visible");
      }
    };

    const addParallaxTarget = (node, layer) => {
      if (node instanceof Element && !parallaxTargets.has(node)) {
        parallaxTargets.set(node, { ...layer, currentX: 0, currentY: 0, currentScale: 1 });
        node.classList.add("scroll-parallax-layer");
      }
    };

    const scan = (root) => {
      if (!(root instanceof Element || root instanceof Document)) return;
      if (root instanceof Element && root.matches(REVEAL_SELECTOR)) addRevealTarget(root);
      root.querySelectorAll(REVEAL_SELECTOR).forEach(addRevealTarget);

      PARALLAX_LAYERS.forEach((layer) => {
        if (root instanceof Element && root.matches(layer.selector)) addParallaxTarget(root, layer);
        root.querySelectorAll(layer.selector).forEach((node) => addParallaxTarget(node, layer));
      });
    };

    scan(document);

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach(scan));
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    let animationFrame = null;
    const updateParallax = () => {
      animationFrame = null;
      const viewportCenter = window.innerHeight / 2;
      const motionScale = window.innerWidth <= 768 ? 0.6 : 1;
      let stillEasing = false;
      parallaxTargets.forEach((layer, node) => {
        const bounds = node.getBoundingClientRect();
        const layerCenter = bounds.top + bounds.height / 2;
        const distance = viewportCenter - layerCenter;
        const targetX = clamp(distance * layer.xFactor * motionScale, layer.xLimit);
        const targetY = clamp(distance * layer.factor * motionScale, layer.limit);
        const depth = window.innerHeight ? distance / window.innerHeight : 0;
        const targetScale = 1 + clamp(depth * layer.scale * motionScale, layer.scale);
        const ease = (current, target) => {
          const next = current + (target - current) * 0.16;
          return Math.abs(target - next) < 0.08 ? target : next;
        };

        layer.currentX = ease(layer.currentX, targetX);
        layer.currentY = ease(layer.currentY, targetY);
        layer.currentScale = ease(layer.currentScale, targetScale);
        node.style.setProperty("--scroll-parallax-x", `${layer.currentX.toFixed(1)}px`);
        node.style.setProperty("--scroll-parallax-y", `${layer.currentY.toFixed(1)}px`);
        node.style.setProperty("--scroll-parallax-scale", layer.currentScale.toFixed(3));
        stillEasing ||= layer.currentX !== targetX || layer.currentY !== targetY || layer.currentScale !== targetScale;
      });
      if (stillEasing) animationFrame = window.requestAnimationFrame(updateParallax);
    };

    const scheduleParallaxUpdate = () => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(updateParallax);
    };

    if (!reducedMotion && parallaxTargets.size > 0) {
      scheduleParallaxUpdate();
      window.addEventListener("scroll", scheduleParallaxUpdate, { passive: true });
      window.addEventListener("resize", scheduleParallaxUpdate);
    }

    return () => {
      revealObserver?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("scroll", scheduleParallaxUpdate);
      window.removeEventListener("resize", scheduleParallaxUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
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
    };
  }, [location.pathname]);

  return null;
};

export default ScrollExperience;

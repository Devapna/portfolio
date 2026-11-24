import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  ExternalLink,
  MousePointer2,
  Sparkles,
  Code2,
  Film,
  Clapperboard,
  Cpu,
  Database,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Youtube,
  Check,
  Copy,
  ArrowUp,
  ArrowUpRight,
  Send,
  Menu,
  X,
  Palette,
  Lock,
  Unlock,
  GraduationCap,
  Award,
  Globe,
  Briefcase,
  Calendar,
  Layers,
  Play,
} from 'lucide-react';

// ============================================================================
// Utilities & Neon Color Helpers
// ============================================================================

/**
 * Utility for conditionally joining Tailwind CSS class names.
 */
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Converts HSL (h: 0-360, s: 0-100, l: 0-100) to a 6-digit hex color string.
 */
function hslToHex(h, s, l) {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = (val) =>
    Math.round((val + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generates an array of vibrant, high-saturation neon hex colors with well-spaced hues
 * so randomized palettes always look electric and never muddy or dark.
 */
function generateVibrantNeonPalette(count) {
  const baseHue = Math.random() * 360;
  const step = 360 / count;
  return new Array(count).fill(0).map((_, idx) => {
    const jitter = (Math.random() - 0.5) * (step * 0.45);
    const hue = (baseHue + idx * step + jitter + 360) % 360;
    const saturation = 88 + Math.random() * 12; // 88% - 100%
    const lightness = 54 + Math.random() * 10; // 54% - 64%
    return hslToHex(hue, saturation, lightness);
  });
}

/**
 * Parses a hex color string (#rrggbb) into an [r, g, b] tuple.
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// ============================================================================
// Portfolio Constants & Real Resume Data
// ============================================================================

const DEFAULT_TUBE_COLORS = ['#f967fb', '#53bc28', '#6958d5'];
const DEFAULT_LIGHT_COLORS = ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'];

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const YOUTUBE_CHANNELS = [
  {
    handle: '@devbro.creator',
    label: 'AI Films & Creative',
    url: 'https://www.youtube.com/@devbro.creator',
  },
  {
    handle: '@redacteddocumentary',
    label: 'Documentaries',
    url: 'https://www.youtube.com/@redacteddocumentary',
  },
  {
    handle: '@radhasoamisimran',
    label: 'Spiritual & Community',
    url: 'https://www.youtube.com/@radhasoamisimran',
  },
];

const KEY_METRICS = [
  {
    value: '6+ Years',
    label: 'Experience in Video Editing, Cinematography & Post-Production',
    icon: Film,
  },
  {
    value: '500+',
    label: 'Content Pieces Across Social Media, Videos, Shorts & Stories',
    icon: Layers,
  },
  {
    value: '3',
    label: 'YouTube Channels (@devbro.creator, @redacteddocumentary, @radhasoamisimran)',
    icon: Youtube,
  },
  {
    value: 'MCA',
    label: 'Pursuing at Sikkim Manipal University (Expected Sept 2027)',
    icon: GraduationCap,
  },
];

const CERTIFICATIONS = [
  'Advanced Communication Skills',
  'Data Science for Business',
  'AI-related learning & practical exploration',
];

const LANGUAGES = [
  { name: 'Hindi', level: 'Native' },
  { name: 'Bhojpuri', level: 'Fluent' },
  { name: 'English', level: 'Working Proficiency' },
];

const CORE_STRENGTHS = [
  'Problem Solving',
  'Analytical Thinking',
  'Creative Direction',
  'Research',
  'Public Speaking',
  'Communication',
  'Leadership',
  'Fast Learning',
];

const EXPERIENCES = [
  {
    role: 'Freelance Video Editor & Videographer',
    organization: 'Independent Paid Projects',
    period: '2020 – Present',
    badge: '6 Years Practical Experience',
    highlights: [
      'Edit wedding films, cinematic highlights and event videos; handle camera operations, lighting and on-location video shooting.',
      'Create documentary videos involving research, scripting, storytelling and editing.',
      'Independently manage production from raw footage to final delivery, performing colour correction, transitions, audio synchronization and visual effects.',
      'Create YouTube videos, high-CTR thumbnails and social media content.',
    ],
  },
  {
    role: 'Volunteer Video Editor & Digital Content Creator',
    organization: 'Radha Soami Satsang Beas (RSSB)',
    period: '2021 – Present',
    badge: 'Creative Direction & Publishing',
    highlights: [
      'Voluntarily contribute to video production and digital content creation; handle video shooting, editing, creative direction and publishing.',
      'Create documentary, spiritual and informational content and design thumbnails and supporting digital creatives.',
    ],
  },
  {
    role: 'Digital Community Manager',
    organization: 'Satsang Vihar & Radha Soami',
    period: '2021 – Present',
    badge: '500+ Content Pieces Created',
    highlights: [
      'Managed and developed multi-platform digital communities; created 500+ social media posts, videos, shorts and stories.',
      'Handled audience queries, feedback and digital communication; collaborated with voice artists, editors and content creators.',
      'Designed thumbnails and optimized YouTube content using SEO.',
    ],
  },
];

const SKILL_GROUPS = [
  {
    title: 'Video & Creative Production',
    subtitle: 'Filmmaking, Editing & Post',
    icon: Clapperboard,
    skills: [
      'Adobe Premiere Pro',
      'After Effects',
      'Photoshop',
      'CapCut',
      'VN Editor',
      'InShot',
      'Motion Graphics',
      'Video Editing',
      'Colour Grading',
      'Cinematography',
      'Camera Handling',
      'Documentary Filmmaking',
    ],
  },
  {
    title: 'Design & AI Workflows',
    subtitle: 'Visual Systems & Generative AI',
    icon: Cpu,
    skills: [
      'UI/UX Design',
      'Graphic Design',
      'AI-Assisted Content Creation',
      'Generative AI',
      'Prompt Engineering',
    ],
  },
  {
    title: 'Programming & Web Development',
    subtitle: 'Full-Stack Engineering',
    icon: Code2,
    skills: [
      'Java',
      'Python',
      'JavaScript',
      'React.js',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Node.js',
    ],
  },
  {
    title: 'Database, Tools & Platforms',
    subtitle: 'Data, APIs & Distribution',
    icon: Database,
    skills: [
      'SQL',
      'MongoDB',
      'GitHub',
      'REST APIs',
      'YouTube Studio',
      'Instagram',
      'Facebook',
      'Telegram',
      'Canva',
    ],
  },
];

const PROJECT_FILTERS = ['All', 'Creative & AI', 'Tech & Web'];

const PROJECTS = [
  {
    title: 'Dreams Between Two Worlds',
    subtitle: 'AI Film Series • @devbro.creator',
    categories: ['Creative & AI'],
    badge: 'AI Film & VFX',
    description:
      'Directed, edited and composited Episode 01 ("The First Dream") with custom bioluminescent VFX and colour grading.',
    tags: ['AI Filmmaking', 'After Effects', 'Bioluminescent VFX', 'Colour Grading', 'Premiere Pro'],
    link: 'https://www.youtube.com/@devbro.creator',
    linkLabel: 'Watch on @devbro.creator',
    featured: true,
  },
  {
    title: 'InvAssist PRO',
    subtitle: 'Web Application',
    categories: ['Tech & Web'],
    badge: 'Web App',
    description:
      'Inventory and billing web application built with modern responsive UI for streamlined stock tracking and invoicing.',
    tags: ['React.js', 'JavaScript', 'Tailwind CSS', 'Responsive UI', 'Billing'],
  },
  {
    title: 'AI Trading Scanner & Alert Platform',
    subtitle: 'AI & FinTech Concept',
    categories: ['Creative & AI', 'Tech & Web'],
    badge: 'AI & FinTech',
    description:
      'Market analysis and real-time alert generation concept combining automated scanning logic with actionable trading signals.',
    tags: ['AI Workflows', 'Python', 'REST APIs', 'Market Analysis', 'Real-Time Alerts'],
  },
  {
    title: 'Arghya-Praswasti Record System',
    subtitle: 'Data Management Concept',
    categories: ['Tech & Web'],
    badge: 'Data Management',
    description:
      'Digital record management concept engineered with structured data handling for organized archival and quick retrieval.',
    tags: ['SQL', 'MongoDB', 'Structured Data', 'Node.js', 'System Design'],
  },
  {
    title: 'AR Realm',
    subtitle: 'Augmented Reality Game Concept',
    categories: ['Creative & AI', 'Tech & Web'],
    badge: 'Game Concept',
    description:
      'Endless multiplayer augmented reality game concept blending real-world spatial immersion with interactive game mechanics.',
    tags: ['Augmented Reality', 'Multiplayer', 'Creative Direction', 'UI/UX Design'],
  },
];

// ============================================================================
// Self-Contained 60fps 3D Neon Tubes Canvas Engine (<TubesBackground />)
// ============================================================================

/**
 * High-performance, zero-dependency HTML5 Canvas 3D Neon Tubes background.
 * Renders 5 intertwined 3D-projected glowing neon tubes with spring physics,
 * smooth organic idle Lissajous motion, multi-pass additive lighting, and
 * glossy 3D cylindrical specular highlights.
 */
function TubesBackground({
  children,
  className,
  tubeColors = DEFAULT_TUBE_COLORS,
  lightColors = DEFAULT_LIGHT_COLORS,
  enableClickInteraction = true,
  onRandomize,
}) {
  const canvasRef = useRef(null);

  // Store target RGB colors in refs so color changes morph smoothly at 60fps without restarting the loop
  const targetTubeRgbRef = useRef(tubeColors.map(hexToRgb));
  const targetLightRgbRef = useRef(lightColors.map(hexToRgb));

  useEffect(() => {
    targetTubeRgbRef.current = tubeColors.map(hexToRgb);
  }, [tubeColors]);

  useEffect(() => {
    targetLightRgbRef.current = lightColors.map(hexToRgb);
  }, [lightColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId = null;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Current interpolated RGB arrays for smooth color transitions
    const currentTubeRgb = targetTubeRgbRef.current.map((rgb) => [...rgb]);
    const currentLightRgb = targetLightRgbRef.current.map((rgb) => [...rgb]);

    // 3D pointer & idle state (starts in active organic idle motion immediately on load)
    const pointer = {
      x: 0,
      y: 0,
      lastMoveTime: 0, // 0 => immediately alive with organic 3D swirl on mount
      hasInteracted: false,
      idleBlend: 1,
    };

    const updatePointerFromClient = (clientX, clientY) => {
      pointer.x = clientX - width * 0.5;
      pointer.y = clientY - height * 0.5;
      pointer.lastMoveTime = performance.now();
      pointer.hasInteracted = true;
    };

    const handlePointerMove = (e) => {
      updatePointerFromClient(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        updatePointerFromClient(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Configure 5 intertwined 3D neon tubes
    const TUBE_COUNT = 5;
    const POINTS_PER_TUBE = 42;
    const FOV = 540;

    const tubes = Array.from({ length: TUBE_COUNT }, (_, i) => {
      const angle = (i / TUBE_COUNT) * Math.PI * 2;
      const points = Array.from({ length: POINTS_PER_TUBE }, (_, j) => ({
        x: Math.cos(angle + j * 0.14) * (40 + j * 3),
        y: Math.sin(angle + j * 0.14) * (30 + j * 2.5),
        z: Math.sin(angle + j * 0.2) * 80,
        vx: 0,
        vy: 0,
        vz: 0,
      }));

      return {
        points,
        colorIdx: i % 3,
        lightIdx: i % 4,
        phase: angle,
        orbitSpeed: 1.55 + i * 0.22,
        orbitRadius: 24 + (i % 3) * 14,
        zAmplitude: 95 + (i % 2) * 45,
        headSpring: 0.085 + i * 0.008,
        headDamping: 0.78 - i * 0.012,
        followRate: 0.36 - i * 0.018,
        baseWidth: 11.5 - i * 0.85,
      };
    });

    // Reusable projected points array to avoid per-frame GC allocations
    const projected = Array.from({ length: POINTS_PER_TUBE }, () => ({
      x: 0,
      y: 0,
      scale: 1,
    }));

    /**
     * Draws a smooth quadratic spline chunk between indices [startIdx, endIdx]
     * using midpoint interpolation for silky curves.
     */
    const traceSplineChunk = (pts, startIdx, endIdx, offsetX = 0, offsetY = 0) => {
      ctx.beginPath();
      const first = pts[startIdx];
      ctx.moveTo(first.x + offsetX, first.y + offsetY);

      for (let k = startIdx + 1; k < endIdx; k++) {
        const curr = pts[k];
        const next = pts[k + 1];
        const midX = (curr.x + next.x) * 0.5 + offsetX;
        const midY = (curr.y + next.y) * 0.5 + offsetY;
        ctx.quadraticCurveTo(curr.x + offsetX, curr.y + offsetY, midX, midY);
      }

      const last = pts[endIdx];
      ctx.lineTo(last.x + offsetX, last.y + offsetY);
    };

    const CHUNKS = 7;
    const startTime = performance.now();

    const animate = (now) => {
      const t = (now - startTime) * 0.001;

      // Smoothly morph current RGB colors toward target palette
      for (let i = 0; i < 3; i++) {
        const target = targetTubeRgbRef.current[i] || [249, 103, 251];
        for (let c = 0; c < 3; c++) {
          currentTubeRgb[i][c] += (target[c] - currentTubeRgb[i][c]) * 0.08;
        }
      }
      for (let i = 0; i < 4; i++) {
        const target = targetLightRgbRef.current[i] || [131, 243, 110];
        for (let c = 0; c < 3; c++) {
          currentLightRgb[i][c] += (target[c] - currentLightRgb[i][c]) * 0.08;
        }
      }

      // Determine idle blend: smooth organic 3D figure-8 swirl on load or after >2s stationary
      const timeSinceMove = now - pointer.lastMoveTime;
      const shouldIdle = !pointer.hasInteracted || timeSinceMove > 2000;
      const targetIdle = shouldIdle ? 1 : 0;
      pointer.idleBlend += (targetIdle - pointer.idleBlend) * (shouldIdle ? 0.025 : 0.12);

      // Compute organic 3D Lissajous / figure-8 idle target
      const rx = Math.min(width * 0.28, 360);
      const ry = Math.min(height * 0.24, 220);
      const idleX = Math.sin(t * 0.78) * rx + Math.cos(t * 0.39) * (rx * 0.32);
      const idleY = Math.sin(t * 1.24) * ry * 0.8 + Math.sin(t * 0.52) * (ry * 0.22);
      const idleZ = Math.cos(t * 0.92) * 125;

      // Blended 3D lead target
      const leadX = pointer.x * (1 - pointer.idleBlend) + idleX * pointer.idleBlend;
      const leadY = pointer.y * (1 - pointer.idleBlend) + idleY * pointer.idleBlend;
      const leadZ = idleZ * pointer.idleBlend + Math.sin(t * 1.4) * 55 * (1 - pointer.idleBlend);

      // Clear frame with deep obsidian backdrop
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Switch to additive neon lighting mode
      ctx.globalCompositeOperation = 'lighter';

      // ------------------------------------------------------------------
      // 1. Dynamic Ambient Light Blooms trailing near the cursor / swirl
      // ------------------------------------------------------------------
      const halfW = width * 0.5;
      const halfH = height * 0.5;

      for (let i = 0; i < 4; i++) {
        const [lr, lg, lb] = currentLightRgb[i];
        const orbitAngle = t * (0.65 + i * 0.18) + i * (Math.PI * 0.5);
        const offsetDist = 70 + i * 38;
        const bx = halfW + leadX * 0.85 + Math.cos(orbitAngle) * offsetDist;
        const by = halfH + leadY * 0.85 + Math.sin(orbitAngle * 1.15) * (offsetDist * 0.72);
        const radius = Math.min(width, height) * (0.28 + (i % 2) * 0.09);

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, radius);
        grad.addColorStop(0, `rgba(${lr | 0}, ${lg | 0}, ${lb | 0}, 0.15)`);
        grad.addColorStop(0.45, `rgba(${lr | 0}, ${lg | 0}, ${lb | 0}, 0.05)`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(bx - radius, by - radius, radius * 2, radius * 2);
      }

      // ------------------------------------------------------------------
      // 2. Update 3D Spring Physics & Multi-Pass Render Each Neon Tube
      // ------------------------------------------------------------------
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let i = 0; i < TUBE_COUNT; i++) {
        const tube = tubes[i];
        const pts = tube.points;

        // Helical offset around the lead target so the 5 tubes braid in 3D
        const helixAngle = t * tube.orbitSpeed + tube.phase;
        const targetX = leadX + Math.cos(helixAngle) * tube.orbitRadius;
        const targetY = leadY + Math.sin(helixAngle * 1.12) * (tube.orbitRadius * 0.85);
        const targetZ = leadZ + Math.sin(helixAngle * 0.85) * tube.zAmplitude;

        // Head spring-damper physics
        const head = pts[0];
        head.vx = (head.vx + (targetX - head.x) * tube.headSpring) * tube.headDamping;
        head.vy = (head.vy + (targetY - head.y) * tube.headSpring) * tube.headDamping;
        head.vz = (head.vz + (targetZ - head.z) * tube.headSpring) * tube.headDamping;
        head.x += head.vx;
        head.y += head.vy;
        head.z += head.vz;

        // Trailing control points follow with organic 3D wave undulation
        for (let j = 1; j < POINTS_PER_TUBE; j++) {
          const prev = pts[j - 1];
          const curr = pts[j];
          const waveFactor = (j / POINTS_PER_TUBE) * 1.35;
          const swirlX = Math.cos(t * 2.1 - j * 0.24 + tube.phase) * waveFactor;
          const swirlY = Math.sin(t * 1.85 - j * 0.22 + tube.phase) * waveFactor;
          const swirlZ = Math.cos(t * 1.6 - j * 0.2 + tube.phase) * (waveFactor * 1.8);

          curr.x += (prev.x - curr.x) * tube.followRate + swirlX;
          curr.y += (prev.y - curr.y) * tube.followRate + swirlY;
          curr.z += (prev.z - curr.z) * tube.followRate + swirlZ;
        }

        // Perspective projection from 3D space to 2D canvas
        for (let j = 0; j < POINTS_PER_TUBE; j++) {
          const p = pts[j];
          const clampedZ = Math.max(-FOV * 0.55, Math.min(FOV * 1.2, p.z));
          const scale = FOV / (FOV + clampedZ);
          projected[j].x = halfW + p.x * scale;
          projected[j].y = halfH + p.y * scale;
          projected[j].scale = scale;
        }

        const [tr, tg, tb] = currentTubeRgb[tube.colorIdx];
        const [lr, lg, lb] = currentLightRgb[tube.lightIdx];
        const tubeColorStr = `${tr | 0}, ${tg | 0}, ${tb | 0}`;
        const lightColorStr = `${lr | 0}, ${lg | 0}, ${lb | 0}`;

        // Render tapered chunks from tail to head so the glowing head sits in front
        for (let c = CHUNKS - 1; c >= 0; c--) {
          const startIdx = Math.floor((c / CHUNKS) * (POINTS_PER_TUBE - 1));
          const endIdx = Math.min(
            POINTS_PER_TUBE - 1,
            Math.floor(((c + 1) / CHUNKS) * (POINTS_PER_TUBE - 1)) + 1
          );
          if (endIdx <= startIdx) continue;

          // Taper factor: 1.0 at head -> 0.14 at tail
          const progress = (c + 0.5) / CHUNKS;
          const taper = Math.pow(1 - progress, 0.72) * 0.88 + 0.12;
          const avgScale = projected[Math.floor((startIdx + endIdx) * 0.5)].scale;
          const coreWidth = Math.max(1.4, tube.baseWidth * taper * avgScale);
          const tailFade = 0.25 + 0.75 * (1 - progress * 0.85);

          // Pass 1: Wide ambient radial/stroke light glow using active light colors
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(${lightColorStr}, ${(0.11 * tailFade).toFixed(3)})`;
          ctx.lineWidth = coreWidth * 4.4;
          traceSplineChunk(projected, startIdx, endIdx);
          ctx.stroke();

          // Pass 2: Thick vibrant neon outer bloom with shadowBlur
          ctx.shadowColor = `rgba(${tubeColorStr}, 0.85)`;
          ctx.shadowBlur = 22 * avgScale;
          ctx.strokeStyle = `rgba(${tubeColorStr}, ${(0.38 * tailFade).toFixed(3)})`;
          ctx.lineWidth = coreWidth * 2.15;
          traceSplineChunk(projected, startIdx, endIdx);
          ctx.stroke();

          // Pass 3: Saturated metallic neon core
          ctx.shadowBlur = 8 * avgScale;
          ctx.strokeStyle = `rgba(${tubeColorStr}, ${(0.92 * tailFade).toFixed(3)})`;
          ctx.lineWidth = coreWidth;
          traceSplineChunk(projected, startIdx, endIdx);
          ctx.stroke();

          // Pass 4: Crisp bright white-tinted specular highlight ridge for 3D glossy depth
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(255, 255, 255, ${(0.88 * tailFade).toFixed(3)})`;
          ctx.lineWidth = Math.max(0.8, coreWidth * 0.28);
          traceSplineChunk(
            projected,
            startIdx,
            endIdx,
            -coreWidth * 0.14,
            -coreWidth * 0.14
          );
          ctx.stroke();
        }
      }

      // Reset shadow state before next frame
      ctx.shadowBlur = 0;
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animationFrameId = window.requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleBackgroundClick = () => {
    if (!enableClickInteraction) return;
    if (onRandomize) onRandomize();
  };

  return (
    <div
      className={cn(
        'relative min-h-screen w-full bg-[#050508] text-white selection:bg-fuchsia-500/30 selection:text-white overflow-x-hidden',
        className
      )}
      onClick={handleBackgroundClick}
    >
      {/* Fixed Full-Viewport 60fps 3D Neon Tubes Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 w-full h-full block z-0 pointer-events-none"
      />

      {/* Subtle atmospheric vignette for high-contrast typography without muting neon */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[1] pointer-events-none bg-gradient-to-b from-black/25 via-transparent to-black/50"
      />

      {/* Scrollable Transparent Glassmorphic Foreground */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

// ============================================================================
// Main Portfolio Application
// ============================================================================

export default function App() {
  const toastTimerRef = useRef(null);

  const [enableClickRandomize, setEnableClickRandomize] = useState(true);
  const [activeTubeColors, setActiveTubeColors] = useState(DEFAULT_TUBE_COLORS);
  const [activeLightColors, setActiveLightColors] = useState(DEFAULT_LIGHT_COLORS);
  const [showPaletteToast, setShowPaletteToast] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Project filter state
  const [activeFilter, setActiveFilter] = useState('All');

  // Contact copy & form states
  const [copiedField, setCopiedField] = useState(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const CONTACT_EMAIL = 'riteshdeevseth@gmail.com';
  const CONTACT_PHONE = '+91-9341952305';
  const CONTACT_LOCATION = 'Ghaziabad, Uttar Pradesh, India';
  const LINKEDIN_URL = 'https://www.linkedin.com/in/ritesh-dev-69b37137a';

  /**
   * Instantly randomizes the 3 tube colors and 4 light colors using bright,
   * high-saturation HSL neon generation, syncing both the 3D canvas and UI accents.
   */
  const randomizeNeon = useCallback(() => {
    const nextTubeColors = generateVibrantNeonPalette(3);
    const nextLightColors = generateVibrantNeonPalette(4);

    setActiveTubeColors(nextTubeColors);
    setActiveLightColors(nextLightColors);
    setShowPaletteToast(true);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setShowPaletteToast(false);
    }, 3400);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  /**
   * Filtered projects list based on selected category pill.
   */
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return PROJECTS;
    return PROJECTS.filter((project) => project.categories.includes(activeFilter));
  }, [activeFilter]);

  /**
   * Smoothly scrolls to a section without triggering background randomization.
   */
  const scrollToSection = (e, href) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Copies text (email or phone) to clipboard with fallback support.
   */
  const handleCopy = async (e, fieldKey, value) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const tempInput = document.createElement('input');
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
    } catch {
      // Fallback still provides user feedback
    }
    setCopiedField(fieldKey);
    setTimeout(() => {
      setCopiedField((current) => (current === fieldKey ? null : current));
    }, 2200);
  };

  /**
   * Contact form submit handler with instant confirmation UI.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      return;
    }
    setFormSubmitted(true);
  };

  const resetForm = (e) => {
    e.stopPropagation();
    setFormState({ name: '', email: '', message: '' });
    setFormSubmitted(false);
  };

  const scrollToTop = (e) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <TubesBackground
      tubeColors={activeTubeColors}
      lightColors={activeLightColors}
      enableClickInteraction={enableClickRandomize}
      onRandomize={randomizeNeon}
    >
      {/* ====================================================================
          Floating Glassmorphic Navbar
      ==================================================================== */}
      <header
        onClick={(e) => e.stopPropagation()}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-6xl"
      >
        <nav
          className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-full bg-black/50 backdrop-blur-md border border-white/15 shadow-[0_10px_36px_rgba(0,0,0,0.65)] transition-shadow duration-500"
          style={{
            boxShadow: `0 10px 36px rgba(0,0,0,0.65), 0 0 24px ${activeTubeColors[0]}22`,
          }}
        >
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => scrollToSection(e, '#hero')}
            className="flex items-center gap-2.5 text-sm sm:text-base font-bold tracking-wider uppercase text-white"
          >
            <span
              className="w-2.5 h-2.5 rounded-full transition-colors duration-500"
              style={{
                backgroundColor: activeTubeColors[0],
                boxShadow: `0 0 12px ${activeTubeColors[0]}`,
              }}
            />
            <span className="tracking-tight">
              RITESH <span className="text-white/60">DEV</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-4 py-1.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Controls: Randomize Neon + Click Lock Toggle + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                randomizeNeon();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-white/10 hover:bg-white/20 border rounded-full transition-all duration-300 active:scale-95 cursor-pointer"
              style={{
                borderColor: `${activeTubeColors[0]}66`,
                boxShadow: `0 0 16px ${activeTubeColors[0]}28`,
              }}
              title="Randomize 3D neon tube & light colors"
            >
              <Sparkles
                className="w-3.5 h-3.5 transition-colors duration-500"
                style={{ color: activeTubeColors[0] }}
              />
              <span className="hidden sm:inline">Randomize Neon</span>
              <span className="sm:hidden">Neon</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEnableClickRandomize((prev) => !prev);
              }}
              className={cn(
                'p-2 rounded-full border transition-all duration-200 cursor-pointer',
                enableClickRandomize
                  ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  : 'bg-black/45 border-white/10 text-white/45 hover:text-white/80'
              )}
              title={
                enableClickRandomize
                  ? 'Background click-to-randomize: UNLOCKED (ON)'
                  : 'Background click-to-randomize: LOCKED (OFF)'
              }
              aria-label="Toggle background click to randomize colors"
            >
              {enableClickRandomize ? (
                <Unlock className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen((prev) => !prev);
              }}
              className="lg:hidden p-2 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 shadow-2xl flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="px-4 py-2.5 text-sm font-medium text-white/85 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ====================================================================
          Auto-Fading Hex Palette Toast
      ==================================================================== */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 shadow-2xl transition-all duration-300',
          showPaletteToast
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        )}
        role="status"
        aria-live="polite"
      >
        <Palette className="w-4 h-4 text-white/80 shrink-0" />
        <div className="flex items-center gap-2.5">
          {activeTubeColors.map((hex, idx) => (
            <div key={`${hex}-${idx}`} className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white/30"
                style={{
                  backgroundColor: hex,
                  boxShadow: `0 0 10px ${hex}`,
                }}
              />
              <span className="text-[11px] font-mono uppercase text-white/90 hidden sm:inline">
                {hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ====================================================================
          1. Full-Screen Hero Section
      ==================================================================== */}
      <section
        id="hero"
        className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-28 pb-24"
      >
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-5 sm:gap-6">
          {/* Location Badge */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border text-xs sm:text-sm text-white/90 shadow-lg transition-colors duration-500"
            style={{ borderColor: `${activeTubeColors[1]}55` }}
          >
            <MapPin
              className="w-3.5 h-3.5 shrink-0 transition-colors duration-500"
              style={{ color: activeTubeColors[1] }}
            />
            <span>Ghaziabad, Uttar Pradesh, India</span>
          </div>

          {/* Bold Uppercase Display Typography */}
          <div className="space-y-3 select-none">
            <h1
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-[0.95] transition-all duration-500"
              style={{
                textShadow: `0 4px 28px rgba(0,0,0,0.95), 0 0 42px ${activeTubeColors[0]}40`,
              }}
            >
              RITESH DEV
            </h1>
            <h2 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-semibold uppercase tracking-[0.14em] text-white/95 drop-shadow-[0_2px_20px_rgba(0,0,0,0.95)]">
              VIDEO EDITOR &bull; VIDEOGRAPHER &bull; DOCUMENTARY FILMMAKER
            </h2>
          </div>

          {/* Concise Intro */}
          <p className="text-white/85 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed drop-shadow-[0_2px_16px_rgba(0,0,0,0.95)]">
            6+ years crafting cinematic stories, documentary films, AI-assisted visual workflows, and modern full-stack web experiences.
          </p>

          {/* Primary CTA Buttons */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-2 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
          >
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, '#projects')}
              className="group flex items-center gap-2 px-7 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-md border rounded-full text-white font-semibold text-sm sm:text-base transition-all duration-300"
              style={{
                borderColor: `${activeTubeColors[0]}77`,
                boxShadow: `0 0 28px ${activeTubeColors[0]}33`,
              }}
            >
              <span>View Projects</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <a
              href="#contact"
              onClick={(e) => scrollToSection(e, '#contact')}
              className="group flex items-center gap-2 px-7 py-3.5 bg-black/45 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-white/95 font-semibold text-sm sm:text-base transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            >
              <Mail className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
              <span>Contact</span>
            </a>
          </div>

          {/* Quick YouTube Channel Pills */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-3 flex flex-wrap items-center justify-center gap-2.5"
          >
            {YOUTUBE_CHANNELS.map((channel) => (
              <a
                key={channel.handle}
                href={channel.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-white/85 hover:text-white transition-all duration-200"
              >
                <Youtube className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform" />
                <span>{channel.handle}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Pulsing Interactive Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/65 animate-pulse pointer-events-none select-none w-full px-4">
          <MousePointer2 className="w-5 h-5" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-center drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            Move cursor &bull; Click anywhere to randomize neon
          </span>
        </div>
      </section>

      {/* ====================================================================
          Main Scrollable Content Sections
      ==================================================================== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32 pb-24">
        {/* ==================================================================
            2. About, Metrics & Education Section
        ================================================================== */}
        <section id="about" className="scroll-mt-28 space-y-6">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-black/45 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                  <Film
                    className="w-4 h-4 transition-colors duration-500"
                    style={{ color: activeTubeColors[0] }}
                  />
                  <span>About Me</span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                  Visual storytelling meets technical craft.
                </h3>
              </div>
              <div className="text-xs uppercase tracking-widest text-white/55">
                End-to-End Production &amp; Digital Media
              </div>
            </div>

            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-4xl mb-10">
              Creative Video Editor, Videographer and Documentary Content Creator with 6 years of hands-on experience in video editing, cinematography, digital storytelling and content production. Experienced in independently managing end-to-end video production, including concept development, scripting, camera operations, editing, visual effects and publishing. Skilled in wedding cinematography, documentary creation, YouTube content and social media production. Combines creative storytelling with technical knowledge, AI-assisted workflows and digital media expertise.
            </p>

            {/* 4 Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {KEY_METRICS.map((metric, idx) => {
                const Icon = metric.icon;
                const accent = activeTubeColors[idx % activeTubeColors.length];
                return (
                  <div
                    key={metric.value}
                    className="group p-5 rounded-2xl bg-black/40 hover:bg-white/[0.08] border border-white/10 hover:border-white/25 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-2xl sm:text-3xl font-black tracking-tight text-white transition-all duration-500"
                        style={{
                          textShadow: `0 0 22px ${accent}77`,
                        }}
                      >
                        {metric.value}
                      </span>
                      <div
                        className="p-2 rounded-xl bg-white/10 border text-white/90 group-hover:scale-105 transition-transform"
                        style={{ borderColor: `${accent}55` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: accent }} />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                      {metric.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Education, Certifications, Languages & Core Strengths Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-black/45 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.55)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {/* Left: Education & Certifications */}
            <div className="space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                  <GraduationCap
                    className="w-5 h-5 transition-colors duration-500"
                    style={{ color: activeTubeColors[1] }}
                  />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white">
                  Education &amp; Certifications
                </h4>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/35 border border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h5 className="font-semibold text-white">
                      Master of Computer Applications (MCA)
                    </h5>
                    <span
                      className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/10 border text-white/90"
                      style={{ borderColor: `${activeTubeColors[0]}55` }}
                    >
                      Pursuing &bull; Exp. Sept 2027
                    </span>
                  </div>
                  <p className="text-sm text-white/70">Sikkim Manipal University</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/35 border border-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h5 className="font-semibold text-white">
                      B.A. Political Science
                    </h5>
                    <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-white/80">
                      Graduate
                    </span>
                  </div>
                  <p className="text-sm text-white/70">Nalanda College, Bihar Sharif</p>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/65">
                  <Award className="w-4 h-4" />
                  <span>Certifications</span>
                </div>
                <ul className="space-y-2">
                  {CERTIFICATIONS.map((cert) => (
                    <li
                      key={cert}
                      className="flex items-start gap-2.5 text-sm text-white/85"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500"
                        style={{
                          backgroundColor: activeTubeColors[1],
                          boxShadow: `0 0 8px ${activeTubeColors[1]}`,
                        }}
                      />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Languages & Core Strengths */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                    <Globe
                      className="w-5 h-5 transition-colors duration-500"
                      style={{ color: activeTubeColors[2] }}
                    />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-white">Languages</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {LANGUAGES.map((lang) => (
                    <div
                      key={lang.name}
                      className="p-3.5 rounded-2xl bg-black/35 border border-white/10"
                    >
                      <p className="font-semibold text-white text-sm">{lang.name}</p>
                      <p className="text-xs text-white/65 mt-0.5">{lang.level}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/65">
                  <Sparkles className="w-4 h-4" />
                  <span>Core Strengths</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CORE_STRENGTHS.map((strength) => (
                    <span
                      key={strength}
                      className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/90 bg-white/[0.07] hover:bg-white/15 border border-white/15 rounded-full transition-colors duration-200"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            3. Professional Experience Section
        ================================================================== */}
        <section id="experience" className="scroll-mt-28">
          <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 drop-shadow">
                <Briefcase
                  className="w-4 h-4 transition-colors duration-500"
                  style={{ color: activeTubeColors[2] }}
                />
                <span>Career Journey</span>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
                Professional Experience
              </h3>
            </div>
            <p className="text-sm sm:text-base text-white/80 max-w-md drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              6 years of independent production, community growth, and documentary filmmaking.
            </p>
          </div>

          {/* Interactive Timeline */}
          <div className="relative space-y-6 before:hidden md:before:block before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-gradient-to-b before:from-white/35 before:via-white/15 before:to-transparent">
            {EXPERIENCES.map((exp, idx) => {
              const accent = activeTubeColors[idx % activeTubeColors.length];
              return (
                <div
                  key={exp.role}
                  onClick={(e) => e.stopPropagation()}
                  className="relative md:pl-16"
                >
                  {/* Glowing Neon Timeline Dot */}
                  <span
                    className="hidden md:flex absolute left-[18px] top-8 w-3.5 h-3.5 rounded-full border-2 border-[#050508] transition-all duration-500"
                    style={{
                      backgroundColor: accent,
                      boxShadow: `0 0 16px ${accent}`,
                    }}
                  />

                  <article className="group bg-black/45 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-3xl p-6 sm:p-8 shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
                      <div>
                        <h4 className="text-xl sm:text-2xl font-bold text-white">
                          {exp.role}
                        </h4>
                        <p className="text-sm sm:text-base text-white/75 mt-0.5">
                          {exp.organization}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border text-xs font-medium text-white/95"
                          style={{ borderColor: `${accent}55` }}
                        >
                          <Calendar className="w-3.5 h-3.5" style={{ color: accent }} />
                          {exp.period}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-white/80">
                          {exp.badge}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {exp.highlights.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-sm sm:text-base text-white/85 leading-relaxed"
                        >
                          <span
                            className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-500"
                            style={{
                              backgroundColor: accent,
                              boxShadow: `0 0 8px ${accent}`,
                            }}
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================================================================
            4. Technical & Creative Skills Section (4 Categories)
        ================================================================== */}
        <section id="skills" className="scroll-mt-28">
          <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 drop-shadow">
                Capabilities
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
                Technical &amp; Creative Skills
              </h3>
            </div>
            <p className="text-sm sm:text-base text-white/80 max-w-md drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Bridging cinema-grade post-production, generative AI workflows, and modern full-stack software development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKILL_GROUPS.map((group, idx) => {
              const Icon = group.icon;
              const accent = activeTubeColors[idx % activeTubeColors.length];
              return (
                <div
                  key={group.title}
                  onClick={(e) => e.stopPropagation()}
                  className="relative overflow-hidden bg-black/45 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-3xl p-6 sm:p-8 shadow-[0_16px_48px_rgba(0,0,0,0.55)] transition-all duration-300"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-80 transition-all duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                    }}
                  />

                  <div className="flex items-center gap-3.5 mb-6">
                    <div
                      className="p-2.5 rounded-xl bg-white/10 border text-white"
                      style={{ borderColor: `${accent}55` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold text-white">
                        {group.title}
                      </h4>
                      <p className="text-xs text-white/60">{group.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/90 bg-white/[0.07] hover:bg-white/15 border border-white/15 rounded-full transition-colors duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================================================================
            5. Filterable Projects Section
        ================================================================== */}
        <section id="projects" className="scroll-mt-28">
          <div className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 drop-shadow">
                Portfolio Showcase
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
                Selected Projects
              </h3>
            </div>

            {/* Filter Pills */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="inline-flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 self-start md:self-auto"
            >
              {PROJECT_FILTERS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFilter(filter);
                    }}
                    className={cn(
                      'px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer',
                      isActive
                        ? 'bg-white text-black shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => {
              const accent = activeTubeColors[index % activeTubeColors.length];
              return (
                <article
                  key={project.title}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    'group relative bg-black/45 backdrop-blur-md border border-white/10 hover:border-white/25 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.55)] transition-all duration-300 flex flex-col justify-between overflow-hidden',
                    project.featured && activeFilter === 'All' && 'md:col-span-2'
                  )}
                >
                  {/* Dynamic Neon Accent Top Border */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                    }}
                  />

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span
                        className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-white/10 border text-white/95"
                        style={{ borderColor: `${accent}55` }}
                      >
                        {project.badge}
                      </span>
                      <span className="text-xs font-mono text-white/55">
                        {project.subtitle}
                      </span>
                    </div>

                    <h4 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      {project.title}
                    </h4>

                    <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-3xl">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-xs font-medium text-white/85 bg-white/[0.07] border border-white/10 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.link && (
                    <div className="pt-4 border-t border-white/10 flex items-center">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-white/15 hover:bg-white/25 border rounded-full transition-all duration-200"
                        style={{
                          borderColor: `${accent}66`,
                          boxShadow: `0 0 18px ${accent}25`,
                        }}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" style={{ color: accent }} />
                        <span>{project.linkLabel}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* ==================================================================
            6. Contact Section
        ================================================================== */}
        <section id="contact" className="scroll-mt-28">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-black/45 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_24px_64px_rgba(0,0,0,0.6)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
              {/* Left Column: Direct Details & Socials */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                    Get in Touch
                  </span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                    Let&apos;s collaborate on your next project.
                  </h3>
                  <p className="text-white/80 text-base leading-relaxed">
                    Available for video editing, documentary production, cinematography, AI-assisted content workflows, and web development projects.
                  </p>
                </div>

                {/* Direct Contact Cards with One-Click Copy */}
                <div className="space-y-3">
                  {/* Email */}
                  <div className="p-4 rounded-2xl bg-black/35 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                        <Mail className="w-4 h-4" style={{ color: activeTubeColors[0] }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wider text-white/55">Email</p>
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="text-sm sm:text-base font-medium text-white hover:underline truncate block"
                        >
                          {CONTACT_EMAIL}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, 'email', CONTACT_EMAIL)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-all shrink-0 cursor-pointer"
                    >
                      {copiedField === 'email' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Phone */}
                  <div className="p-4 rounded-2xl bg-black/35 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                        <Phone className="w-4 h-4" style={{ color: activeTubeColors[1] }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] uppercase tracking-wider text-white/55">Phone</p>
                        <a
                          href={`tel:${CONTACT_PHONE}`}
                          className="text-sm sm:text-base font-medium text-white hover:underline block"
                        >
                          {CONTACT_PHONE}
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, 'phone', CONTACT_PHONE)}
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-all shrink-0 cursor-pointer"
                    >
                      {copiedField === 'phone' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Location */}
                  <div className="p-4 rounded-2xl bg-black/35 border border-white/15 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                      <MapPin className="w-4 h-4" style={{ color: activeTubeColors[2] }} />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-white/55">Location</p>
                      <p className="text-sm sm:text-base font-medium text-white">
                        {CONTACT_LOCATION}
                      </p>
                    </div>
                  </div>
                </div>

                {/* LinkedIn & YouTube Channel Links */}
                <div className="pt-1 space-y-3">
                  <p className="text-xs uppercase tracking-widest text-white/55">
                    Social &amp; Channels
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href={LINKEDIN_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <Linkedin className="w-4 h-4 text-sky-400" />
                      <span>LinkedIn</span>
                    </a>

                    {YOUTUBE_CHANNELS.map((channel) => (
                      <a
                        key={channel.handle}
                        href={channel.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs sm:text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <Youtube className="w-4 h-4 text-red-400" />
                        <span>{channel.handle}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Contact Form */}
              <div className="p-6 sm:p-7 rounded-2xl bg-black/35 border border-white/10">
                {formSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                      <Check className="w-7 h-7" />
                    </div>
                    <h4 className="text-2xl font-bold text-white">Message Sent!</h4>
                    <p className="text-sm text-white/80 max-w-sm mx-auto">
                      Thank you for reaching out, {formState.name}. Your message has been received and Ritesh will get back to you soon.
                    </p>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="mt-2 px-5 py-2.5 text-sm font-medium rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium uppercase tracking-wider text-white/75 mb-1.5"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-white/40 focus:outline-none text-white placeholder:text-white/40 text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium uppercase tracking-wider text-white/75 mb-1.5"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-white/40 focus:outline-none text-white placeholder:text-white/40 text-sm transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-xs font-medium uppercase tracking-wider text-white/75 mb-1.5"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        required
                        value={formState.message}
                        onChange={(e) =>
                          setFormState((prev) => ({ ...prev, message: e.target.value }))
                        }
                        placeholder="Tell me about your video, documentary, or web project..."
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 focus:border-white/40 focus:outline-none text-white placeholder:text-white/40 text-sm resize-none transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all duration-200 active:scale-[0.99] cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ====================================================================
          7. Minimal Clean Footer
      ==================================================================== */}
      <footer
        onClick={(e) => e.stopPropagation()}
        className="border-t border-white/10 bg-black/45 backdrop-blur-md"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/70">
          <p>&copy; 2026 Ritesh Dev. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </TubesBackground>
  );
}
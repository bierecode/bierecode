import type { JSX } from 'solid-js';
import { For, createSignal, onMount, onCleanup } from 'solid-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Node Graph Background (canvas-based) ---
function NodeGraph(): JSX.Element {
  let canvasRef: HTMLCanvasElement | undefined;
  let animFrameId: number;

  interface Node {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    pulsePhase: number;
  }

  interface Pulse {
    fromIdx: number;
    toIdx: number;
    progress: number;
    speed: number;
  }

  onMount(() => {
    if (!canvasRef) return;
    const ctx = canvasRef.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;

    const resize = () => {
      canvasRef!.width = window.innerWidth;
      canvasRef!.height = window.innerHeight * 2.5;
    };
    resize();
    window.addEventListener('resize', resize);

    // Fewer but larger, more visible nodes on mobile
    const nodeCount = isMobile ? 20 : 35;
    const connectionDist = isMobile ? 160 : 200;
    const baseRadius = isMobile ? 3 : 1.5;
    const radiusRange = isMobile ? 2.5 : 2;
    const connectionAlphaMultiplier = isMobile ? 0.3 : 0.12;
    const nodeAlphaMultiplier = isMobile ? 0.5 : 0.25;
    const lineWidth = isMobile ? 1 : 0.5;
    const nodes: Node[] = [];
    const pulses: Pulse[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvasRef.width,
        y: Math.random() * canvasRef.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * radiusRange + baseRadius,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Spawn pulses periodically
    const spawnPulse = () => {
      if (pulses.length > 5) return;
      const fromIdx = Math.floor(Math.random() * nodeCount);
      let toIdx = Math.floor(Math.random() * nodeCount);
      if (toIdx === fromIdx) toIdx = (toIdx + 1) % nodeCount;
      const from = nodes[fromIdx];
      const to = nodes[toIdx];
      const dist = Math.hypot(from.x - to.x, from.y - to.y);
      if (dist < connectionDist * 1.5) {
        pulses.push({ fromIdx, toIdx, progress: 0, speed: 0.008 + Math.random() * 0.006 });
      }
    };
    const pulseInterval = setInterval(spawnPulse, 800);

    const draw = () => {
      ctx.clearRect(0, 0, canvasRef!.width, canvasRef!.height);

      // Update nodes
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.02;
        if (node.x < 0 || node.x > canvasRef!.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvasRef!.height) node.vy *= -1;
      }

      // Draw connections
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < connectionDist) {
            const alpha = (1 - dist / connectionDist) * connectionAlphaMultiplier;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(204, 108, 17, ${alpha})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
          }
        }
      }

      // Draw pulses
      const pulseRadius = isMobile ? 4.5 : 3;
      const pulseGlowRadius = isMobile ? 12 : 8;
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];
        const x = from.x + (to.x - from.x) * p.progress;
        const y = from.y + (to.y - from.y) * p.progress;
        const alpha = Math.sin(p.progress * Math.PI) * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(204, 108, 17, ${alpha})`;
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.arc(x, y, pulseGlowRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(204, 108, 17, ${alpha * 0.3})`;
        ctx.fill();
      }

      // Draw nodes
      const outerRingSize = isMobile ? 5 : 3;
      const outerRingAlpha = isMobile ? 0.15 : 0.08;
      for (const node of nodes) {
        const pulse = Math.sin(node.pulsePhase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(204, 108, 17, ${nodeAlphaMultiplier * pulse})`;
        ctx.fill();
        // Outer ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + outerRingSize, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(204, 108, 17, ${outerRingAlpha * pulse})`;
        ctx.lineWidth = isMobile ? 0.8 : 0.5;
        ctx.stroke();
      }

      animFrameId = requestAnimationFrame(draw);
    };

    draw();

    onCleanup(() => {
      cancelAnimationFrame(animFrameId);
      clearInterval(pulseInterval);
      window.removeEventListener('resize', resize);
    });
  });

  return (
    <canvas
      ref={canvasRef}
      class="fixed inset-0 w-full h-full pointer-events-none opacity-90 md:opacity-60"
      style={{ 'z-index': '0' }}
      aria-hidden="true"
    />
  );
}

// --- Activity Feed ---
function ActivityFeed(): JSX.Element {
  const [lines, setLines] = createSignal<Array<{ id: number; text: string; status: string }>>([]);
  let lineId = 0;

  const agentNames = ['orchestrator', 'code-review', 'planner', 'eval-runner', 'deployer', 'monitor', 'docs-gen', 'test-suite', 'router', 'indexer'];
  const actions = [
    { text: 'completed task analysis', status: 'done' },
    { text: 'spawned sub-agent', status: 'active' },
    { text: 'waiting for human review', status: 'waiting' },
    { text: 'parsing codebase...', status: 'active' },
    { text: 'evaluation passed (98.2%)', status: 'done' },
    { text: 'routing to specialist', status: 'active' },
    { text: 'deployed to staging', status: 'done' },
    { text: 'running regression tests', status: 'active' },
    { text: 'flagged for review', status: 'waiting' },
    { text: 'merged PR #847', status: 'done' },
    { text: 'indexing new documents', status: 'active' },
    { text: 'tool call: search_codebase()', status: 'active' },
    { text: 'handoff to eval-runner', status: 'active' },
    { text: 'cost check: $0.03 this run', status: 'done' },
    { text: 'retrying after timeout', status: 'waiting' },
  ];

  // Shuffle-based approach to avoid repeats
  let shuffledAgents = [...agentNames].sort(() => Math.random() - 0.5);
  let shuffledActions = [...actions].sort(() => Math.random() - 0.5);
  let agentIdx = 0;
  let actionIdx = 0;

  const addLine = () => {
    const agent = shuffledAgents[agentIdx % shuffledAgents.length];
    const action = shuffledActions[actionIdx % shuffledActions.length];
    agentIdx++;
    actionIdx++;
    // Reshuffle when we loop
    if (agentIdx >= shuffledAgents.length) {
      shuffledAgents = [...agentNames].sort(() => Math.random() - 0.5);
      agentIdx = 0;
    }
    if (actionIdx >= shuffledActions.length) {
      shuffledActions = [...actions].sort(() => Math.random() - 0.5);
      actionIdx = 0;
    }
    const newLine = { id: lineId++, text: `${agent} → ${action.text}`, status: action.status };
    setLines((prev) => [newLine, ...prev].slice(0, 8));
  };

  onMount(() => {
    // Initial burst
    for (let i = 0; i < 5; i++) {
      setTimeout(addLine, i * 300);
    }
    const interval = setInterval(addLine, 2200);
    onCleanup(() => clearInterval(interval));
  });

  const statusColor = (status: string) => {
    switch (status) {
      case 'done': return 'text-green-400/70';
      case 'active': return 'text-[#cc6c11]/80';
      case 'waiting': return 'text-yellow-400/60';
      default: return 'text-white/40';
    }
  };

  const statusDot = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-400/70';
      case 'active': return 'bg-[#cc6c11] animate-pulse';
      case 'waiting': return 'bg-yellow-400/60';
      default: return 'bg-white/30';
    }
  };

  return (
    <div class="rounded-xl border border-white/5 bg-black/40 backdrop-blur-sm p-4 font-mono text-xs overflow-hidden max-h-[220px]">
      <div class="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
        <span class="w-2 h-2 rounded-full bg-[#cc6c11] animate-pulse" />
        <span class="text-white/30 text-[10px] uppercase tracking-wider">Agent Activity</span>
      </div>
      <div class="space-y-1.5">
        <For each={lines()}>
          {(line) => (
            <div class="flex items-center gap-2 animate-[fadeSlideIn_0.3s_ease-out]">
              <span class={`w-1.5 h-1.5 rounded-full flex-none ${statusDot(line.status)}`} />
              <span class={`truncate ${statusColor(line.status)}`}>{line.text}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

// --- Typewriter Hero ---
function TypewriterText(props: { texts: string[]; class?: string }): JSX.Element {
  const [displayText, setDisplayText] = createSignal('');
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [phase, setPhase] = createSignal<'typing' | 'pausing' | 'deleting'>('typing');

  onMount(() => {
    let charIdx = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      const texts = props.texts;
      const current = texts[currentIndex()];

      if (phase() === 'typing') {
        charIdx++;
        setDisplayText(current.slice(0, charIdx));
        if (charIdx >= current.length) {
          setPhase('pausing');
          timeout = setTimeout(tick, 2500);
          return;
        }
        timeout = setTimeout(tick, 50 + Math.random() * 30);
      } else if (phase() === 'pausing') {
        setPhase('deleting');
        timeout = setTimeout(tick, 30);
      } else if (phase() === 'deleting') {
        charIdx--;
        setDisplayText(current.slice(0, charIdx));
        if (charIdx <= 0) {
          setCurrentIndex((currentIndex() + 1) % texts.length);
          setPhase('typing');
          timeout = setTimeout(tick, 400);
          return;
        }
        timeout = setTimeout(tick, 25);
      }
    };

    tick();
    onCleanup(() => clearTimeout(timeout));
  });

  return (
    <span class={props.class}>
      {displayText()}
      <span class="animate-pulse text-[#cc6c11]">|</span>
    </span>
  );
}

// --- Main Page ---
export function AIOrchestrationBranded(): JSX.Element {
  let formatRef: HTMLDivElement | undefined;
  let speakersRef: HTMLDivElement | undefined;
  let agendaRef: HTMLDivElement | undefined;
  let ctaRef: HTMLDivElement | undefined;

  // Helper: set up a scroll-triggered animation that starts from a CSS class
  // Elements start visible and get animated — if GSAP fails, nothing is hidden
  const scrollReveal = (
    trigger: HTMLElement,
    selector: string,
    from: gsap.TweenVars,
    opts?: { stagger?: number; delay?: number; duration?: number; ease?: string },
  ) => {
    const els = trigger.querySelectorAll(selector);
    if (!els.length) return;
    // Set initial state, then animate to final
    gsap.set(els, from);
    gsap.to(els, {
      scrollTrigger: { trigger, start: 'top 85%', toggleActions: 'play none none none' },
      ...Object.fromEntries(Object.keys(from).map((k) => [k, k === 'opacity' ? 1 : 0])),
      opacity: 1,
      duration: opts?.duration ?? 0.6,
      stagger: opts?.stagger ?? 0.15,
      delay: opts?.delay ?? 0,
      ease: opts?.ease ?? 'power2.out',
      // Safety: ensure elements become visible even if ST doesn't fire
      onComplete: () => gsap.set(els, { clearProps: 'all' }),
    });
  };

  onMount(() => {
    requestAnimationFrame(() => {
      // Format cards
      if (formatRef) {
        scrollReveal(formatRef, '[data-card]', { y: 50, opacity: 0 }, { stagger: 0.12 });
      }

      // Speakers — bounce in from small
      if (speakersRef) {
        scrollReveal(speakersRef, '[data-speaker]', { scale: 0.85, opacity: 0, y: 15 }, {
          stagger: 0.2, ease: 'back.out(1.7)', duration: 0.5,
        });
        // Connector lines
        const connectors = speakersRef.querySelectorAll('[data-connector]');
        if (connectors.length) {
          gsap.set(connectors, { scaleX: 0, opacity: 0 });
          gsap.to(connectors, {
            scrollTrigger: { trigger: speakersRef, start: 'top 85%', toggleActions: 'play none none none' },
            scaleX: 1, opacity: 1, duration: 0.4, stagger: 0.2, delay: 0.4, ease: 'power2.out',
          });
        }
      }

      // Agenda timeline
      if (agendaRef) {
        scrollReveal(agendaRef, '[data-step]', { x: -25, opacity: 0 }, { stagger: 0.08, duration: 0.5 });
      }

      // Bottom CTA
      if (ctaRef) {
        gsap.set(ctaRef, { y: 30, opacity: 0 });
        gsap.to(ctaRef, {
          scrollTrigger: { trigger: ctaRef, start: 'top 85%', toggleActions: 'play none none none' },
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
        });
      }

      // Safety timeout — if ScrollTrigger hasn't fired after 3s, show everything
      setTimeout(() => {
        document.querySelectorAll('[data-card], [data-speaker], [data-step], [data-connector]').forEach((el) => {
          const style = window.getComputedStyle(el);
          if (parseFloat(style.opacity) < 0.1) {
            gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.4 });
          }
        });
      }, 3000);
    });
  });

  const speakers = [
    {
      slot: '01',
      name: 'Speaker TBD',
      topic: 'Agent management with custom tooling',
      desc: 'How they built and manage their agent fleet — internal tools, deployment, monitoring.',
    },
    {
      slot: '02',
      name: 'Speaker TBD',
      topic: 'Framework-driven orchestration',
      desc: 'Using LangGraph, CrewAI, or similar to coordinate multi-agent workflows in production.',
    },
    {
      slot: '03',
      name: 'Speaker TBD',
      topic: 'Evaluation & debugging agents',
      desc: 'Techniques for knowing if your agents are working — tracing, evals, and regression testing.',
    },
  ];

  const agenda = [
    { time: '19:00', label: 'Doors open', detail: 'Drinks, intros, settling in' },
    { time: '19:30', label: 'Demo #1', detail: '20 min demo + 10 min Q&A' },
    { time: '20:00', label: 'Demo #2', detail: '20 min demo + 10 min Q&A' },
    { time: '20:30', label: 'Demo #3', detail: '20 min demo + 10 min Q&A' },
    { time: '21:00', label: 'Open floor', detail: 'Networking, follow-up conversations, beers' },
  ];

  return (
    <div class="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Node graph canvas */}
      <NodeGraph />

      {/* Subtle grid overlay */}
      <div class="fixed inset-0 pointer-events-none opacity-[0.02]" aria-hidden="true" style={{
        'background-image': `linear-gradient(rgba(204,108,17,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(204,108,17,0.5) 1px, transparent 1px)`,
        'background-size': '60px 60px',
        'z-index': '1',
      }} />

      {/* Nav */}
      <header class="relative z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" class="flex items-center gap-3 group">
            <img src="/logo.svg" alt="Biere & Code" width={32} height={32} class="opacity-90 group-hover:opacity-100 transition-opacity" />
            <span class="text-sm font-bold text-white/80 font-grotesk tracking-tight">Biere & Code</span>
          </a>
          <div class="flex items-center gap-4">
            <a href="/about" class="text-xs text-white/40 hover:text-white/70 transition-colors hidden sm:inline">About</a>
            <a
              href="https://www.meetup.com/biere-code-beer-paris/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs font-semibold bg-[#cc6c11] hover:bg-[#e07d1c] text-white px-4 py-2 rounded-full transition-colors"
            >
              Join Meetup
            </a>
          </div>
        </div>
      </header>

      <main class="relative z-10">
        {/* Hero — terminal-style entrance + activity feed */}
        <section class="px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div class="max-w-6xl mx-auto">
            <div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
              {/* Left: terminal-style hero */}
              <div>
                <div class="inline-flex items-center gap-2 rounded-full border border-[#cc6c11]/30 bg-[#cc6c11]/10 px-4 py-1.5 mb-8">
                  <span class="w-2 h-2 rounded-full bg-[#cc6c11] animate-pulse" />
                  <span class="text-xs font-semibold text-[#cc6c11] uppercase tracking-wider">New Event Series</span>
                </div>

                {/* Terminal-style title block */}
                <div class="mb-8">
                  <div class="font-mono text-xs text-white/20 mb-3">
                    <span class="text-[#cc6c11]/60">$</span> orchestrator.dispatch(
                  </div>
                  <h1
                    class="font-grotesk font-bold text-white leading-[1.0] mb-2"
                    style={{ 'font-size': 'clamp(2.6rem, 6.5vw, 4.5rem)' }}
                  >
                    AI Agent<br />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#cc6c11] to-[#FFE221]">
                      Orchestration
                    </span>
                  </h1>
                  <div class="font-mono text-xs text-white/20">
                    )
                  </div>
                </div>

                <p class="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mb-4">
                  Three speakers demo how they{' '}
                  <TypewriterText
                    texts={[
                      'manage agent fleets',
                      'debug failing runs',
                      'orchestrate multi-agent workflows',
                      'evaluate agent performance',
                      'deploy agents to production',
                      'handle tool-use errors',
                    ]}
                    class="text-white/80 font-medium"
                  />
                </p>
                <p class="text-sm text-white/30 mb-10">20-min demos. 10-min Q&A. Then beers.</p>

                <div class="flex flex-wrap gap-6 mb-10">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="text-sm text-white/60">Paris</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm text-white/60">Date TBD</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="text-sm text-white/60">~30 builders</span>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://www.meetup.com/biere-code-beer-paris/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#cc6c11] to-[#e07d1c] px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_-5px_rgba(204,108,17,0.4)] hover:shadow-[0_0_40px_-5px_rgba(204,108,17,0.6)] transition-all duration-300 hover:scale-[1.02]"
                  >
                    Register Interest
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                  <a
                    href="#format"
                    class="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-4 text-base font-semibold text-white/70 hover:text-white hover:border-white/20 transition-all duration-200"
                  >
                    See the format
                  </a>
                </div>
              </div>

              {/* Right: Live activity feed */}
              <div class="lg:mt-16">
                <ActivityFeed />
              </div>
            </div>
          </div>
        </section>

        {/* Format */}
        <section id="format" class="px-6 py-24 border-t border-white/5">
          <div ref={formatRef} class="max-w-5xl mx-auto">
            <h2 data-card class="font-grotesk text-2xl md:text-3xl font-bold text-white mb-3">The format</h2>
            <p data-card class="text-white/40 mb-14 max-w-2xl text-lg">
              Each speaker gets 20 minutes to demo how they manage their agents — tools, techniques, workflows — followed by 10 minutes of questions.
            </p>

            <div class="grid gap-6 md:grid-cols-3">
              <div data-card class="rounded-2xl border border-white/5 bg-white/[0.02] p-8 relative overflow-hidden group">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#cc6c11] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div class="w-12 h-12 rounded-xl bg-[#cc6c11]/10 flex items-center justify-center mb-5">
                  <svg class="w-6 h-6 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 class="font-grotesk font-bold text-white text-lg mb-2">20-min live demo</h3>
                <p class="text-sm text-white/40 leading-relaxed">
                  Show your screen. Walk through your agent setup — the real thing, not slides.
                </p>
              </div>

              <div data-card class="rounded-2xl border border-white/5 bg-white/[0.02] p-8 relative overflow-hidden group">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFE221] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div class="w-12 h-12 rounded-xl bg-[#FFE221]/10 flex items-center justify-center mb-5">
                  <svg class="w-6 h-6 text-[#FFE221]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 class="font-grotesk font-bold text-white text-lg mb-2">10-min Q&A</h3>
                <p class="text-sm text-white/40 leading-relaxed">
                  Audience asks anything — architecture, failure modes, costs, what they'd change.
                </p>
              </div>

              <div data-card class="rounded-2xl border border-white/5 bg-white/[0.02] p-8 relative overflow-hidden group">
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1f7cec] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div class="w-12 h-12 rounded-xl bg-[#1f7cec]/10 flex items-center justify-center mb-5">
                  <svg class="w-6 h-6 text-[#1f7cec]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 class="font-grotesk font-bold text-white text-lg mb-2">3 speakers per night</h3>
                <p class="text-sm text-white/40 leading-relaxed">
                  Different stacks, different scales, different approaches to the same problem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Speakers — with dispatch animation & connecting lines */}
        <section class="px-6 py-24 border-t border-white/5">
          <div ref={speakersRef} class="max-w-5xl mx-auto">
            <h2 class="font-grotesk text-2xl md:text-3xl font-bold text-white mb-3">Speakers</h2>
            <p class="text-white/40 mb-14 text-lg">Three demo slots. Want to show how you run your agents?</p>

            {/* Orchestrator dispatch visual */}
            <div class="relative">
              {/* Central dispatch node */}
              <div class="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#cc6c11]/20 border border-[#cc6c11]/40 items-center justify-center">
                <div class="w-3 h-3 rounded-full bg-[#cc6c11] animate-pulse" />
              </div>

              {/* Connector lines from dispatch node to cards */}
              <div class="hidden md:block absolute left-4 top-0 bottom-0 w-px">
                <div data-connector class="absolute top-[16%] left-0 w-8 h-px bg-gradient-to-r from-[#cc6c11]/40 to-transparent origin-left" />
                <div data-connector class="absolute top-[50%] left-0 w-8 h-px bg-gradient-to-r from-[#cc6c11]/40 to-transparent origin-left" />
                <div data-connector class="absolute top-[83%] left-0 w-8 h-px bg-gradient-to-r from-[#cc6c11]/40 to-transparent origin-left" />
              </div>

              <div class="grid gap-6 md:grid-cols-3 md:pl-14">
                <For each={speakers}>
                  {(speaker) => (
                    <div data-speaker class="rounded-2xl border border-white/5 bg-white/[0.02] p-7 relative overflow-hidden group hover:border-[#cc6c11]/20 transition-all duration-300">
                      <div class="absolute inset-0 bg-gradient-to-b from-[#cc6c11]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div class="relative">
                        <span class="text-4xl font-grotesk font-bold text-white/5 absolute -top-2 -right-1">{speaker.slot}</span>
                        <div class="w-14 h-14 rounded-full bg-white/5 border border-white/10 mb-5 flex items-center justify-center">
                          <svg class="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p class="font-grotesk font-bold text-white/40 mb-1">{speaker.name}</p>
                        <p class="text-sm font-semibold text-[#cc6c11] mb-3">{speaker.topic}</p>
                        <p class="text-xs text-white/30 leading-relaxed">{speaker.desc}</p>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="mt-10 text-center">
              <a
                href="mailto:miguel@bierecode.com"
                class="inline-flex items-center gap-2 text-sm font-semibold text-[#cc6c11] hover:text-[#e07d1c] transition-colors"
              >
                Interested in speaking? Reach out
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Agenda */}
        <section id="agenda" class="px-6 py-24 border-t border-white/5 bg-white/[0.01]">
          <div ref={agendaRef} class="max-w-5xl mx-auto">
            <h2 class="font-grotesk text-2xl md:text-3xl font-bold text-white mb-3">The evening</h2>
            <p class="text-white/40 mb-14 text-lg">Two hours. Three demos. Plenty of beers.</p>

            <div class="max-w-2xl">
              <For each={agenda}>
                {(item, i) => (
                  <div data-step class="flex items-stretch gap-6 group">
                    <div class="flex flex-col items-center">
                      <div class="w-4 h-4 rounded-full border-2 border-[#cc6c11] bg-[#0a0a0f] group-hover:bg-[#cc6c11] transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(204,108,17,0.5)] z-10" />
                      {i() < agenda.length - 1 && <div class="w-px flex-1 bg-gradient-to-b from-[#cc6c11]/30 to-white/5" />}
                    </div>
                    <div class="pb-10">
                      <span class="text-sm font-mono text-[#cc6c11] font-bold">{item.time}</span>
                      <p class="text-white/90 font-semibold mt-1 text-lg">{item.label}</p>
                      <p class="text-sm text-white/40 mt-1">{item.detail}</p>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* What demos look like */}
        <section class="px-6 py-24 border-t border-white/5">
          <div class="max-w-5xl mx-auto">
            <h2 class="font-grotesk text-2xl md:text-3xl font-bold text-white mb-3">What demos look like</h2>
            <p class="text-white/40 mb-14 max-w-2xl text-lg">
              Show your screen. Walk us through how you actually manage your agents day-to-day.
            </p>

            <div class="grid gap-4 md:grid-cols-2">
              {(() => {
                const examples = [
                  'Your agent deployment pipeline — how code becomes a running agent',
                  'The dashboard you use to monitor agent health and costs',
                  'How you handle failures, retries, and human-in-the-loop',
                  'Your evaluation setup — how you know agents are working correctly',
                  'Multi-agent coordination — routing, handoffs, shared state',
                  'The debugging workflow when an agent goes off the rails',
                ];
                return (
                  <For each={examples}>
                    {(example) => (
                      <div class="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-[#cc6c11]/15 transition-colors duration-300">
                        <span class="mt-0.5 h-2 w-2 flex-none rounded-full bg-[#cc6c11]" />
                        <span class="text-sm text-white/60 leading-relaxed">{example}</span>
                      </div>
                    )}
                  </For>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section class="px-6 py-24 border-t border-white/5">
          <div ref={ctaRef} class="max-w-4xl mx-auto">
            <div class="rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent p-10 md:p-14 text-center relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-[#cc6c11]/5 via-transparent to-[#1f7cec]/5 opacity-50" />
              <div class="relative">
                <h2 class="font-grotesk text-3xl md:text-4xl font-bold text-white mb-4">
                  Ship agents?<br />
                  <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#cc6c11] to-[#FFE221]">Show us how you run them.</span>
                </h2>
                <p class="text-white/40 text-lg mb-10 max-w-xl mx-auto">
                  No vendor pitches. No sponsored content. Just builders demoing their real setups over beers in Paris.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://www.meetup.com/biere-code-beer-paris/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#cc6c11] to-[#e07d1c] px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_-5px_rgba(204,108,17,0.4)] hover:shadow-[0_0_40px_-5px_rgba(204,108,17,0.6)] transition-all duration-300 hover:scale-[1.02]"
                  >
                    Register on Meetup
                  </a>
                  <a
                    href="mailto:miguel@bierecode.com"
                    class="inline-flex items-center justify-center rounded-full border border-white/10 px-8 py-4 text-base font-semibold text-white/70 hover:text-white hover:border-white/20 transition-all"
                  >
                    Propose a demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer class="border-t border-white/5 px-6 py-8">
          <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <img src="/logo.svg" alt="" width={24} height={24} class="opacity-60" />
              <span class="text-xs text-white/30">Biere & Code Paris</span>
            </div>
            <div class="flex items-center gap-6">
              <a href="/" class="text-xs text-white/30 hover:text-white/60 transition-colors">Home</a>
              <a href="/about" class="text-xs text-white/30 hover:text-white/60 transition-colors">About</a>
              <a href="/updates" class="text-xs text-white/30 hover:text-white/60 transition-colors">Updates</a>
            </div>
          </div>
        </footer>
      </main>

      {/* CSS for feed animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

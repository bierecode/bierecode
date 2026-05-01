import type { JSX } from 'solid-js';
import { For, onMount } from 'solid-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function AIOrchestrationBranded(): JSX.Element {
  let heroRef: HTMLDivElement | undefined;
  let formatRef: HTMLDivElement | undefined;
  let speakersRef: HTMLDivElement | undefined;
  let agendaRef: HTMLDivElement | undefined;
  let ctaRef: HTMLDivElement | undefined;

  onMount(() => {
    // Small delay to ensure DOM is ready
    requestAnimationFrame(() => {
      // Hero entrance
      const heroElements = heroRef?.querySelectorAll('[data-animate]');
      if (heroElements) {
        gsap.fromTo(heroElements,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out' }
        );
      }

      // Format section scroll reveal
      if (formatRef) {
        const cards = formatRef.querySelectorAll('[data-card]');
        gsap.fromTo(cards,
          { y: 60, opacity: 0 },
          {
            scrollTrigger: { trigger: formatRef, start: 'top 85%', toggleActions: 'play none none none' },
            y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out',
          }
        );
      }

      // Speakers stagger
      if (speakersRef) {
        const items = speakersRef.querySelectorAll('[data-speaker]');
        gsap.fromTo(items,
          { y: 30, opacity: 0 },
          {
            scrollTrigger: { trigger: speakersRef, start: 'top 85%', toggleActions: 'play none none none' },
            y: 0, opacity: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(1.4)',
          }
        );
      }

      // Agenda timeline
      if (agendaRef) {
        const steps = agendaRef.querySelectorAll('[data-step]');
        gsap.fromTo(steps,
          { x: -30, opacity: 0 },
          {
            scrollTrigger: { trigger: agendaRef, start: 'top 80%', toggleActions: 'play none none none' },
            x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out',
          }
        );
      }

      // Bottom CTA
      if (ctaRef) {
        gsap.fromTo(ctaRef,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: { trigger: ctaRef, start: 'top 85%', toggleActions: 'play none none none' },
            y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          }
        );
      }

      // Parallax orbs
      gsap.to('[data-orb-1]', {
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 },
        y: -200,
        ease: 'none',
      });
      gsap.to('[data-orb-2]', {
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 },
        y: -100,
        x: 50,
        ease: 'none',
      });
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
      {/* Animated grid background */}
      <div class="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          class="absolute inset-0 opacity-[0.03]"
          style={{
            'background-image': `linear-gradient(rgba(204,108,17,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(204,108,17,0.5) 1px, transparent 1px)`,
            'background-size': '60px 60px',
          }}
        />
        <div data-orb-1 class="absolute top-[-10%] left-[-5%] w-[700px] h-[700px] rounded-full bg-[#cc6c11]/8 blur-[150px]" />
        <div data-orb-2 class="absolute bottom-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full bg-[#1f7cec]/6 blur-[120px]" />
      </div>

      {/* Nav */}
      <header class="relative z-50 border-b border-white/5">
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
        {/* Hero */}
        <section class="px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div ref={heroRef} class="max-w-5xl mx-auto">
            <div data-animate class="inline-flex items-center gap-2 rounded-full border border-[#cc6c11]/30 bg-[#cc6c11]/10 px-4 py-1.5 mb-8">
              <span class="w-2 h-2 rounded-full bg-[#cc6c11] animate-pulse" />
              <span class="text-xs font-semibold text-[#cc6c11] uppercase tracking-wider">New Event Series</span>
            </div>

            <h1
              data-animate
              class="font-grotesk font-bold text-white leading-[1.0] mb-6"
              style={{ 'font-size': 'clamp(2.8rem, 7vw, 5rem)' }}
            >
              AI Agent<br />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#cc6c11] to-[#FFE221]">
                Orchestration
              </span>
            </h1>

            <p data-animate class="text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed mb-10">
              Three speakers. Twenty-minute demos. Real tools and techniques for managing agents in production. Then beers.
            </p>

            <div data-animate class="flex flex-wrap gap-6 mb-10">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="text-sm text-white/60">Paris, France</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="text-sm text-white/60">Date TBD — Gauging interest</span>
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm text-white/60">3 x 30 min (20 demo + 10 Q&A)</span>
              </div>
            </div>

            <div data-animate class="flex flex-col sm:flex-row gap-4">
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
        </section>

        {/* Format explanation */}
        <section id="format" class="px-6 py-24 border-t border-white/5">
          <div ref={formatRef} class="max-w-5xl mx-auto">
            <h2 data-card class="font-grotesk text-2xl md:text-3xl font-bold text-white mb-3">The format</h2>
            <p data-card class="text-white/40 mb-14 max-w-2xl text-lg">
              Each speaker gets 20 minutes to demo how they manage their agents — tools, techniques, workflows — followed by 10 minutes of questions from the audience.
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
                  Show us your setup. IDE, dashboards, deploy pipeline, agent traces — whatever makes your system tick.
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
                  Audience asks anything — architecture choices, failure modes, costs, what they'd do differently.
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
                  Diverse perspectives — different stacks, different scales, different approaches to the same problem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Speakers */}
        <section class="px-6 py-24 border-t border-white/5">
          <div ref={speakersRef} class="max-w-5xl mx-auto">
            <h2 class="font-grotesk text-2xl md:text-3xl font-bold text-white mb-3">Speakers</h2>
            <p class="text-white/40 mb-14 text-lg">Three demo slots. Want to show how you run your agents? Let's talk.</p>

            <div class="grid gap-6 md:grid-cols-3">
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

        {/* Agenda timeline */}
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

        {/* What speakers demo */}
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
    </div>
  );
}

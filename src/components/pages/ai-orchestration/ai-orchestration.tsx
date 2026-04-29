import type { JSX } from 'solid-js';
import { For, Show, createSignal, onMount } from 'solid-js';
import en from '../../../locales/en.json';
import fr from '../../../locales/fr.json';

interface Translation {
  language: string;
  french: string;
  english: string;
  aboutLink: string;
  updatesLink: string;
  aiOrchestration: {
    title: string;
    tagline: string;
    description: string;
    status: string;
    coBrandingNote: string;
    heroCtaLink: string;
    heroCtaDescription: string;
    secondaryCta: string;
    themes: {
      title: string;
      description: string;
      cards: Array<{ title: string; description: string }>;
    };
    firstEvent: {
      title: string;
      description: string;
      items: string[];
    };
    audience: {
      title: string;
      points: string[];
    };
    faq: {
      title: string;
      q1: string;
      a1: string;
      q2: string;
      a2: string;
      q3: string;
      a3: string;
      q4: string;
      a4: string;
    };
    cta: {
      title: string;
      description: string;
      primary: string;
      secondary: string;
    };
  };
}

function detectLocale(): 'fr' | 'en' {
  if (typeof window !== 'undefined' && navigator) {
    const locales = navigator.languages || [navigator.language];
    const found = locales.find((locale) => ['fr', 'en'].includes(locale.split('-')[0]));
    return found ? (found.split('-')[0] as 'fr' | 'en') : 'en';
  }
  return 'en';
}

const translations: Record<'fr' | 'en', Translation> = {
  fr: fr as Translation,
  en: en as Translation,
};

export function AIOrchestrationPage(props: { children?: JSX.Element }): JSX.Element {
  const [lang, setLang] = createSignal<'fr' | 'en'>('en');
  const [menuOpen, setMenuOpen] = createSignal(false);
  const t = () => translations[lang()] ?? translations.en;

  onMount(() => {
    setLang(detectLocale());
  });

  const toggleLang = () => setLang(lang() === 'fr' ? 'en' : 'fr');

  const faqItems = () => {
    const faq = t().aiOrchestration.faq;
    return [
      { question: faq.q1, answer: faq.a1 },
      { question: faq.q2, answer: faq.a2 },
      { question: faq.q3, answer: faq.a3 },
      { question: faq.q4, answer: faq.a4 },
    ];
  };

  return (
    <div class="min-h-screen bg-white">
      <a
        href="#main-content"
        class="sr-only absolute left-4 top-4 z-[60] rounded-full bg-[#1a1a1a] px-4 py-2 text-sm font-semibold text-white focus:not-sr-only"
      >
        Skip to content
      </a>

      {/* Navigation */}
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Biere Code Logo" width={36} height={36} />
            <span class="text-lg font-bold text-[#1a1a1a] font-grotesk hidden sm:block">Biere & Code</span>
          </a>

          <nav class="hidden md:flex items-center gap-6">
            <a href="/about" class="text-sm font-medium text-gray-500 hover:text-[#1a1a1a] transition-colors">{t().aboutLink}</a>
            <a href="/updates" class="text-sm font-medium text-gray-500 hover:text-[#1a1a1a] transition-colors">{t().updatesLink}</a>
            <button
              onClick={toggleLang}
              class="text-xs font-bold text-gray-400 hover:text-[#1a1a1a] border border-gray-200 rounded-full px-3 py-1.5 transition-colors"
            >
              {lang() === 'fr' ? 'EN' : 'FR'}
            </button>
          </nav>

          <button
            class="md:hidden p-2 text-gray-500 hover:text-[#1a1a1a]"
            onClick={() => setMenuOpen(!menuOpen())}
            aria-label="Toggle menu"
          >
            <Show when={!menuOpen()} fallback={
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            }>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Show>
          </button>
        </div>

        <Show when={menuOpen()}>
          <div class="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
            <a href="/about" class="block text-sm font-medium text-gray-500 hover:text-[#1a1a1a] py-2">{t().aboutLink}</a>
            <a href="/updates" class="block text-sm font-medium text-gray-500 hover:text-[#1a1a1a] py-2">{t().updatesLink}</a>
            <button
              onClick={toggleLang}
              class="text-xs font-bold text-gray-400 hover:text-[#1a1a1a] border border-gray-200 rounded-full px-3 py-1.5"
            >
              {lang() === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
        </Show>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section class="px-6 pb-16 pt-28 md:pt-32">
          <div class="mx-auto max-w-5xl">
            <div class="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-10">
              <div class="space-y-6">
                <div class="inline-flex rounded-full bg-[#cc6c11]/10 px-4 py-2 text-sm font-semibold text-[#cc6c11]">
                  {t().aiOrchestration.coBrandingNote}
                </div>
                <div class="space-y-4">
                  <p class="text-sm font-semibold uppercase tracking-[0.25em] text-[#cc6c11]">
                    {t().aiOrchestration.tagline}
                  </p>
                  <h1 class="font-grotesk font-bold leading-[1.05] text-[#1a1a1a]" style={{ 'font-size': 'clamp(2.5rem, 6vw, 4rem)' }}>
                    {t().aiOrchestration.title}
                  </h1>
                  <p class="max-w-3xl text-gray-500 leading-relaxed text-lg">
                    {t().aiOrchestration.description}
                  </p>
                </div>
                <div class="grid gap-3 sm:grid-cols-3">
                  <div class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <p class="text-xs font-semibold uppercase tracking-wider text-[#cc6c11]">Focus</p>
                    <p class="mt-2 text-sm leading-relaxed text-gray-600">Agents, workflows, evaluation, and production stories.</p>
                  </div>
                  <div class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <p class="text-xs font-semibold uppercase tracking-wider text-[#cc6c11]">Format</p>
                    <p class="mt-2 text-sm leading-relaxed text-gray-600">Small first session with short talks and open discussion.</p>
                  </div>
                  <div class="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <p class="text-xs font-semibold uppercase tracking-wider text-[#cc6c11]">Status</p>
                    <p class="mt-2 text-sm leading-relaxed text-gray-600">Interest gathering now. Details will follow once the format is locked.</p>
                  </div>
                </div>
                <div class="flex flex-col gap-3 sm:flex-row">
                  <a
                    href="https://www.meetup.com/biere-code-beer-paris/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-[#333] hover:scale-[1.02]"
                  >
                    {t().aiOrchestration.heroCtaLink}
                  </a>
                  <a
                    href="/updates"
                    class="inline-flex items-center justify-center rounded-full border border-gray-200 px-8 py-4 text-base font-semibold text-[#1a1a1a] transition-all duration-200 hover:border-gray-300"
                  >
                    {t().aiOrchestration.secondaryCta}
                  </a>
                </div>
                <p class="text-sm text-gray-400">{t().aiOrchestration.heroCtaDescription}</p>
              </div>

              <aside class="rounded-2xl border border-gray-100 bg-gray-50 p-6 sm:p-7">
                <p class="text-sm font-semibold uppercase tracking-wider text-[#cc6c11]">
                  {t().aiOrchestration.status}
                </p>
                <div class="mt-5 space-y-5 text-sm leading-relaxed text-gray-500">
                  <p>{t().aiOrchestration.firstEvent.description}</p>
                  <ul class="space-y-3">
                    <For each={t().aiOrchestration.firstEvent.items}>
                      {(item) => (
                        <li class="flex items-start gap-3">
                          <span class="mt-1.5 h-2 w-2 flex-none rounded-full bg-[#cc6c11]"></span>
                          <span>{item}</span>
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Themes */}
        <section aria-labelledby="themes-heading" class="px-6 py-16">
          <div class="mx-auto max-w-5xl space-y-10">
            <div class="max-w-3xl space-y-3">
              <h2 id="themes-heading" class="font-grotesk text-2xl md:text-3xl font-bold text-[#1a1a1a]">
                {t().aiOrchestration.themes.title}
              </h2>
              <p class="text-lg leading-relaxed text-gray-500">{t().aiOrchestration.themes.description}</p>
            </div>
            <div class="grid gap-6 md:grid-cols-3">
              <For each={t().aiOrchestration.themes.cards}>
                {(card, index) => (
                  <article class="flex min-h-[14rem] flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)]">
                    <div class="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#cc6c11]/10 text-sm font-bold text-[#cc6c11]">
                      {index() + 1}
                    </div>
                    <h3 class="mb-3 font-grotesk text-lg font-bold text-[#1a1a1a]">{card.title}</h3>
                    <p class="flex-grow leading-relaxed text-gray-500 text-sm">{card.description}</p>
                  </article>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* First Event + Audience */}
        <section aria-labelledby="first-event-heading" class="bg-gray-50 px-6 py-16">
          <div class="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
            <div class="rounded-2xl bg-white p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]">
              <h2 id="first-event-heading" class="mb-5 font-grotesk text-2xl font-bold text-[#1a1a1a]">
                {t().aiOrchestration.firstEvent.title}
              </h2>
              <ul class="space-y-4 text-gray-500">
                <For each={t().aiOrchestration.firstEvent.items}>
                  {(item) => (
                    <li class="flex items-start gap-3">
                      <span class="mt-1.5 h-2 w-2 flex-none rounded-full bg-[#cc6c11]"></span>
                      <span class="leading-relaxed text-sm">{item}</span>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class="rounded-2xl bg-white p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]">
              <h2 class="mb-5 font-grotesk text-2xl font-bold text-[#1a1a1a]">
                {t().aiOrchestration.audience.title}
              </h2>
              <ul class="space-y-4 text-gray-500">
                <For each={t().aiOrchestration.audience.points}>
                  {(point) => (
                    <li class="flex items-start gap-3">
                      <span class="mt-1.5 h-2 w-2 flex-none rounded-full bg-[#1a1a1a]"></span>
                      <span class="leading-relaxed text-sm">{point}</span>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-heading" class="px-6 py-16">
          <div class="mx-auto max-w-3xl">
            <h2 id="faq-heading" class="mb-8 text-center font-grotesk text-2xl font-bold text-[#1a1a1a]">
              {t().aiOrchestration.faq.title}
            </h2>
            <div class="space-y-3">
              <For each={faqItems()}>
                {(item) => (
                  <details class="group rounded-xl border border-gray-100 bg-white p-5">
                    <summary class="list-none cursor-pointer font-semibold text-[#1a1a1a]">
                      <div class="flex items-center justify-between gap-4">
                        <span>{item.question}</span>
                        <span aria-hidden="true" class="text-[#cc6c11] transition-transform group-open:rotate-45">+</span>
                      </div>
                    </summary>
                    <p class="mt-4 leading-relaxed text-gray-500 text-sm">{item.answer}</p>
                  </details>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section class="px-6 pb-20 pt-4">
          <div class="mx-auto max-w-4xl rounded-2xl bg-[#1a1a1a] px-8 py-12 text-white sm:px-10">
            <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div class="space-y-4">
                <h2 class="font-grotesk text-2xl md:text-3xl font-bold">
                  {t().aiOrchestration.cta.title}
                </h2>
                <p class="max-w-3xl leading-relaxed text-white/70">{t().aiOrchestration.cta.description}</p>
              </div>
              <div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a
                  href="https://www.meetup.com/biere-code-beer-paris/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#1a1a1a] transition-colors hover:bg-gray-100"
                >
                  {t().aiOrchestration.cta.primary}
                </a>
                <a
                  href="/updates"
                  class="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {t().aiOrchestration.cta.secondary}
                </a>
              </div>
            </div>
          </div>

          {props.children}
        </section>
      </main>
    </div>
  );
}

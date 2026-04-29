import type { JSX } from 'solid-js';
import { For, createSignal, onMount } from 'solid-js';
import en from '../../../locales/en.json';
import fr from '../../../locales/fr.json';
import { LanguageSwitcher } from '../homepage/components/language-switcher/language-switcher';

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

const themeAccents = [
  'bg-[#cc6c11]/10 text-[#cc6c11]',
  'bg-[#1f7cec]/10 text-[#1f7cec]',
  'bg-[#10b981]/10 text-[#10b981]',
];

export function AIOrchestrationPage(props: { children?: JSX.Element }): JSX.Element {
  const [lang, setLang] = createSignal<'fr' | 'en'>('en');
  const translation = () => translations[lang()] ?? translations.en;

  onMount(() => {
    setLang(detectLocale());
  });

  const faqItems = () => {
    const faq = translation().aiOrchestration.faq;
    return [
      { question: faq.q1, answer: faq.a1 },
      { question: faq.q2, answer: faq.a2 },
      { question: faq.q3, answer: faq.a3 },
      { question: faq.q4, answer: faq.a4 },
    ];
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-[#fff0cb] via-[#f6f3ec] to-white">
      <header class="sticky top-0 z-50 border-b border-[#fff0cb]/50 bg-white/90 backdrop-blur-md shadow-sm">
        <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <a href="/" class="flex items-center gap-3 transition-opacity duration-300 hover:opacity-80">
            <img src="/logo.svg" alt="Bière Code Logo" width={44} height={44} />
            <span class="hidden font-grotesk text-xl font-bold text-[#3f573e] sm:block">Bière & Code</span>
          </a>
          <nav class="flex items-center gap-4 sm:gap-8">
            <a href="/about" class="text-sm font-medium text-[#3f573e] transition-colors duration-300 hover:text-[#cc6c11]">
              {translation().aboutLink}
            </a>
            <a href="/updates" class="text-sm font-medium text-[#3f573e] transition-colors duration-300 hover:text-[#cc6c11]">
              {translation().updatesLink}
            </a>
            <LanguageSwitcher language={lang()} translation={translation()} onChange={setLang} />
          </nav>
        </div>
      </header>

      <main>
        <section class="px-6 pb-20 pt-20 sm:pt-24">
          <div class="mx-auto max-w-5xl">
            <div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div class="space-y-6">
                <div class="inline-flex rounded-full bg-[#cc6c11]/10 px-4 py-2 text-sm font-semibold text-[#cc6c11]">
                  {translation().aiOrchestration.coBrandingNote}
                </div>
                <div class="space-y-4">
                  <p class="text-sm font-semibold uppercase tracking-[0.28em] text-[#cc6c11]">
                    {translation().aiOrchestration.tagline}
                  </p>
                  <h1 class="font-grotesk font-bold leading-[1.08] text-[#3f573e]" style={{ 'font-size': 'var(--font-size-hero)' }}>
                    {translation().aiOrchestration.title}
                  </h1>
                  <p class="max-w-3xl text-[#6b7280] leading-[1.75]" style={{ 'font-size': 'var(--font-size-hero-desc)' }}>
                    {translation().aiOrchestration.description}
                  </p>
                </div>
                <div class="flex flex-col gap-4 sm:flex-row">
                  <a
                    href="https://www.meetup.com/biere-code-beer-paris/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center justify-center rounded-[100px] bg-[#cc6c11] px-8 py-4 text-base font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-[#e07d1c] hover:shadow-lg"
                  >
                    {translation().aiOrchestration.heroCtaLink}
                  </a>
                  <a
                    href="/updates"
                    class="inline-flex items-center justify-center rounded-[100px] border-2 border-[#fff0cb] bg-white px-8 py-4 text-base font-semibold text-[#3f573e] shadow-sm transition-all duration-300 hover:bg-[#f6f3ec] hover:shadow-md"
                  >
                    {translation().aiOrchestration.secondaryCta}
                  </a>
                </div>
                <p class="text-sm text-[#6b7280]">{translation().aiOrchestration.heroCtaDescription}</p>
              </div>

              <aside class="rounded-2xl border border-[#fff0cb]/70 bg-white/85 p-6 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.22)] backdrop-blur-md">
                <p class="text-sm font-semibold uppercase tracking-[0.24em] text-[#cc6c11]">
                  {translation().aiOrchestration.status}
                </p>
                <div class="mt-5 space-y-4 text-sm leading-[1.7] text-[#6b7280]">
                  <p>{translation().aiOrchestration.firstEvent.description}</p>
                  <ul class="space-y-3">
                    <For each={translation().aiOrchestration.firstEvent.items}>
                      {(item) => (
                        <li class="flex items-start gap-3">
                          <span class="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#cc6c11]"></span>
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

        <section class="px-6 py-18">
          <div class="mx-auto max-w-6xl space-y-10">
            <div class="max-w-3xl space-y-3">
              <h2 class="font-grotesk font-bold text-[#3f573e]" style={{ 'font-size': 'var(--font-size-section)' }}>
                {translation().aiOrchestration.themes.title}
              </h2>
              <p class="text-lg leading-[1.7] text-[#6b7280]">{translation().aiOrchestration.themes.description}</p>
            </div>
            <div class="grid gap-6 md:grid-cols-3">
              <For each={translation().aiOrchestration.themes.cards}>
                {(card, index) => (
                  <article class="flex min-h-[15rem] flex-col rounded-2xl border border-[#fff0cb]/40 bg-white p-8 shadow-[0_10px_30px_-16px_rgba(0,0,0,0.18)]">
                    <div class={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl text-lg font-semibold ${themeAccents[index() % themeAccents.length]}`}>
                      {index() + 1}
                    </div>
                    <h3 class="mb-3 font-grotesk text-xl font-bold text-[#3f573e]">{card.title}</h3>
                    <p class="flex-grow leading-[1.7] text-[#6b7280]">{card.description}</p>
                  </article>
                )}
              </For>
            </div>
          </div>
        </section>

        <section class="bg-gradient-to-r from-[#fff0cb]/55 to-[#f6f3ec]/55 px-6 py-18">
          <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
            <div class="rounded-2xl bg-white/85 p-8 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.18)]">
              <h2 class="mb-5 font-grotesk font-bold text-[#3f573e]" style={{ 'font-size': 'var(--font-size-section)' }}>
                {translation().aiOrchestration.firstEvent.title}
              </h2>
              <ul class="space-y-4 text-[#6b7280]">
                <For each={translation().aiOrchestration.firstEvent.items}>
                  {(item) => (
                    <li class="flex items-start gap-3">
                      <span class="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#cc6c11]"></span>
                      <span class="leading-[1.7]">{item}</span>
                    </li>
                  )}
                </For>
              </ul>
            </div>
            <div class="rounded-2xl bg-white/85 p-8 shadow-[0_12px_35px_-18px_rgba(0,0,0,0.18)]">
              <h2 class="mb-5 font-grotesk font-bold text-[#3f573e]" style={{ 'font-size': 'var(--font-size-section)' }}>
                {translation().aiOrchestration.audience.title}
              </h2>
              <ul class="space-y-4 text-[#6b7280]">
                <For each={translation().aiOrchestration.audience.points}>
                  {(point) => (
                    <li class="flex items-start gap-3">
                      <span class="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#3f573e]"></span>
                      <span class="leading-[1.7]">{point}</span>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          </div>
        </section>

        <section class="px-6 py-18">
          <div class="mx-auto max-w-4xl">
            <h2 class="mb-8 text-center font-grotesk font-bold text-[#3f573e]" style={{ 'font-size': 'var(--font-size-section)' }}>
              {translation().aiOrchestration.faq.title}
            </h2>
            <div class="space-y-4">
              <For each={faqItems()}>
                {(item) => (
                  <details class="group rounded-2xl border border-[#fff0cb]/40 bg-white p-6 shadow-sm">
                    <summary class="list-none cursor-pointer font-semibold text-[#3f573e]">
                      <div class="flex items-center justify-between gap-4">
                        <span>{item.question}</span>
                        <span class="text-[#cc6c11] transition-transform group-open:rotate-45">+</span>
                      </div>
                    </summary>
                    <p class="mt-4 leading-[1.7] text-[#6b7280]">{item.answer}</p>
                  </details>
                )}
              </For>
            </div>
          </div>
        </section>

        <section class="px-6 pb-20 pt-4">
          <div class="mx-auto max-w-5xl rounded-3xl bg-[#3f573e] px-8 py-12 text-white shadow-[0_18px_45px_-20px_rgba(0,0,0,0.3)] sm:px-10">
            <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div class="space-y-4">
                <h2 class="font-grotesk font-bold" style={{ 'font-size': 'var(--font-size-section)' }}>
                  {translation().aiOrchestration.cta.title}
                </h2>
                <p class="max-w-3xl leading-[1.75] text-white/80">{translation().aiOrchestration.cta.description}</p>
              </div>
              <div class="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <a
                  href="https://www.meetup.com/biere-code-beer-paris/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center rounded-[100px] bg-white px-7 py-3 text-sm font-semibold text-[#3f573e] transition-colors duration-300 hover:bg-[#fff0cb]"
                >
                  {translation().aiOrchestration.cta.primary}
                </a>
                <a
                  href="/updates"
                  class="inline-flex items-center justify-center rounded-[100px] border border-white/35 px-7 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
                >
                  {translation().aiOrchestration.cta.secondary}
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

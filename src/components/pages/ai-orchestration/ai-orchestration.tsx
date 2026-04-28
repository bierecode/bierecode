import type { JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
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
    coBrandingNote: string;
    heroCtaLink: string;
    heroCtaDescription: string;
    learn: {
      title: string;
      description: string;
      card1: { title: string; description: string };
      card2: { title: string; description: string };
      card3: { title: string; description: string };
    };
    connect: {
      title: string;
      description: string;
      card1: { title: string; description: string };
      card2: { title: string; description: string };
      card3: { title: string; description: string };
    };
    do: {
      title: string;
      description: string;
      card1: { title: string; description: string };
      card2: { title: string; description: string };
      card3: { title: string; description: string };
    };
    features: {
      bilingual: string;
      inclusive: string;
      practical: string;
      collaborative: string;
      location: string;
    };
    upcoming: {
      title: string;
      subtitle: string;
      cta: string;
    };
    testimonials: {
      title: string;
      quote1: { text: string; author: string };
      quote2: { text: string; author: string };
      quote3: { text: string };
    };
    faq: {
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

const translations: Record<'fr' | 'en', Translation> = { fr: fr as any, en: en as any };

export function AIOrchestrationPage(props: { children?: JSX.Element }): JSX.Element {
  const [lang, setLang] = createSignal<'fr' | 'en'>('en');
  const translation = () => translations[lang()] ?? translations['en'];

  onMount(() => {
    const applyLang = () => {
      const newLang = detectLocale();
      setLang(newLang);
    };
    applyLang();
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-[#fff0cb] via-[#f6f3ec] to-white">
      {/* Navigation Header */}
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#fff0cb]/50 shadow-sm">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
            <img src="/logo.svg" alt="Bière Code Logo" width={44} height={44} />
            <span class="text-xl font-bold text-[#3f573e] font-grotesk hidden sm:block">Bière & Code</span>
          </a>
          <nav class="flex items-center gap-8">
            <a href="/about" class="text-sm font-medium text-[#3f573e] hover:text-[#cc6c11] transition-colors duration-300 relative group">
              {translation().aboutLink}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#cc6c11] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/updates" class="text-sm font-medium text-[#3f573e] hover:text-[#cc6c11] transition-colors duration-300 relative group">
              {translation().updatesLink}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#cc6c11] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <LanguageSwitcher language={lang()} translation={translation()} onChange={setLang} />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section class="pt-32 px-6 pb-20">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <div class="inline-block bg-[#cc6c11]/10 text-[#cc6c11] px-6 py-2 rounded-full text-sm font-semibold">
            {translation().aiOrchestration.coBrandingNote}
          </div>
          <div class="space-y-6">
            <h1 class="font-bold text-[#3f573e] leading-[1.2] font-grotesk" style={{ "font-size": "var(--font-size-hero)" }}>
              {translation().aiOrchestration.title}
            </h1>
            <p class="text-sm uppercase tracking-[0.4em] text-[#cc6c11] font-semibold">
              {translation().aiOrchestration.tagline}
            </p>
            <p class="text-[#6b7280] leading-[1.7] max-w-2xl mx-auto" style={{ "font-size": "var(--font-size-hero-desc)" }}>
              {translation().aiOrchestration.description}
            </p>
            <div class="flex flex-col items-center gap-4 pt-4">
              <a
                href="https://www.meetup.com/biere-code-beer-paris/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block bg-[#cc6c11] hover:bg-[#e07d1c] text-white font-semibold px-10 py-4 rounded-[100px] shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                {translation().aiOrchestration.heroCtaLink}
              </a>
              <p class="text-sm font-medium text-[#6b7280]">{translation().aiOrchestration.heroCtaDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars: Learn/Connect/Do */}
      <section class="px-6 py-20">
        <div class="max-w-6xl mx-auto space-y-20">
          {/* LEARN Section */}
          <div>
            <div class="text-center mb-12">
              <h2 class="font-bold text-[#3f573e] font-grotesk mb-4" style={{ "font-size": "var(--font-size-section)" }}>
                {translation().aiOrchestration.learn.title}
              </h2>
              <p class="text-[#6b7280] text-lg">{translation().aiOrchestration.learn.description}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#cc6c11]/10">
                  <svg class="w-7 h-7 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>
                  {translation().aiOrchestration.learn.card1.title}
                </h3>
                <p class="text-[#6b7280] leading-[1.65] flex-grow">
                  {translation().aiOrchestration.learn.card1.description}
                </p>
              </article>

              <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#1f7cec]/10">
                  <svg class="w-7 h-7 text-[#1f7cec]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>
                  {translation().aiOrchestration.learn.card2.title}
                </h3>
                <p class="text-[#6b7280] leading-[1.65] flex-grow">
                  {translation().aiOrchestration.learn.card2.description}
                </p>
              </article>

              <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#10b981]/10">
                  <svg class="w-7 h-7 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>
                  {translation().aiOrchestration.learn.card3.title}
                </h3>
                <p class="text-[#6b7280] leading-[1.65] flex-grow">
                  {translation().aiOrchestration.learn.card3.description}
                </p>
              </article>
            </div>
          </div>

          {/* CONNECT Section */}
          <div>
            <div class="text-center mb-12">
              <h2 class="font-bold text-[#3f573e] font-grotesk mb-4" style={{ "font-size": "var(--font-size-section)" }}>
                {translation().aiOrchestration.connect.title}
              </h2>
              <p class="text-[#6b7280] text-lg">{translation().aiOrchestration.connect.description}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#cc6c11]/10">
                  <svg class="w-7 h-7 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>
                  {translation().aiOrchestration.connect.card1.title}
                </h3>
                <p class="text-[#6b7280] leading-[1.65] flex-grow">
                  {translation().aiOrchestration.connect.card1.description}
                </p>
              </article>

              <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#8b5cf6]/10">
                  <svg class="w-7 h-7 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>
                  {translation().aiOrchestration.connect.card2.title}
                </h3>
                <p class="text-[#6b7280] leading-[1.65] flex-grow">
                  {translation().aiOrchestration.connect.card2.description}
                </p>
              </article>

              <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#ec4899]/10">
                  <svg class="w-7 h-7 text-[#ec4899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>
                  {translation().aiOrchestration.connect.card3.title}
                </h3>
                <p class="text-[#6b7280] leading-[1.65] flex-grow">
                  {translation().aiOrchestration.connect.card3.description}
                </p>
              </article>
            </div>
          </div>

          {/* DO Section */}
          <div>
            <div class="text-center mb-12">
              <h2 class="font-bold text-[#3f573e] font-grotesk mb-4" style={{ "font-size": "var(--font-size-section)" }}>
                {translation().aiOrchestration.do.title}
              </h2>
              <p class="text-[#6b7280] text-lg">{translation().aiOrchestration.do.description}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#f59e0b]/10">
                  <svg class="w-7 h-7 text-[#f59e0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>
                  {translation().aiOrchestration.do.card1.title}
                </h3>
                <p class="text-[#6b7280] leading-[1.65] flex-grow">
                  {translation().aiOrchestration.do.card1.description}
                </p>
              </article>

              <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#06b6d4]/10">
                  <svg class="w-7 h-7 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>
                  {translation().aiOrchestration.do.card2.title}
                </h3>
                <p class="text-[#6b7280] leading-[1.65] flex-grow">
                  {translation().aiOrchestration.do.card2.description}
                </p>
              </article>

              <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#3f573e]/10">
                  <svg class="w-7 h-7 text-[#3f573e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>
                  {translation().aiOrchestration.do.card3.title}
                </h3>
                <p class="text-[#6b7280] leading-[1.65] flex-grow">
                  {translation().aiOrchestration.do.card3.description}
                </p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section class="px-6 py-20 bg-gradient-to-r from-[#fff0cb]/50 to-[#f6f3ec]/50">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-bold text-[#3f573e] text-center font-grotesk mb-12" style={{ "font-size": "var(--font-size-section)" }}>
            What Makes Us Different
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-start gap-4">
              <svg class="w-6 h-6 text-[#cc6c11] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <h3 class="font-semibold text-[#3f573e]">{translation().aiOrchestration.features.bilingual}</h3>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <svg class="w-6 h-6 text-[#cc6c11] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <h3 class="font-semibold text-[#3f573e]">{translation().aiOrchestration.features.inclusive}</h3>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <svg class="w-6 h-6 text-[#cc6c11] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <h3 class="font-semibold text-[#3f573e]">{translation().aiOrchestration.features.practical}</h3>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <svg class="w-6 h-6 text-[#cc6c11] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <h3 class="font-semibold text-[#3f573e]">{translation().aiOrchestration.features.collaborative}</h3>
              </div>
            </div>
            <div class="flex items-start gap-4">
              <svg class="w-6 h-6 text-[#cc6c11] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <h3 class="font-semibold text-[#3f573e]">{translation().aiOrchestration.features.location}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section class="px-6 py-20">
        <div class="max-w-4xl mx-auto">
          <h2 class="font-bold text-[#3f573e] text-center font-grotesk mb-12" style={{ "font-size": "var(--font-size-section)" }}>
            Frequently Asked Questions
          </h2>
          <div class="space-y-6">
            <details class="bg-white rounded-2xl p-8 shadow-sm border border-[#fff0cb]/30 group">
              <summary class="font-semibold text-[#3f573e] cursor-pointer flex items-center justify-between">
                {translation().aiOrchestration.faq.q1}
                <span class="transition-transform group-open:rotate-180">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </span>
              </summary>
              <p class="text-[#6b7280] mt-4 leading-relaxed">{translation().aiOrchestration.faq.a1}</p>
            </details>

            <details class="bg-white rounded-2xl p-8 shadow-sm border border-[#fff0cb]/30 group">
              <summary class="font-semibold text-[#3f573e] cursor-pointer flex items-center justify-between">
                {translation().aiOrchestration.faq.q2}
                <span class="transition-transform group-open:rotate-180">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </span>
              </summary>
              <p class="text-[#6b7280] mt-4 leading-relaxed">{translation().aiOrchestration.faq.a2}</p>
            </details>

            <details class="bg-white rounded-2xl p-8 shadow-sm border border-[#fff0cb]/30 group">
              <summary class="font-semibold text-[#3f573e] cursor-pointer flex items-center justify-between">
                {translation().aiOrchestration.faq.q3}
                <span class="transition-transform group-open:rotate-180">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </span>
              </summary>
              <p class="text-[#6b7280] mt-4 leading-relaxed">{translation().aiOrchestration.faq.a3}</p>
            </details>

            <details class="bg-white rounded-2xl p-8 shadow-sm border border-[#fff0cb]/30 group">
              <summary class="font-semibold text-[#3f573e] cursor-pointer flex items-center justify-between">
                {translation().aiOrchestration.faq.q4}
                <span class="transition-transform group-open:rotate-180">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </span>
              </summary>
              <p class="text-[#6b7280] mt-4 leading-relaxed">{translation().aiOrchestration.faq.a4}</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="px-6 py-20 bg-gradient-to-br from-[#cc6c11]/10 to-[#cc6c11]/5">
        <div class="max-w-4xl mx-auto text-center space-y-6">
          <h2 class="font-bold text-[#3f573e] font-grotesk" style={{ "font-size": "var(--font-size-section)" }}>
            Ready to Master AI Orchestration?
          </h2>
          <p class="text-[#6b7280] text-lg leading-relaxed">
            Join hundreds of engineers building the future of intelligent systems. Whether you're just starting or shipping to production, there's a place for you in our community.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <a
              href="https://www.meetup.com/biere-code-beer-paris/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-[#cc6c11] hover:bg-[#e07d1c] text-white font-semibold px-10 py-4 rounded-[100px] shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              {translation().aiOrchestration.cta.primary}
            </a>
            <a
              href="/about"
              class="inline-block bg-white hover:bg-[#f6f3ec] text-[#3f573e] font-semibold px-10 py-4 rounded-[100px] shadow-sm border-2 border-[#fff0cb] transition-all duration-300 hover:shadow-md"
            >
              {translation().aiOrchestration.cta.secondary}
            </a>
          </div>
        </div>
      </section>

      {props.children}
    </div>
  );
}

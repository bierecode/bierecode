import type { JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import en from '../../../../../locales/en.json';
import fr from '../../../../../locales/fr.json';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

interface Translation {
  title: string;
  tagline: string;
  description: string;
  socialProof: string;
  meetupLink: string;
  updatesLink: string;
  aboutLink: string;
  language: string;
  french: string;
  english: string;
  events: {
    title: string;
    monthly: {
      title: string;
      description: string;
      cta: string;
    };
    updates: {
      title: string;
      description: string;
      cta: string;
    };
    community: {
      title: string;
      description: string;
      cta: string;
    };
  };
  firstTime: {
    title: string;
    subtitle: string;
    points: string[];
  };
  why: {
    title: string;
    learnTogether: {
      title: string;
      description: string;
    };
    relax: {
      title: string;
      description: string;
    };
    network: {
      title: string;
      description: string;
    };
  };
}

function detectLocale(): 'fr' | 'en' {
  if (typeof window !== 'undefined' && navigator) {
    const locales = navigator.languages || [navigator.language];
    const found = locales.find((locale) => ['fr', 'en'].includes(locale.split('-')[0]));
    return found ? (found.split('-')[0] as 'fr' | 'en') : 'fr';
  }
  return 'fr';
}

const translations: Record<'fr' | 'en', Translation> = { fr, en };

export function Homepage(props: { children?: JSX.Element }): JSX.Element {
  const [lang, setLang] = createSignal<'fr' | 'en'>('fr');
  const translation = () => translations[lang()] ?? translations['fr'];

  onMount(() => {
    const applyLang = () => {
      const newLang = detectLocale();
      console.log('Applying language:', newLang);
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
      <section class="pt-32 px-6" style={{ "padding-bottom": "var(--spacing-hero-bottom)" }}>
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <img 
            src="/logo.svg" 
            alt="Bière Code Logo" 
            width={120} 
            height={120}
            class="mx-auto opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
          />
          <div class="space-y-6">
            <p class="text-sm uppercase tracking-[0.4em] text-[#cc6c11] font-semibold">{translation().tagline}</p>
            <h1 class="font-bold text-[#3f573e] leading-[1.2] font-grotesk" style={{ "font-size": "var(--font-size-hero)" }}>{translation().title}</h1>
            <p class="text-[#6b7280] leading-[1.7] max-w-2xl mx-auto" style={{ "font-size": "var(--font-size-hero-desc)" }}>{translation().description}</p>
            <div class="flex flex-col items-center gap-4 pt-4">
              <a
                href="https://www.meetup.com/biere-code-beer-paris/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block bg-[#cc6c11] hover:bg-[#e07d1c] text-white font-semibold px-10 py-4 rounded-[100px] shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                {translation().meetupLink}
              </a>
              <p class="text-sm font-medium text-[#cc6c11]">{translation().socialProof}</p>
            </div>
          </div>
        </div>
      </section>

      {/* First Time Callout */}
      <section class="px-6 pb-16">
        <div class="max-w-4xl mx-auto">
          <div class="bg-[#fff0cb]/30 border-2 border-[#fff0cb] rounded-3xl p-8 md:p-10">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <div class="flex-1 space-y-4">
                <div>
                  <h3 class="text-xl md:text-2xl font-bold text-[#3f573e] font-grotesk">{translation().firstTime.title}</h3>
                  <p class="text-base font-medium text-[#6b7280] mt-1">{translation().firstTime.subtitle}</p>
                </div>
                <ul class="space-y-3">
                  {translation().firstTime.points.map((point) => (
                    <li class="flex items-start gap-3">
                      <svg class="w-5 h-5 text-[#cc6c11] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-[#6b7280] leading-[1.65]">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Cards Section */}
      <section class="px-6" style={{ "padding-bottom": "var(--spacing-section)" }}>
        <div class="max-w-6xl mx-auto">
          <h2 class="font-bold text-[#3f573e] text-center font-grotesk" style={{ "font-size": "var(--font-size-section)", "margin-bottom": "var(--spacing-large)" }}>{translation().events.title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Monthly Meetups Card - Primary CTA */}
            <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#cc6c11]/10">
                <svg class="w-7 h-7 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>{translation().events.monthly.title}</h3>
              <p class="text-[#6b7280] leading-[1.65] mb-8 flex-grow">{translation().events.monthly.description}</p>
              <a
                href="https://www.meetup.com/biere-code-beer-paris/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block text-center bg-[#cc6c11] hover:bg-[#e07d1c] text-white font-semibold px-8 py-4 rounded-[100px] shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
              >
                {translation().events.monthly.cta}
              </a>
            </article>

            {/* Community Updates Card */}
            <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#1f7cec]/10">
                <svg class="w-7 h-7 text-[#1f7cec]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                </svg>
              </div>
              <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>{translation().events.updates.title}</h3>
              <p class="text-[#6b7280] leading-[1.65] mb-8 flex-grow">{translation().events.updates.description}</p>
              <a
                href="/updates"
                class="inline-block text-center bg-[#f6f3ec] hover:bg-[#3993ff] hover:text-white text-[#3f573e] font-semibold px-8 py-4 rounded-[100px] shadow-sm border border-[#fff0cb] transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                {translation().events.updates.cta}
              </a>
            </article>

            {/* Community Card */}
            <article class="bg-white rounded-3xl p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div class="w-12 h-12 mb-6 flex items-center justify-center rounded-2xl bg-[#3f573e]/10">
                <svg class="w-7 h-7 text-[#3f573e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="font-bold text-[#3f573e] mb-4 font-grotesk" style={{ "font-size": "var(--font-size-card-title)" }}>{translation().events.community.title}</h3>
              <p class="text-[#6b7280] leading-[1.65] mb-8 flex-grow">{translation().events.community.description}</p>
              <a
                href="/about"
                class="inline-block text-center bg-[#f6f3ec] hover:bg-[#3993ff] hover:text-white text-[#3f573e] font-semibold px-8 py-4 rounded-[100px] shadow-sm border border-[#fff0cb] transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
              >
                {translation().events.community.cta}
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* Why Bière & Code Section */}
      <section class="px-6" style={{ "padding-top": "var(--spacing-section)", "padding-bottom": "var(--spacing-section)" }}>
        <div class="max-w-6xl mx-auto">
          <h2 class="font-bold text-[#3f573e] text-center font-grotesk" style={{ "font-size": "var(--font-size-section)", "margin-bottom": "var(--spacing-large)" }}>{translation().why.title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Learn Together */}
            <div class="text-center space-y-4">
              <div class="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[#cc6c11]/10">
                <svg class="w-8 h-8 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-[#3f573e] font-grotesk">{translation().why.learnTogether.title}</h3>
              <p class="text-[#6b7280] leading-[1.7]">{translation().why.learnTogether.description}</p>
            </div>

            {/* Relax & Connect */}
            <div class="text-center space-y-4">
              <div class="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[#1f7cec]/10">
                <svg class="w-8 h-8 text-[#1f7cec]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-[#3f573e] font-grotesk">{translation().why.relax.title}</h3>
              <p class="text-[#6b7280] leading-[1.7]">{translation().why.relax.description}</p>
            </div>

            {/* Grow Your Network */}
            <div class="text-center space-y-4">
              <div class="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-[#3f573e]/10">
                <svg class="w-8 h-8 text-[#3f573e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-[#3f573e] font-grotesk">{translation().why.network.title}</h3>
              <p class="text-[#6b7280] leading-[1.7]">{translation().why.network.description}</p>
            </div>
          </div>
        </div>
      </section>

      {props.children}
    </div>
  );
}

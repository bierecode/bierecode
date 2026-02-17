import type { JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import en from '../../../../../locales/en.json';
import fr from '../../../../../locales/fr.json';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

interface Translation {
  title: string;
  tagline: string;
  description: string;
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
}

import '/src/components/pages/homepage/components/homepage/logo-wiggle.css';

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
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#fff0cb]/30">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Bière Code Logo" width={40} height={40} />
            <span class="text-lg font-bold text-[#3f573e] font-grotesk hidden sm:block">Bière & Code</span>
          </a>
          <nav class="flex items-center gap-6">
            <a href="/about" class="text-sm font-medium text-[#3f573e] hover:text-[#cc6c11] transition-colors">{translation().aboutLink}</a>
            <a href="/updates" class="text-sm font-medium text-[#3f573e] hover:text-[#cc6c11] transition-colors">{translation().updatesLink}</a>
            <LanguageSwitcher language={lang()} translation={translation()} onChange={setLang} />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section class="pt-32 pb-16 md:pt-40 md:pb-24 px-6">
        <div class="max-w-4xl mx-auto text-center space-y-6">
          <p class="text-sm uppercase tracking-[0.35em] text-[#cc6c11] font-semibold">{translation().tagline}</p>
          <h1 class="text-4xl md:text-6xl font-bold text-[#3f573e] leading-[1.2] font-grotesk">{translation().title}</h1>
          <p class="text-lg md:text-xl text-[#6b7280] leading-[1.6] max-w-2xl mx-auto">{translation().description}</p>
        </div>
      </section>

      {/* Event Cards Section */}
      <section class="pb-20 px-6">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-bold text-[#3f573e] text-center mb-12 font-grotesk">{translation().events.title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Monthly Meetups Card */}
            <article class="bg-white rounded-3xl p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col">
              <h3 class="text-xl font-bold text-[#3f573e] mb-4 font-grotesk">{translation().events.monthly.title}</h3>
              <p class="text-[#6b7280] leading-relaxed mb-6 flex-grow">{translation().events.monthly.description}</p>
              <a
                href="https://www.meetup.com/biere-code-beer-paris/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-block text-center bg-[#cc6c11] hover:bg-[#e07d1c] text-white font-semibold px-6 py-3 rounded-[100px] shadow-md transition-all duration-300 hover:shadow-lg"
              >
                {translation().events.monthly.cta}
              </a>
            </article>

            {/* Community Updates Card */}
            <article class="bg-white rounded-3xl p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col">
              <h3 class="text-xl font-bold text-[#3f573e] mb-4 font-grotesk">{translation().events.updates.title}</h3>
              <p class="text-[#6b7280] leading-relaxed mb-6 flex-grow">{translation().events.updates.description}</p>
              <a
                href="/updates"
                class="inline-block text-center bg-[#f6f3ec] hover:bg-[#3993ff] hover:text-white text-[#3f573e] font-semibold px-6 py-3 rounded-[100px] shadow-md transition-all duration-300 hover:shadow-lg"
              >
                {translation().events.updates.cta}
              </a>
            </article>

            {/* Community Card */}
            <article class="bg-white rounded-3xl p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col">
              <h3 class="text-xl font-bold text-[#3f573e] mb-4 font-grotesk">{translation().events.community.title}</h3>
              <p class="text-[#6b7280] leading-relaxed mb-6 flex-grow">{translation().events.community.description}</p>
              <a
                href="/about"
                class="inline-block text-center bg-[#f6f3ec] hover:bg-[#3993ff] hover:text-white text-[#3f573e] font-semibold px-6 py-3 rounded-[100px] shadow-md transition-all duration-300 hover:shadow-lg"
              >
                {translation().events.community.cta}
              </a>
            </article>
          </div>
        </div>
      </section>

      {props.children}
    </div>
  );
}

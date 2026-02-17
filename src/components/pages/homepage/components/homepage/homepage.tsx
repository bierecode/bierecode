import type { JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import en from '../../../../../locales/en.json';
import fr from '../../../../../locales/fr.json';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

interface Translation {
  title: string;
  description: string;
  meetupLink: string;
  updatesLink: string;
  aboutLink: string;
  language: string;
  french: string;
  english: string;
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
    <div class="flex flex-col items-center justify-center min-h-screen gap-16 p-8 md:p-16 bg-gradient-to-br from-[#fff0cb] via-[#f6f3ec] to-white text-[#3f573e]">
      <img
        src="/logo.svg"
        alt="Bière Code Logo"
        class="logo-wiggle mb-0"
        width={140}
        height={140}
        loading="eager"
        aria-hidden="false"
      />
      <div class="fixed top-4 right-4 z-50">
      <LanguageSwitcher language={lang()} translation={translation()} onChange={setLang} />
      </div>
      <div class="flex flex-col items-center gap-8 max-w-4xl">
        <h1 class="text-4xl md:text-6xl text-center leading-[1.4] font-grotesk font-bold text-[#3f573e]">{translation().title}</h1>
        <p class="text-lg md:text-xl text-center max-w-2xl text-[#6b7280] leading-[1.5]">{translation().description}</p>
      </div>
      <div class="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <a
          href="https://www.meetup.com/biere-code-beer-paris/"
          class="inline-block bg-[#cc6c11] hover:bg-[#e07d1c] text-white font-semibold px-10 py-4 rounded-[100px] shadow-md transition-all duration-300 hover:shadow-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translation().meetupLink}
        </a>
        <a
          href="/updates"
          class="inline-block bg-[#f6f3ec] hover:bg-[#3993ff] hover:text-white text-[#3f573e] font-semibold px-10 py-4 rounded-[100px] shadow-md transition-all duration-300 hover:shadow-lg"
        >
          {translation().updatesLink}
        </a>
        <a
          href="/about"
          class="inline-block bg-[#f6f3ec] hover:bg-[#3993ff] hover:text-white text-[#3f573e] font-semibold px-10 py-4 rounded-[100px] shadow-md transition-all duration-300 hover:shadow-lg"
        >
          {translation().aboutLink}
        </a>
      </div>
      {props.children}
    </div>
  );
}

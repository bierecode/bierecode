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

export function Homepage(): JSX.Element {
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
    <div class="flex flex-col items-center justify-center min-h-screen gap-10 p-8 bg-gradient-to-br from-yellow-100 to-white text-gray-800">
      <img
        src="/logo.svg"
        alt="Bière Code Logo"
        class="logo-wiggle mb-4"
        width={120}
        height={120}
        loading="eager"
        aria-hidden="false"
      />
      <div class="fixed top-4 right-4 z-50">
      <LanguageSwitcher language={lang()} translation={translation()} onChange={setLang} />
      </div>
      <h1 class="text-5xl text-center tracking-tight leading-tight font-grotesk font-bold">{translation().title}</h1>
      <p class="text-xl text-center max-w-2xl text-gray-700">{translation().description}</p>
      <div class="flex flex-col md:flex-row items-center gap-4">
        <a
          href="https://www.meetup.com/biere-code-beer-paris/"
          class="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105"
          target="_blank"
          rel="noopener noreferrer"
        >
          {translation().meetupLink}
        </a>
        <a
          href="/updates"
          class="inline-block border border-yellow-400 text-yellow-800 font-semibold px-8 py-4 rounded-full shadow-lg/10 hover:bg-yellow-100 transition-all transform hover:scale-105"
        >
          {translation().updatesLink}
        </a>
      </div>
      <div class="flex space-x-6 mt-8">
        <a 
          href="https://github.com/bierecode" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-gray-400 hover:text-yellow-600 transition-colors duration-300"
          aria-label="Follow us on GitHub"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
          </svg>
        </a>
        <a 
          href="https://www.meetup.com/biere-code-beer-paris/" 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-gray-400 hover:text-yellow-600 transition-colors duration-300"
          aria-label="Follow us on Meetup"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.98 9.9c0-.53.43-.96.96-.96s.96.43.96.96-.43.96-.96.96-.96-.43-.96-.96zm10.55 0c0 .53-.43.96-.96.96s-.96-.43-.96-.96.43-.96.96-.96.96.43.96.96zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8 0-.34.03-.67.07-.99 1.98.76 2.69 1.97 4.46 3.16 1.77 1.19 2.94.88 5.17.88s3.4.31 5.17-.88c1.77-1.19 2.48-2.4 4.46-3.16.04.32.07.65.07.99 0 4.411-3.589 8-8 8z" />
          </svg>
        </a>
      </div>
    </div>
  );
}

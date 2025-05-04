import type { JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import en from '../../../../../locales/en.json';
import fr from '../../../../../locales/fr.json';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import Markdown from 'solid-markdown';

interface Translation {
  title: string;
  description: string;
  meetupLink: string;
  language: string;
  french: string;
  english: string;
  host: string;
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

  console.log('@@ language: ', translation().description);

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
      <Markdown class="text-base text-center max-w-2xl text-gray-600" children={translation().host} />
      <a
        href="https://www.meetup.com/biere-code-beer-paris/"
        class="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105"
        target="_blank"
        rel="noopener noreferrer"
      >
        {translation().meetupLink}
      </a>
    </div>
  );
}

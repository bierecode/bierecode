import { createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import fr from '../../../../../locales/fr.json';
import en from '../../../../../locales/en.json';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

interface Translation {
  title: string;
  description: string;
  meetupLink: string;
  language: string;
  french: string;
  english: string;
}

export function Homepage(): JSX.Element {
  const [lang, setLang] = createSignal<'fr' | 'en'>('fr');
  const translations: Record<'fr' | 'en', Translation> = { fr, en };
  const t = () => translations[lang()] ?? translations['fr'];

  return (
    <div class="flex flex-col items-center justify-center min-h-screen gap-10 p-8 bg-gradient-to-br from-yellow-100 to-white text-gray-800">
      <div class="self-end">
        <LanguageSwitcher lang={lang()} t={t()} onChange={setLang} />
      </div>
      <h1 class="text-5xl text-center tracking-tight leading-tight font-grotesk font-bold">{t().title}</h1>
      <p class="text-xl text-center max-w-2xl text-gray-700">{t().description}</p>
      <a
        href="https://www.meetup.com/biere-code-beer-paris/"
        class="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all transform hover:scale-105"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t().meetupLink}
      </a>
    </div>
  );
}

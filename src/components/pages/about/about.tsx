import type { JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import en from '../../../locales/en.json';
import fr from '../../../locales/fr.json';
import { LanguageSwitcher } from '../homepage/components/language-switcher/language-switcher';
import raphImg from '../../../assets/raph.jpg';
import miguelImg from '../../../assets/miguel.jpg';

interface Translation {
  title: string;
  description: string;
  meetupLink: string;
  updatesLink: string;
  aboutLink: string;
  language: string;
  french: string;
  english: string;
  about: {
    title: string;
    description: string;
    raph: {
      role: string;
      bio: string;
    };
    miguel: {
      role: string;
      bio: string;
    };
  };
}

const translations: Record<'fr' | 'en', Translation> = { fr, en } as any;

function detectLocale(): 'fr' | 'en' {
  if (typeof window !== 'undefined' && navigator) {
    const locales = navigator.languages || [navigator.language];
    const found = locales.find((locale) => ['fr', 'en'].includes(locale.split('-')[0]));
    return found ? (found.split('-')[0] as 'fr' | 'en') : 'fr';
  }
  return 'fr';
}

export function AboutPage(): JSX.Element {
  const [lang, setLang] = createSignal<'fr' | 'en'>('fr');
  const translation = () => translations[lang()] ?? translations['fr'];

  onMount(() => {
    const applyLang = () => {
      const newLang = detectLocale();
      setLang(newLang);
    };
    applyLang();
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-white text-gray-800 relative">
       <div class="fixed top-4 right-4 z-50">
          <LanguageSwitcher language={lang()} translation={translation()} onChange={setLang} />
       </div>
       
       <div class="container mx-auto px-6 py-16 max-w-4xl">
          <div class="flex flex-col items-center mb-12">
             <a href="/" class="mb-8 hover:opacity-80 transition-opacity">
                <img src="/logo.svg" alt="Bière Code Logo" width={80} height={80} />
             </a>
             <h1 class="text-5xl font-bold font-grotesk mb-4 text-center">{translation().about.title}</h1>
             <p class="text-xl text-gray-600 text-center max-w-2xl">{translation().about.description}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Raph */}
            <div class="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-xl border border-yellow-100/50 hover:shadow-2xl transition-shadow duration-300">
                <div class="w-32 h-32 rounded-full mb-6 overflow-hidden border-4 border-white shadow-md">
                    <img src={raphImg.src} alt="Raph" class="w-full h-full object-cover" />
                </div>
                <h2 class="text-2xl font-bold mb-1">Raph</h2>
                <p class="text-yellow-600 font-medium mb-4">{translation().about.raph.role}</p>
                <p class="text-gray-600 leading-relaxed mb-6 flex-grow">{translation().about.raph.bio}</p>
                
                <div class="mt-auto flex gap-4">
                    <a href="https://www.linkedin.com/in/raphaeltm/" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#0077b5] transition-colors p-2">
                        <span class="sr-only">LinkedIn</span>
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" /></svg>
                    </a>
                    <a href="https://ontech.raphaeltm.com/" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-900 transition-colors p-2">
                        <span class="sr-only">Website</span>
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    </a>
                </div>
            </div>

            {/* Miguel */}
            <div class="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-xl border border-yellow-100/50 hover:shadow-2xl transition-shadow duration-300">
                <div class="w-32 h-32 rounded-full mb-6 overflow-hidden border-4 border-white shadow-md">
                    <img src={miguelImg.src} alt="Miguel" class="w-full h-full object-cover" />
                </div>
                <h2 class="text-2xl font-bold mb-1">Miguel</h2>
                <p class="text-blue-600 font-medium mb-4">{translation().about.miguel.role}</p>
                <p class="text-gray-600 leading-relaxed mb-6 flex-grow">{translation().about.miguel.bio}</p>
                
                <div class="mt-auto flex gap-4">
                    <a href="https://www.linkedin.com/in/mliezun/" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#0077b5] transition-colors p-2">
                         <span class="sr-only">LinkedIn</span>
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" /></svg>
                    </a>
                    <a href="https://mliezun.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-900 transition-colors p-2">
                        <span class="sr-only">Website</span>
                         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    </a>
                </div>
            </div>
          </div>
       </div>
    </div>
  );
}


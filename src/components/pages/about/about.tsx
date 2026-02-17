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
    <div class="min-h-screen bg-gradient-to-br from-[#fff0cb] via-[#f6f3ec] to-white">
      {/* Navigation Header */}
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#fff0cb]/50 shadow-sm">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
            <img src="/logo.svg" alt="Bière Code Logo" width={44} height={44} />
            <span class="text-xl font-bold text-[#3f573e] font-grotesk hidden sm:block">Bière & Code</span>
          </a>
          <nav class="flex items-center gap-8">
            <a href="/about" class="text-sm font-medium text-[#cc6c11] transition-colors duration-300 relative">
              {translation().aboutLink}
              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-[#cc6c11]"></span>
            </a>
            <a href="/updates" class="text-sm font-medium text-[#3f573e] hover:text-[#cc6c11] transition-colors duration-300 relative group">
              {translation().updatesLink}
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#cc6c11] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <LanguageSwitcher language={lang()} translation={translation()} onChange={setLang} />
          </nav>
        </div>
      </header>
       
       <div class="container mx-auto px-6 md:px-16 pt-32 pb-20 max-w-5xl">
          <div class="flex flex-col items-center text-center" style={{ "margin-bottom": "var(--spacing-large)" }}>
             <h1 class="font-bold font-grotesk mb-6 text-[#3f573e]" style={{ "font-size": "var(--font-size-section)" }}>{translation().about.title}</h1>
             <p class="text-[#6b7280] max-w-2xl leading-[1.7]" style={{ "font-size": "var(--font-size-body)" }}>{translation().about.description}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Raph */}
            <div class="flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300">
                <div class="w-32 h-32 rounded-full mb-6 overflow-hidden border-4 border-[#f6f3ec] shadow-sm">
                    <img src={raphImg.src} alt="Raph" class="w-full h-full object-cover" />
                </div>
                <h2 class="text-2xl font-bold mb-1 text-[#3f573e] font-grotesk">Raph</h2>
                <p class="text-[#cc6c11] font-semibold mb-4">{translation().about.raph.role}</p>
                <p class="text-[#6b7280] leading-[1.65] mb-6 flex-grow">{translation().about.raph.bio}</p>
                
                <div class="mt-auto flex gap-4">
                    <a href="https://www.linkedin.com/in/raphaeltm/" target="_blank" rel="noopener noreferrer" class="text-[#6b7280] hover:text-[#0077b5] transition-colors duration-300 p-2 hover:scale-110">
                        <span class="sr-only">LinkedIn</span>
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" /></svg>
                    </a>
                    <a href="https://ontech.raphaeltm.com/" target="_blank" rel="noopener noreferrer" class="text-[#6b7280] hover:text-[#3f573e] transition-colors duration-300 p-2 hover:scale-110">
                        <span class="sr-only">Website</span>
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    </a>
                </div>
            </div>

            {/* Miguel */}
            <div class="flex flex-col items-center text-center p-10 bg-white rounded-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] border border-[#fff0cb]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] hover:bg-[#fff0cb]/10 hover:-translate-y-1 transition-all duration-300">
                <div class="w-32 h-32 rounded-full mb-6 overflow-hidden border-4 border-[#f6f3ec] shadow-sm">
                    <img src={miguelImg.src} alt="Miguel" class="w-full h-full object-cover" />
                </div>
                <h2 class="text-2xl font-bold mb-1 text-[#3f573e] font-grotesk">Miguel</h2>
                <p class="text-[#1f7cec] font-semibold mb-4">{translation().about.miguel.role}</p>
                <p class="text-[#6b7280] leading-[1.65] mb-6 flex-grow">{translation().about.miguel.bio}</p>
                
                <div class="mt-auto flex gap-4">
                    <a href="https://www.linkedin.com/in/mliezun/" target="_blank" rel="noopener noreferrer" class="text-[#6b7280] hover:text-[#0077b5] transition-colors duration-300 p-2 hover:scale-110">
                         <span class="sr-only">LinkedIn</span>
                        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" /></svg>
                    </a>
                    <a href="https://mliezun.com" target="_blank" rel="noopener noreferrer" class="text-[#6b7280] hover:text-[#3f573e] transition-colors duration-300 p-2 hover:scale-110">
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

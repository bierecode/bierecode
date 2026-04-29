import type { JSX } from 'solid-js';
import { createSignal, onMount, Show } from 'solid-js';
import en from '../../../locales/en.json';
import fr from '../../../locales/fr.json';
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
    stats: {
      members: string;
      membersLabel: string;
      regulars: string;
      regularsLabel: string;
      meetups: string;
      meetupsLabel: string;
    };
    story: {
      title: string;
      description: string;
    };
    venue: {
      title: string;
      description: string;
    };
    raph: { role: string; bio: string };
    miguel: { role: string; bio: string };
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
  const [menuOpen, setMenuOpen] = createSignal(false);
  const t = () => translations[lang()] ?? translations['fr'];

  onMount(() => {
    setLang(detectLocale());
  });

  const toggleLang = () => setLang(lang() === 'fr' ? 'en' : 'fr');

  return (
    <div class="min-h-screen bg-white">
      {/* Navigation Header */}
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity duration-300">
            <img src="/logo.svg" alt="Biere Code Logo" width={40} height={40} />
            <span class="text-xl font-bold text-[#1a1a1a] font-grotesk hidden sm:block">Biere & Code</span>
          </a>

          {/* Desktop nav */}
          <nav class="hidden md:flex items-center gap-8">
            <a href="/about" class="text-sm font-medium text-[#1a1a1a] transition-colors duration-200 relative">
              {t().aboutLink}
              <span class="absolute bottom-0 left-0 w-full h-0.5 bg-[#1a1a1a]"></span>
            </a>
            <a href="/updates" class="text-sm font-medium text-gray-600 hover:text-[#1a1a1a] transition-colors duration-200">
              {t().updatesLink}
            </a>
            <button
              onClick={toggleLang}
              class="text-xs font-bold text-gray-500 hover:text-[#1a1a1a] border border-gray-200 rounded-full px-3 py-1.5 transition-colors duration-200"
            >
              {lang() === 'fr' ? 'EN' : 'FR'}
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            class="md:hidden p-2 text-gray-600 hover:text-[#1a1a1a]"
            onClick={() => setMenuOpen(!menuOpen())}
            aria-label="Toggle menu"
          >
            <Show when={!menuOpen()} fallback={
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            }>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Show>
          </button>
        </div>

        {/* Mobile menu */}
        <Show when={menuOpen()}>
          <div class="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
            <a href="/about" class="block text-sm font-medium text-[#1a1a1a] py-2">{t().aboutLink}</a>
            <a href="/updates" class="block text-sm font-medium text-gray-600 hover:text-[#1a1a1a] py-2">{t().updatesLink}</a>
            <button
              onClick={toggleLang}
              class="text-xs font-bold text-gray-500 hover:text-[#1a1a1a] border border-gray-200 rounded-full px-3 py-1.5"
            >
              {lang() === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
        </Show>
      </header>

      <div class="max-w-5xl mx-auto px-6 md:px-16 pt-28 pb-20">
        {/* Title */}
        <div class="text-center mb-12">
          <h1 class="text-3xl md:text-4xl font-bold font-grotesk text-[#1a1a1a] mb-4">{t().about.title}</h1>
          <p class="text-gray-500 max-w-2xl mx-auto text-lg">{t().about.description}</p>
        </div>

        {/* Stats Bar */}
        <div class="grid grid-cols-3 gap-4 mb-16">
          <div class="text-center py-6 bg-gray-50 rounded-xl">
            <p class="text-3xl md:text-4xl font-bold text-[#1a1a1a] font-grotesk">{t().about.stats.members}</p>
            <p class="text-sm text-gray-500 mt-1">{t().about.stats.membersLabel}</p>
          </div>
          <div class="text-center py-6 bg-gray-50 rounded-xl">
            <p class="text-3xl md:text-4xl font-bold text-[#1a1a1a] font-grotesk">{t().about.stats.regulars}</p>
            <p class="text-sm text-gray-500 mt-1">{t().about.stats.regularsLabel}</p>
          </div>
          <div class="text-center py-6 bg-gray-50 rounded-xl">
            <p class="text-3xl md:text-4xl font-bold text-[#1a1a1a] font-grotesk">{t().about.stats.meetups}</p>
            <p class="text-sm text-gray-500 mt-1">{t().about.stats.meetupsLabel}</p>
          </div>
        </div>

        {/* Our Story */}
        <div class="mb-16">
          <h2 class="text-2xl font-bold text-[#1a1a1a] font-grotesk mb-4">{t().about.story.title}</h2>
          <p class="text-gray-600 leading-relaxed text-lg">{t().about.story.description}</p>
        </div>

        {/* Where We Meet */}
        <div class="mb-16 bg-gray-50 border border-gray-100 rounded-2xl p-8">
          <h2 class="text-2xl font-bold text-[#1a1a1a] font-grotesk mb-4">{t().about.venue.title}</h2>
          <p class="text-gray-600 leading-relaxed">{t().about.venue.description}</p>
        </div>

        {/* Team */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Raph */}
          <div class="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
            <div class="w-28 h-28 rounded-full mb-5 overflow-hidden border-4 border-gray-50 shadow-sm">
              <img src={raphImg.src} alt="Raph" class="w-full h-full object-cover" />
            </div>
            <h2 class="text-xl font-bold text-[#1a1a1a] font-grotesk">Raph</h2>
            <p class="text-[#cc6c11] font-semibold text-sm mb-3">{t().about.raph.role}</p>
            <p class="text-gray-500 leading-relaxed text-sm flex-grow">{t().about.raph.bio}</p>
            <div class="mt-5 flex gap-3">
              <a href="https://www.linkedin.com/in/raphaeltm/" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#0077b5] transition-colors duration-200 p-1.5">
                <span class="sr-only">LinkedIn</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" /></svg>
              </a>
              <a href="https://ontech.raphaeltm.com/" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#1a1a1a] transition-colors duration-200 p-1.5">
                <span class="sr-only">Website</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </a>
            </div>
          </div>

          {/* Miguel */}
          <div class="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] border border-gray-100 hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300">
            <div class="w-28 h-28 rounded-full mb-5 overflow-hidden border-4 border-gray-50 shadow-sm">
              <img src={miguelImg.src} alt="Miguel" class="w-full h-full object-cover" />
            </div>
            <h2 class="text-xl font-bold text-[#1a1a1a] font-grotesk">Miguel</h2>
            <p class="text-[#cc6c11] font-semibold text-sm mb-3">{t().about.miguel.role}</p>
            <p class="text-gray-500 leading-relaxed text-sm flex-grow">{t().about.miguel.bio}</p>
            <div class="mt-5 flex gap-3">
              <a href="https://www.linkedin.com/in/mliezun/" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#0077b5] transition-colors duration-200 p-1.5">
                <span class="sr-only">LinkedIn</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clip-rule="evenodd" /></svg>
              </a>
              <a href="https://mliezun.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-[#1a1a1a] transition-colors duration-200 p-1.5">
                <span class="sr-only">Website</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

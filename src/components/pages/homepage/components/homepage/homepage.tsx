import type { JSX } from 'solid-js';
import { createSignal, onMount, Show } from 'solid-js';
import en from '../../../../../locales/en.json';
import fr from '../../../../../locales/fr.json';

interface NextEvent {
  badge: string;
  title: string;
  date: string;
  time: string;
  vibe: string;
  description: string;
  cta: string;
}

interface Community {
  title: string;
  description: string;
  cta: string;
}

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
  nextEvent: NextEvent;
  firstTime: {
    title: string;
    subtitle: string;
    points: string[];
  };
  community: Community;
  why: {
    title: string;
    learnTogether: { title: string; description: string };
    relax: { title: string; description: string };
    network: { title: string; description: string };
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

const translations: Record<'fr' | 'en', Translation> = { fr, en } as any;

export function Homepage(props: { children?: JSX.Element }): JSX.Element {
  const [lang, setLang] = createSignal<'fr' | 'en'>('fr');
  const [menuOpen, setMenuOpen] = createSignal(false);
  const t = () => translations[lang()] ?? translations['fr'];

  onMount(() => {
    setLang(detectLocale());
  });

  const toggleLang = () => setLang(lang() === 'fr' ? 'en' : 'fr');

  return (
    <div class="min-h-screen bg-white">
      {/* Navigation */}
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Biere Code Logo" width={36} height={36} />
            <span class="text-lg font-bold text-[#1a1a1a] font-grotesk hidden sm:block">Biere & Code</span>
          </a>

          <nav class="hidden md:flex items-center gap-6">
            <a href="/about" class="text-sm font-medium text-gray-500 hover:text-[#1a1a1a] transition-colors">{t().aboutLink}</a>
            <a href="/updates" class="text-sm font-medium text-gray-500 hover:text-[#1a1a1a] transition-colors">{t().updatesLink}</a>
            <button
              onClick={toggleLang}
              class="text-xs font-bold text-gray-400 hover:text-[#1a1a1a] border border-gray-200 rounded-full px-3 py-1.5 transition-colors"
            >
              {lang() === 'fr' ? 'EN' : 'FR'}
            </button>
          </nav>

          <button
            class="md:hidden p-2 text-gray-500 hover:text-[#1a1a1a]"
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

        <Show when={menuOpen()}>
          <div class="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">
            <a href="/about" class="block text-sm font-medium text-gray-500 hover:text-[#1a1a1a] py-2">{t().aboutLink}</a>
            <a href="/updates" class="block text-sm font-medium text-gray-500 hover:text-[#1a1a1a] py-2">{t().updatesLink}</a>
            <button
              onClick={toggleLang}
              class="text-xs font-bold text-gray-400 hover:text-[#1a1a1a] border border-gray-200 rounded-full px-3 py-1.5"
            >
              {lang() === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
        </Show>
      </header>

      {/* Hero */}
      <section class="pt-32 pb-12 px-6">
        <div class="max-w-3xl mx-auto text-center space-y-5">
          <p class="text-sm uppercase tracking-[0.3em] text-[#cc6c11] font-semibold">{t().tagline}</p>
          <h1 class="font-bold text-[#1a1a1a] leading-[1.05] font-grotesk" style={{ "font-size": "clamp(2.5rem, 6vw, 4rem)" }}>
            {t().title}
          </h1>
          <p class="text-gray-500 leading-relaxed max-w-xl mx-auto text-lg">{t().description}</p>
          <div class="flex flex-col items-center gap-3 pt-2">
            <a
              href="https://www.meetup.com/biere-code-beer-paris/"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block bg-[#1a1a1a] hover:bg-[#333] text-white font-semibold px-10 py-4 rounded-full transition-all duration-200 hover:scale-[1.02]"
            >
              {t().meetupLink}
            </a>
            <p class="text-sm font-medium text-[#cc6c11]">{t().socialProof}</p>
          </div>
        </div>
      </section>

      {/* Next Event */}
      <section class="px-6 pb-16">
        <div class="max-w-3xl mx-auto">
          <div class="border-2 border-[#cc6c11] rounded-2xl p-8 md:p-10 relative">
            <span class="absolute -top-3.5 left-6 bg-[#cc6c11] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              {t().nextEvent.badge}
            </span>
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-2">
              <div class="space-y-3">
                <h2 class="text-2xl md:text-3xl font-bold text-[#1a1a1a] font-grotesk">{t().nextEvent.title}</h2>
                <div class="space-y-1.5 text-gray-600">
                  <p class="flex items-center gap-2.5 font-medium">
                    <svg class="w-4.5 h-4.5 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t().nextEvent.date} &middot; {t().nextEvent.time}
                  </p>
                  <p class="flex items-center gap-2.5">
                    <svg class="w-4.5 h-4.5 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t().nextEvent.vibe}
                  </p>
                </div>
                <p class="text-sm text-gray-500">{t().nextEvent.description}</p>
              </div>
              <div class="flex-shrink-0">
                <a
                  href="https://www.meetup.com/biere-code-beer-paris/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block bg-[#cc6c11] hover:bg-[#e07d1c] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.02] whitespace-nowrap"
                >
                  {t().nextEvent.cta}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* First Time */}
      <section class="px-6 pb-16">
        <div class="max-w-3xl mx-auto">
          <div class="bg-gray-50 rounded-2xl p-8 md:p-10">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 mt-0.5">
                <svg class="w-6 h-6 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div class="flex-1 space-y-4">
                <div>
                  <h3 class="text-xl font-bold text-[#1a1a1a] font-grotesk">{t().firstTime.title}</h3>
                  <p class="text-sm font-medium text-gray-400 mt-1">{t().firstTime.subtitle}</p>
                </div>
                <ul class="space-y-2.5">
                  {t().firstTime.points.map((point) => (
                    <li class="flex items-start gap-2.5">
                      <svg class="w-4.5 h-4.5 text-[#cc6c11] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span class="text-gray-600 leading-relaxed text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Biere & Code */}
      <section class="px-6 pb-16">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-[#1a1a1a] text-center font-grotesk mb-10">{t().why.title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center space-y-3">
              <div class="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-[#cc6c11]/10">
                <svg class="w-6 h-6 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-[#1a1a1a] font-grotesk">{t().why.learnTogether.title}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{t().why.learnTogether.description}</p>
            </div>
            <div class="text-center space-y-3">
              <div class="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-[#cc6c11]/10">
                <svg class="w-6 h-6 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-[#1a1a1a] font-grotesk">{t().why.relax.title}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{t().why.relax.description}</p>
            </div>
            <div class="text-center space-y-3">
              <div class="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-[#cc6c11]/10">
                <svg class="w-6 h-6 text-[#cc6c11]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-base font-bold text-[#1a1a1a] font-grotesk">{t().why.network.title}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{t().why.network.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Updates CTA */}
      <section class="px-6 pb-20">
        <div class="max-w-3xl mx-auto text-center space-y-4">
          <h2 class="text-xl font-bold text-[#1a1a1a] font-grotesk">{t().community.title}</h2>
          <p class="text-gray-500 text-sm">{t().community.description}</p>
          <a
            href="/updates"
            class="inline-block border border-gray-200 hover:border-gray-300 text-[#1a1a1a] font-medium px-6 py-2.5 rounded-full text-sm transition-all duration-200"
          >
            {t().community.cta}
          </a>
        </div>
      </section>

      {props.children}
    </div>
  );
}

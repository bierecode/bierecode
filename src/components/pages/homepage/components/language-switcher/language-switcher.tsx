import { createSignal, type Accessor } from 'solid-js';
import type { JSX } from 'solid-js';

interface Props {
  language: 'fr' | 'en';
  translation: {
    language: string;
    french: string;
    english: string;
  };
  onChange?: (lang: 'fr' | 'en') => void;
}

export function LanguageSwitcher(props: Props): JSX.Element {
  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const newLang = target.value as 'fr' | 'en';
    props.onChange?.(newLang);
  };

  return (
    <div class="flex min-w-0 items-center gap-2 rounded-full border border-[#fff0cb]/50 bg-[#f6f3ec]/90 px-3 py-2 shadow-sm backdrop-blur-md sm:px-4">
      <label for="lang-select" class="hidden text-sm font-medium text-[#3f573e] sm:block">{props.translation.language}</label>
      <select
        id="lang-select"
        value={props.language}
        onInput={handleChange}
        aria-label={props.translation.language}
        class="min-w-0 rounded-full border border-[#d8d1c3] bg-white/80 px-3 py-2 text-sm font-medium text-[#3f573e] focus:outline-none focus:ring-2 focus:ring-[#cc6c11]/30 sm:border-none sm:bg-transparent sm:px-1 sm:py-1 sm:focus:ring-0"
      >
        <option value="fr">{props.translation.french}</option>
        <option value="en">{props.translation.english}</option>
      </select>
    </div>
  );
}

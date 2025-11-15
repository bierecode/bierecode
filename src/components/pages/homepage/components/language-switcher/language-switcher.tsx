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
    <div class="flex items-center gap-2 pl-4 pr-2 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-md">
      <label for="lang-select" class="text-sm font-medium text-gray-700">{props.translation.language}</label>
      <select
        id="lang-select"
        value={props.language}
        onInput={handleChange}
        class="border-none bg-transparent text-sm px-3 py-1 focus:outline-none"
      >
        <option value="fr">{props.translation.french}</option>
        <option value="en">{props.translation.english}</option>
      </select>
    </div>
  );
}

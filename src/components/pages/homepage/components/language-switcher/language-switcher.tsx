import { createSignal } from 'solid-js';
import type { JSX } from 'solid-js';

interface Props {
  lang: string;
  t: {
    language: string;
    french: string;
    english: string;
  };
  onChange?: (lang: string) => void;
}

export function LanguageSwitcher(props: Props): JSX.Element {
  const [lang, setLang] = createSignal(props.lang || 'fr');

  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const newLang = target.value;
    setLang(newLang);
    props.onChange?.(newLang);
  };

  return (
    <div class="flex items-center gap-2 pl-4 pr-2 py-2 bg-white/70 backdrop-blur-md rounded-full shadow-md">
      <label for="lang-select" class="text-sm font-medium text-gray-700">{props.t.language}</label>
      <select
        id="lang-select"
        value={lang()}
        onInput={handleChange}
        class="border-none bg-transparent text-sm px-3 py-1 focus:outline-none"
      >
        <option value="fr">{props.t.french}</option>
        <option value="en">{props.t.english}</option>
      </select>
    </div>
  );
}

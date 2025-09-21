import englishTranslation from '../translations/english.json';
import polishTranslation from '../translations/polish.json';
import germanTranslation from '../translations/german.json';
import ptbrTranslation from '../translations/pt-br.json';
import spanishTranslation from '../translations/spanish.json';

export interface Language {
  id: string;
  name: string;
  translations: { [key: string]: string };
}

export const languages: Language[] = [
  { id: 'en', name: 'English', translations: englishTranslation },
  { id: 'pl', name: 'Polski', translations: polishTranslation },
  { id: 'de', name: 'Deutsch', translations: germanTranslation },
  { id: 'pt-br', name: 'Português (Brasil)', translations: ptbrTranslation },
  { id: 'es', name: 'Español', translations: spanishTranslation },
];

export function tl(language: Language, text: string, params?: string[]) {
  if (!params) params = [];
  text =
    language.translations[text] ||
    languages.find((language) => language.id === 'en')?.translations[text] ||
    text;
  params.forEach((param, index) => {
    text = text.replace(`{{${index}}}`, param);
  });
  return text;
}

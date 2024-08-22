import englishTranslation from '../translations/english.json'
import polishTranslation from '../translations/polish.json'

export interface Language {
    id: string,
    name: string,
    translations: { [key: string]: string }
}

export const languages: Language[] = [{id: 'en', name: 'English', translations: englishTranslation}, {
    id: 'pl',
    name: 'Polski',
    translations: polishTranslation
}]

export function tl(language: Language, text: string, params?: string[]) {
    if (!params) params = []
    text = language.translations[text] || text
    params.forEach((param, index) => {
        text = text.replace(`{{${index}}}`, param)
    })
    return text
}
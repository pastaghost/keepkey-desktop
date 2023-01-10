import { translations } from 'lib/assets/translations'
import get from 'lodash/get'
import type { InterpolationOptions } from 'node-polyglot'
import { transformPhrase } from 'node-polyglot'
import { I18n } from 'react-polyglot'

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const locale = window.locale || "en";
  const messages = translations[locale]
  const onMissingKey = (key: string, substitutions?: InterpolationOptions) => {
    const translation = get(translations['en'], key)
    return typeof translation === 'string' ? transformPhrase(translation, substitutions) : key
  }
  return (
    <I18n locale={locale} messages={messages} allowMissing={true} onMissingKey={onMissingKey}>
      {children}
    </I18n>
  )
}

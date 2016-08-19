import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .init({
    fallbackLng: 'en',

    ns: ['common'],
    defaultNS: 'common',

    debug: false,

    interpolation: {
      escapeValue: false
    },

    resources: {
      'en': {
        'common': {
          "player": "Player",
          "add_score": "Add score",
          "add_minus_ten": "Add -10",
          "new_player": "new player",
          "reset_scores": "reset scores"
        }
      },
      'es': {
        'common': {
          "player": "Jugador",
          "add_score": "Anotar puntos",
          "add_minus_ten": "Anotar -10",
          "new_player": "añadir jugador",
          "reset_scores": "reiniciar marcadores"
        }
      }
    }
  });

export default i18n;

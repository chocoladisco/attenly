const de = {
  home: {
    tagline:
      'Miss und trainiere deine visuelle Daueraufmerksamkeit mit wissenschaftlich strukturierten Tests.',
    selectTest: 'Test auswählen',
  },
  testSelection: {
    heading: 'Test auswählen',
    configure: 'Konfigurieren',
  },
  testConfiguration: {
    notFound: 'Test nicht gefunden.',
    startTest: 'Test starten',
    back: 'Zurück',
  },
  testScreen: {
    title: 'Test läuft',
    instructions:
      'Leertaste drücken oder klicken, wenn die aktuelle Form mit der vorherigen übereinstimmt',
    abort: 'Abbrechen',
  },
  results: {
    title: 'Ergebnisse',
    noResults: 'Keine Ergebnisse vorhanden.',
    score: 'Punkte',
    accuracy: 'Genauigkeit',
    avgReactionTime: 'Ø Reaktionszeit',
    hits: 'Treffer',
    misses: 'Fehler',
    commissionErrors: 'Falschreaktionen',
    reactionTimeSection: 'Reaktionszeit pro Treffer',
    eventTimelineSection: 'Ereigniszeitlinie',
    noHits: 'Keine Treffer aufgezeichnet.',
    avgMs: 'Ø {{ms}} ms',
    legend: {
      hit: 'Treffer',
      miss: 'Fehler',
      commissionError: 'Falschreaktion',
    },
    home: 'Startseite',
    tryAgain: 'Nochmal versuchen',
    downloadCsv: 'CSV herunterladen',
  },
  tests: {
    vlta: {
      name: 'Visuelles 1-Back',
      description:
        'Formen erscheinen nacheinander. Leertaste drücken, klicken oder tippen, wenn die aktuelle Form mit der vorherigen übereinstimmt. Der Test endet, wenn das Zeitlimit erreicht ist oder zu viele Ziele verpasst wurden.',
    },
  },
  config: {
    maxDurationMin: { label: 'Max. Dauer', unit: 'Minuten' },
    shapeIntervalSec: { label: 'Formintervall', unit: 'Sekunden' },
    shapeDurationMs: { label: 'Anzeigedauer der Form', unit: 'ms' },
    enableMaxMisses: { label: 'Fehler begrenzen' },
    maxFailureCount: { label: 'Max. Fehler' },
  },
  language: {
    en: 'English',
    de: 'Deutsch',
  },
  notFound: '404 - Nicht gefunden',
} as const

export default de

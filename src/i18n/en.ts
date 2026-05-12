const en = {
  home: {
    tagline:
      'Measure and train your visual sustained attention with scientifically structured tests.',
    selectTest: 'Select a Test',
  },
  testSelection: {
    heading: 'Select a Test',
    configure: 'Configure',
  },
  testConfiguration: {
    notFound: 'Test not found.',
    startTest: 'Start Test',
    back: 'Back',
  },
  testScreen: {
    title: 'Test in progress',
    instructions: 'Press Space or click when the shape matches the previous one',
    abort: 'Abort',
  },
  results: {
    title: 'Results',
    noResults: 'No results available.',
    score: 'Score',
    accuracy: 'Accuracy',
    avgReactionTime: 'Avg Reaction Time',
    hits: 'Hits',
    misses: 'Misses',
    commissionErrors: 'Commission Errors',
    reactionTimeSection: 'Reaction time per hit',
    eventTimelineSection: 'Event timeline',
    noHits: 'No hits recorded.',
    avgMs: 'avg {{ms}} ms',
    legend: {
      hit: 'Hit',
      miss: 'Miss',
      commissionError: 'Commission error',
    },
    home: 'Home',
    tryAgain: 'Try Again',
    downloadCsv: 'Download CSV',
  },
  tests: {
    vlta: {
      name: 'Visual 1-Back',
      description:
        'Shapes appear one at a time. Press Space, click, or tap whenever the current shape matches the previous one. The test ends when the time limit is reached or you miss too many targets.',
    },
  },
  config: {
    maxDurationMin: { label: 'Max Duration', unit: 'minutes' },
    shapeIntervalSec: { label: 'Shape Interval', unit: 'seconds' },
    shapeDurationMs: { label: 'Shape Display Duration', unit: 'ms' },
    enableMaxMisses: { label: 'Limit misses' },
    maxFailureCount: { label: 'Max Misses' },
  },
  language: {
    en: 'English',
    de: 'Deutsch',
  },
  notFound: '404 - Not Found',
} as const

export default en

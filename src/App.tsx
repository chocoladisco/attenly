import { Routes, Route } from 'react-router'
import { useTranslation } from 'react-i18next'
import { SessionProvider } from './context/SessionContext'
import { AppLayout } from './components/AppLayout/AppLayout'
import { HomeScreen } from './screens/Home/HomeScreen'
import { TestSelectionScreen } from './screens/TestSelection/TestSelectionScreen'
import { TestConfigurationScreen } from './screens/TestConfiguration/TestConfigurationScreen'
import { TestScreen } from './screens/Test/TestScreen'
import { ResultsScreen } from './screens/Results/ResultsScreen'

function NotFound() {
  const { t } = useTranslation()
  return <p>{t('notFound')}</p>
}

export default function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="tests" element={<TestSelectionScreen />} />
          <Route path="tests/:testId/configure" element={<TestConfigurationScreen />} />
          <Route path="tests/:testId/results" element={<ResultsScreen />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="tests/:testId/run" element={<TestScreen />} />
      </Routes>
    </SessionProvider>
  )
}

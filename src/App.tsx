import { Routes, Route } from 'react-router'
import { SessionProvider } from './context/SessionContext'
import { AppLayout } from './components/AppLayout/AppLayout'
import { HomeScreen } from './screens/Home/HomeScreen'
import { TestSelectionScreen } from './screens/TestSelection/TestSelectionScreen'
import { TestConfigurationScreen } from './screens/TestConfiguration/TestConfigurationScreen'
import { TestScreen } from './screens/Test/TestScreen'
import { ResultsScreen } from './screens/Results/ResultsScreen'

export default function App() {
  return (
    <SessionProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomeScreen />} />
          <Route path="tests" element={<TestSelectionScreen />} />
          <Route path="tests/:testId/configure" element={<TestConfigurationScreen />} />
          <Route path="tests/:testId/results" element={<ResultsScreen />} />
          <Route path="*" element={<p>404 - Not Found</p>} />
        </Route>
        <Route path="tests/:testId/run" element={<TestScreen />} />
      </Routes>
    </SessionProvider>
  )
}

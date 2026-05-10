import { Routes, Route } from 'react-router'

function Home() {
  return <h1>rTAP</h1>
}

function NotFound() {
  return <h1>404 - Not Found</h1>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

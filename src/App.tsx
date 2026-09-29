import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const DishStory = lazy(() => import('./pages/DishStory'))
const QRDemo = lazy(() => import('./pages/QRDemo'))

function RouteFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-charcoal text-[11px] tracking-[0.28em] text-ivory-muted uppercase">
      KOKUM
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<DishStory />} />
          <Route path="/story" element={<DishStory />} />
          <Route path="/qr" element={<QRDemo />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';

const FunnelPage = lazy(() => import('./pages/FunnelPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const PostBookingPage = lazy(() => import('./pages/PostBookingPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <Routes>
          <Route path="/" element={<FunnelPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/post-booking" element={<PostBookingPage />} />
          <Route path="/privacy" element={<LegalPage kind="privacy" />} />
          <Route path="/terms" element={<LegalPage kind="terms" />} />
          <Route path="/disclaimer" element={<LegalPage kind="disclaimer" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

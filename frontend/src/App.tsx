import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import ChatAssistant from './pages/ChatAssistant';
import ShareMeeting from './pages/ShareMeeting';
import EmailHistory from './pages/EmailHistory';
import Calendar from './pages/Calendar';
import LandingPage from './pages/LandingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/landing" replace />;
  }
  
  return <>{children}</>;
}

// Public Route Component (redirect if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Landing page route - redirect to dashboard if logged in */}
          <Route path="/landing" element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } />
          
          {/* Root route - redirect based on auth status */}
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/landing" replace />
          } />
          
          {/* Protected app routes with Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cases" element={<Cases />} />
            <Route path="cases/:id" element={<CaseDetail />} />
            <Route path="chat" element={<ChatAssistant />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="email-history" element={<EmailHistory />} />
          </Route>
          
          {/* Share meeting standalone route */}
          <Route path="/share-meeting/:meetingId" element={<ShareMeeting />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cases" element={<Cases />} />
            <Route path="cases/:id" element={<CaseDetail />} />
            <Route path="chat" element={<ChatAssistant />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="email-history" element={<EmailHistory />} />
          </Route>
          <Route path="/share-meeting/:meetingId" element={<ShareMeeting />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
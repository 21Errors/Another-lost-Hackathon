import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DocumentsPage from './pages/DocumentsPage';
import AddDocumentPage from './pages/AddDocumentPage';
import EditDocumentPage from './pages/EditDocumentPage';
import EventsPage from './pages/EventsPage';
import AddEventPage from './pages/AddEventPage';
import EditEventPage from './pages/EditEventPage';
import NewsPage from './pages/NewsPage';
import AddNewsPage from './pages/AddNewsPage';
import EditNewsPage from './pages/EditNewsPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import AuthProvider from './context/AuthContext';
import Layout from './Layout';
import SearchResults from './components/SearchResults'; // don’t forget!

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="add-document" element={<AddDocumentPage />} />
            <Route path="edit-document/:id" element={<EditDocumentPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="add-event" element={<AddEventPage />} />
            <Route path="edit-event/:id" element={<EditEventPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="add-news" element={<AddNewsPage />} />
            <Route path="edit-news/:id" element={<EditNewsPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="search-results" element={<SearchResults />} />

          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import BrowsePage from './pages/BrowsePage';
import AddLoadPage from './pages/AddLoadPage';
import LoadDetailPage from './pages/LoadDetailPage';
import ImportPage from './pages/ImportPage';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navigation />

      <main className="flex-1 pb-20 md:pb-6">
        <Routes>
          <Route path="/" element={<BrowsePage />} />
          <Route path="/add" element={<AddLoadPage />} />
          <Route path="/load/:id" element={<LoadDetailPage />} />
          <Route path="/edit/:id" element={<AddLoadPage />} />
          <Route path="/import" element={<ImportPage />} />
        </Routes>
      </main>
    </div>
  );
}

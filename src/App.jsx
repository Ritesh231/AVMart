import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        {/* Header is always at the top */}
        <Header />

        {/* The main content changes based on the URL */}
        <main>
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App
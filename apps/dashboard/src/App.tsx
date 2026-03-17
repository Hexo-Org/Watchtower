import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-50 font-sans">
        <header className="border-b border-slate-800 p-4 sticky top-0 bg-slate-950/80 backdrop-blur-md z-10">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Watchtower
            </h1>
            <nav>
              <ul className="flex gap-6 text-sm font-medium text-slate-400">
                <li className="hover:text-slate-50 transition-colors cursor-pointer">Dashboard</li>
                <li className="hover:text-slate-50 transition-colors cursor-pointer">Contracts</li>
                <li className="hover:text-slate-50 transition-colors cursor-pointer">Alerts</li>
              </ul>
            </nav>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

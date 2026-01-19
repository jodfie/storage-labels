import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Home from './pages/Home';
import Search from './pages/Search';
import ScanQR from './pages/ScanQR';
import PrintLabels from './pages/PrintLabels';
import Export from './pages/Export';
import NewContainer from './pages/NewContainer';
import ContainerDetail from './pages/ContainerDetail';
import NewItem from './pages/NewItem';
import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app">
          <header className="app-header">
            <h1>
              <Link to="/">📦 Storage Labels</Link>
            </h1>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/scan">📸 Scan</Link>
              <Link to="/search">Search</Link>
              <Link to="/print">🖨️ Print</Link>
              <Link to="/export">💾 Export</Link>
            </nav>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scan" element={<ScanQR />} />
              <Route path="/search" element={<Search />} />
              <Route path="/print" element={<PrintLabels />} />
              <Route path="/export" element={<Export />} />
              <Route path="/containers/new" element={<NewContainer />} />
              <Route path="/containers/:qrCode" element={<ContainerDetail />} />
              <Route path="/containers/:qrCode/items/new" element={<NewItem />} />
              <Route path="*" element={<div>I don't know where this goes!</div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

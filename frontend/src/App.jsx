import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Home from "./pages/Home"
import Chat from "./pages/Chat"
import SemanticSearch from "./pages/SemanticSearch"
import CertificationGuidance from "./pages/CertificationGuidance"
import Verification from "./pages/Verification"
import PersonalizedStandards from "./pages/PersonalizedStandards"
import DocumentQA from "./pages/DocumentQA"
import Login from "./pages/Login"
import AdminDashboard from "./pages/AdminDashboard"

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
      background: #f0f4f8; color: #1e293b; line-height: 1.6;
    }
    a { text-decoration: none; color: inherit; }
    .layout { display: flex; min-height: 100vh; }
    .main-area { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .content { flex: 1; padding: 32px 40px; max-width: 1200px; width: 100%; margin: 0 auto; animation: fadeUp .3s ease; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideRight { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .5; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

    .card {
      background: #fff; border-radius: 16px; padding: 24px 28px;
      box-shadow: 0 1px 3px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.03);
      border: 1px solid rgba(0,0,0,.04);
      transition: all .25s cubic-bezier(.4,0,.2,1);
    }
    .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); transform: translateY(-2px); }
    .card-static { background: #fff; border-radius: 16px; padding: 24px 28px; box-shadow: 0 1px 3px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.03); border: 1px solid rgba(0,0,0,.04); }

    .grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }

    .btn {
      background: linear-gradient(135deg, #2563eb, #7c3aed); color: #fff; border: none;
      border-radius: 12px; padding: 12px 24px; font-size: 15px; font-weight: 600;
      cursor: pointer; transition: all .25s cubic-bezier(.4,0,.2,1);
      box-shadow: 0 2px 8px rgba(37,99,235,.3); display: inline-flex; align-items: center; gap: 8px;
    }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37,99,235,.4); }
    .btn:active { transform: translateY(0); }
    .btn:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }
    .btn.secondary { background: #f8fafc; color: #2563eb; box-shadow: none; border: 1px solid #e2e8f0; }
    .btn.secondary:hover { background: #eff6ff; border-color: #bfdbfe; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,.1); }
    .btn.danger { background: linear-gradient(135deg, #dc2626, #b91c1c); box-shadow: 0 2px 8px rgba(220,38,38,.3); }
    .btn.danger:hover { box-shadow: 0 6px 20px rgba(220,38,38,.4); }
    .btn.success { background: linear-gradient(135deg, #059669, #047857); box-shadow: 0 2px 8px rgba(5,150,105,.3); }

    input, textarea {
      width: 100%; padding: 13px 18px; border: 2px solid #e2e8f0; border-radius: 12px;
      font-size: 15px; font-family: inherit; background: #f8fafc; color: #1e293b;
      transition: all .2s cubic-bezier(.4,0,.2,1);
    }
    input:focus, textarea:focus {
      outline: none; border-color: #2563eb;
      box-shadow: 0 0 0 4px rgba(37,99,235,.1); background: #fff;
    }
    input::placeholder, textarea::placeholder { color: #94a3b8; }

    h1 { font-size: 30px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    h2 { font-size: 22px; font-weight: 700; margin-bottom: 16px; color: #1e293b; letter-spacing: -0.3px; }
    h3 { font-size: 16px; font-weight: 600; color: #334155; }

    .muted { color: #64748b; font-size: 14px; }
    .tag {
      display: inline-block; background: linear-gradient(135deg, #eff6ff, #e0e7ff); color: #2563eb;
      border: 1px solid #c7d2fe; border-radius: 999px; padding: 5px 14px; font-size: 13px;
      font-weight: 600; margin-right: 6px;
    }
    .error-text { color: #dc2626; margin: 10px 0; font-size: 14px; font-weight: 500; }
    ul.plain { list-style: none; padding: 0; }
    ul.plain li { padding: 6px 0; font-size: 15px; display: flex; align-items: flex-start; gap: 8px; }
    ul.plain li::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #2563eb; margin-top: 8px; flex-shrink: 0; }

    table { border-collapse: separate; border-spacing: 0; width: 100%; }
    thead th { background: #f8fafc; padding: 12px 16px; font-size: 13px; font-weight: 600; color: #475569; text-align: left; border-bottom: 2px solid #e2e8f0; }
    tbody td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
    tbody tr { transition: background .15s; }
    tbody tr:hover { background: #f8fafc; }

    code {
      background: #f1f5f9; color: #7c3aed; padding: 2px 8px; border-radius: 6px;
      font-size: 13px; font-weight: 500;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  `}</style>
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalStyles />
        <div className="layout">
          <Sidebar />
          <div className="main-area">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/search" element={<SemanticSearch />} />
              <Route path="/certification" element={<CertificationGuidance />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/recommendations" element={<PersonalizedStandards />} />
              <Route path="/documents" element={<DocumentQA />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

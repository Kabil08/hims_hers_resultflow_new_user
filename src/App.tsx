import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FloatingChatButton from "@/components/FloatingChatButton";
import ChatDialog from "@/components/ChatDialog";
import "./App.css";

const HIMS_IMAGE_URL =
  "https://res.cloudinary.com/dsf1qebes/image/upload/v1771198953/Screenshot_2026-02-16_at_5.11.37_AM_bcqido.png";

function HimsIframe() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <div className="relative w-full h-full z-0">
        <img
          src={HIMS_IMAGE_URL}
          alt="Hims Website"
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="relative z-50">
        <FloatingChatButton onClick={() => setIsChatOpen(true)} />
        <ChatDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HimsIframe />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FloatingChatButton from "@/components/FloatingChatButton";
import ChatDialog from "@/components/ChatDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import "./App.css";

const HIMS_DESKTOP_IMAGE_URL =
  "https://res.cloudinary.com/dsf1qebes/image/upload/v1771198953/Screenshot_2026-02-16_at_5.11.37_AM_bcqido.png";

const HIMS_MOBILE_IMAGE_URL =
  "https://res.cloudinary.com/dsf1qebes/image/upload/v1771199618/Screenshot_2026-02-16_at_5.23.05_AM_hgajcr.png";

function HimsIframe() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      <div className="relative w-full h-full z-0">
        <img
          src={isMobile ? HIMS_MOBILE_IMAGE_URL : HIMS_DESKTOP_IMAGE_URL}
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

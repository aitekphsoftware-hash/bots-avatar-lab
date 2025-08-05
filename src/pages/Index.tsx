import Sidebar from "@/components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Avatars from "./Avatars";
import VideoStudio from "./VideoStudio";
import VideoTranslate from "./VideoTranslate";
import Agents from "./Agents";
import Home from "./Home";

const Index = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar className="w-64 flex-shrink-0" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/avatars" element={<Avatars />} />
        <Route path="/video-studio" element={<VideoStudio />} />
        <Route path="/video-translate" element={<VideoTranslate />} />
        <Route path="/agents" element={<Agents />} />
      </Routes>
    </div>
  );
};

export default Index;

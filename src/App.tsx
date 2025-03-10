import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/music" element={<Home defaultTab="music" />} />
        <Route path="/social" element={<Home defaultTab="social" />} />
        <Route path="/islamic" element={<Home defaultTab="islamic" />} />
        <Route path="/settings" element={<Home defaultTab="music" />} />
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={<div />} />
        )}
      </Routes>
    </Suspense>
  );
}

export default App;

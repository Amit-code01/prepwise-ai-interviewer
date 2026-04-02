import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Results from "./pages/Results";
import Report from"./pages/Report";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/results" element={<Results />} />
         <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
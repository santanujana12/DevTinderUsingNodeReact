import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Body } from "./components/MainComponents/Body/Body";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="*" element={<Body />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

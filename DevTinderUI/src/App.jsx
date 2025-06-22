import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Body } from "./components/MainComponents/Body/Body";
import { Login } from "./components/MainComponents/Auth/Login";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

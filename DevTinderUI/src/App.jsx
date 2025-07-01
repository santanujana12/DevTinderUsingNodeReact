import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Body } from "./components/MainComponents/Body/Body";
import { Login } from "./components/MainComponents/Auth/Login";
import { SignUp } from "./components/MainComponents/Auth/SignUp";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Body />}>
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/feed" element={<h1>Feed</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

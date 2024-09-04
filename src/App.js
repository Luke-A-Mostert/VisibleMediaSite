import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Faces from "./pages/Faces";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Footer from "./Footer";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/faces" exact element={<Faces />} />
          <Route path="/about" exact element={Home} />
          <Route path="/contact" exact element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

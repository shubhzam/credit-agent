// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatInterface from "./pages/ChatInterface";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";

// Example of other pages you might have:
// import HomePage from "./pages/HomePage";
// import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ChatInterface />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

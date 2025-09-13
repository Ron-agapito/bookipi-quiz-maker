import { useState } from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import QuizBuilder from "./pages/QuizBuilder";
function App() {
    const [count, setCount] = useState(0);

    return (
        <>
            <div className="container mx-auto p-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/quiz-builder" element={<QuizBuilder />} />
                </Routes>
            </div>
        </>
    );
}

export default App;

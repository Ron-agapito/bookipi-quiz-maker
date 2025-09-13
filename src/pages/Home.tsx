import QuizSelector from "../components/QuizSelector";
import Quiz from "../components/Quiz";
import { useState } from "react";

export default function Home() {
    const [quizId, setQuizId] = useState<number | null>(null);

    return (
        <div>
            <QuizSelector onSelect={setQuizId} />
            {quizId && <Quiz id={quizId} />}
        </div>
    );
}

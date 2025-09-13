export interface QuizQuestion {
    type: "mcq" | "short" | "code";
    prompt: string;
    options: string[];
    correctAnswer: string;
    id?: number;
    quizId?: number;
}

import axios from "axios";

import type { QuizQuestion } from "./types";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`, // attach token
    },
});

export function createQuiz(data: {
    title: string;
    description: string;
    isPublished?: boolean;
}) {
    return api.post("/quizzes", {
        ...data,
        isPublished: data.isPublished ?? true,
    });
}

export function createQuestions(quizId: string, questions: QuizQuestion[]) {
    //return api.post(`/quizzes/${quizId}/questions`, { questions });
    //for each question, post it
    return Promise.all(
        questions.map((q) => api.post(`/quizzes/${quizId}/questions`, q))
    );
}

export function getQuizzes() {
    return api.get("/quizzes");
}

export function getQuizById(quizId: number) {
    return api.get(`/quizzes/${quizId}`);
}

export function getQuestions(quizId: number) {
    return api.get(`/quizzes/${quizId}`);
}

export function startQuizAttempt(quizId: number) {
    return api.post(`/attempts/`, { quizId });
}

export function answerQuizAttempt(attemptId: number, answers: any[]) {
    return Promise.all(
        answers.map((a) =>
            api.post(`/attempts/${attemptId}/answer`, {
                questionId: a.questionId,
                value: a.value,
            })
        )
    );
}

export function submitQuizAttempt(attemptId: number) {
    return api.post(`/attempts/${attemptId}/submit`);
}

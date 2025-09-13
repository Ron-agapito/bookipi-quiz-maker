import { useState, useEffect } from "react";
import {
    PhotoIcon,
    UserCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { getQuizzes, getQuestions } from "../api";
import type { QuizQuestion } from "../types";

import Alert from "./Alert";

export default function QuizSelector({
    onSelect,
}: {
    onSelect: (id: number) => void;
}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quizzes, setQuizzes] = useState<string[]>([]);

    useEffect(() => {
        //fetch quizzes from api
        async function fetchQuizzes() {
            try {
                const response = await getQuizzes();
                setQuizzes(response.data);
            } catch (err) {
                console.error("Failed to fetch quizzes", err);
            }
        }
        fetchQuizzes();
    }, []);

    return (
        <>
            <div className="border-b border-gray-200 pb-5">
                <h3 className="text-base font-semibold text-gray-900 pb-2">
                    Select a Quiz
                </h3>
                {loading && <p>Loading quizzes...</p>}
                {quizzes.length === 0 && !loading && (
                    <p>No quizzes available.</p>
                )}

                <select
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    onChange={(e) => onSelect(Number(e.target.value))}
                >
                    <option value=""></option>
                    {quizzes.map((quiz: any) => (
                        <option key={quiz.id} value={quiz.id}>
                            {quiz.title}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}

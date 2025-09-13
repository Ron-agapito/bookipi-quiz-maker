import { useEffect, useState } from "react";
import {
    getQuestions,
    startQuizAttempt,
    answerQuizAttempt,
    submitQuizAttempt,
} from "../api";
import type { QuizQuestion } from "../types";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import Alert from "./Alert";

export default function Quiz({ id }: { id: number }) {
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [answers, setAnswers] = useState<any[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [correctAnswers, setCorrectAnswers] = useState<number[]>([]);

    useEffect(() => {
        getQuestions(id).then((response) => {
            setQuestions(response.data.questions);
            setTitle(response.data.title);
            setDescription(response.data.description);

            console.log("Fetched questions:", questions);
        });
    }, [id]);

    const handleAnswerChange = (questionId: number, value: any) => {
        setIsSubmitted(false);
        setAnswers((prevAnswers) => {
            const alreadyAnswered = prevAnswers.some(
                (a) => a.questionId === questionId
            );

            if (alreadyAnswered) {
                // Update the existing answer
                return prevAnswers.map((answer) =>
                    answer.questionId === questionId
                        ? { ...answer, value }
                        : answer
                );
            }
            // Add a new answer for this question
            return [...prevAnswers, { questionId, value }];
        });
    };

    //async submit
    const handleSubmit = async () => {
        setIsSubmitted(false);
        const attempt = await startQuizAttempt(id);
        await answerQuizAttempt(attempt.data.id, answers);
        const result = await submitQuizAttempt(attempt.data.id);
        setScore(result.data.score);
        setCorrectAnswers(result.data.details);
        setIsSubmitted(true);
    };
    return (
        <>
            {isSubmitted && score !== null && (
                <Alert
                    text={`Quiz submitted! Your score: ${score} / ${questions.length}`}
                />
            )}
            <h3 className="text-base font-semibold text-gray-900 pt-4">
                {title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {description}
            </p>
            <div className="pt-6">
                {questions.map((q: QuizQuestion, index: number) => (
                    <div className="mb-8" key={q.id}>
                        <fieldset>
                            <legend className="text-sm/6 font-semibold text-gray-900">
                                {index + 1}) {q.prompt}
                            </legend>{" "}
                            <div className="mt-4 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                {Array.isArray(q.options) &&
                                    q.options.map((option, idx) => (
                                        <div className="flex items-center">
                                            <input
                                                id={q.id + "-" + idx}
                                                name="notification-method"
                                                type="radio"
                                                onChange={() =>
                                                    handleAnswerChange(
                                                        q.id,
                                                        option
                                                    )
                                                }
                                                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                                            />
                                            <label
                                                htmlFor={q.id + "-" + idx}
                                                className="ml-3 block text-sm/6 font-medium text-gray-900"
                                            >
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                            </div>
                            {q.type != "mcq" && (
                                <div className="">
                                    <input
                                        type="text"
                                        onChange={(e) =>
                                            handleAnswerChange(
                                                q.id,
                                                e.target.value
                                            )
                                        }
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            )}
                            {isSubmitted && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Correct Answer:
                                    {Array.isArray(q.options) && (
                                        <> {q.options[q.correctAnswer]}</>
                                    )}
                                    {!q.options && <> {q.correctAnswer}</>}
                                </p>
                            )}
                        </fieldset>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                <CheckCircleIcon
                    aria-hidden="true"
                    className="-ml-0.5 size-5"
                />
                Submit Answers
            </button>
        </>
    );
}

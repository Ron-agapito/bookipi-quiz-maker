import { useState } from "react";
import {
    PhotoIcon,
    UserCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { createQuiz, createQuestions } from "../api";
import type { QuizQuestion } from "../types";

import Alert from "./Alert";

export default function QuizBuilderForm() {
    const [quizTitle, setQuizTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await createQuiz({
                title: quizTitle,
                description,
            });
            //get back quiz id and questions
            const { id } = response.data;
            await createQuestions(id, questions);
            setShowSuccess(true);
            setQuizTitle("");
            setDescription("");
            setQuestions([]);
        } catch (err: any) {
            if (err?.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-12">
                {showSuccess && (
                    <Alert
                        text="Quiz created successfully!"
                        onClose={() => setShowSuccess(false)}
                    />
                )}
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">
                        Create Quiz
                    </h2>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="quizTitle"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Quiz Title
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                                    <input
                                        id="quizTitle"
                                        name="quizTitle"
                                        type="text"
                                        placeholder="Quiz Title"
                                        className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                        value={quizTitle}
                                        onChange={(e) =>
                                            setQuizTitle(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-span-full">
                            <label
                                htmlFor="quizDescription"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Description
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="quizDescription"
                                    name="quizDescription"
                                    rows={3}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {error && <div className="text-red-600 mt-2">{error}</div>}
            {questions.map((q, idx) => (
                <div key={idx} className="mt-4 p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm/6 font-medium text-gray-900">
                            Question {idx + 1}
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                const newQuestions = questions.filter(
                                    (_, qIdx) => qIdx !== idx
                                );
                                setQuestions(newQuestions);
                            }}
                            className="rounded-full bg-indigo-600 p-1 text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <XMarkIcon className="size-5" />
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900">
                            Type
                        </label>
                        <select
                            value={q.type}
                            onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[idx].type = e.target.value as
                                    | "mcq"
                                    | "short";
                                setQuestions(newQuestions);
                            }}
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        >
                            <option value="mcq">Multiple Choice</option>
                            <option value="short">Short</option>
                        </select>
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm/6 font-medium text-gray-900">
                            Prompt
                        </label>
                        <div className="mt-2">
                            <input
                                name="prompt"
                                type="text"
                                value={q.prompt}
                                placeholder="Enter your prompt"
                                required
                                onChange={(e) => {
                                    const newQuestions = [...questions];
                                    newQuestions[idx].prompt = e.target.value;
                                    setQuestions(newQuestions);
                                }}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    {q.type === "mcq" && (
                        <div className="mt-4">
                            <label className="block text-sm/6 font-medium text-gray-900">
                                Options
                            </label>
                            {q.options.map((option, optIdx) => (
                                <div
                                    key={optIdx}
                                    className="mt-2 flex justify-center items-center gap-2"
                                >
                                    <input
                                        key={optIdx}
                                        type="text"
                                        className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        value={option}
                                        onChange={(e) => {
                                            const newQuestions = [...questions];
                                            newQuestions[idx].options[optIdx] =
                                                e.target.value;
                                            setQuestions(newQuestions);
                                        }}
                                        placeholder={`Option ${optIdx + 1}`}
                                    />
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newQuestions = [
                                                    ...questions,
                                                ];
                                                newQuestions[idx].options =
                                                    newQuestions[
                                                        idx
                                                    ].options.filter(
                                                        (_, i) => i !== optIdx
                                                    );
                                                setQuestions(newQuestions);
                                            }}
                                            className="rounded-full bg-indigo-600 p-1 text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            <XMarkIcon className="size-3" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                className="rounded-sm mt-4 bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-xs hover:bg-indigo-100"
                                onClick={() => {
                                    const newQuestions = [...questions];
                                    newQuestions[idx].options.push("");
                                    setQuestions(newQuestions);
                                }}
                            >
                                Add Option
                            </button>
                        </div>
                    )}
                    <div className="mt-4">
                        <label className="block text-sm/6 font-medium text-gray-900">
                            Correct Answer
                        </label>
                        <div className="mt-2">
                            <input
                                name="answer"
                                type="text"
                                value={q.correctAnswer}
                                placeholder="Enter the correct answer"
                                required
                                onChange={(e) => {
                                    const newQuestions = [...questions];
                                    newQuestions[idx].correctAnswer =
                                        e.target.value;
                                    setQuestions(newQuestions);
                                }}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                </div>
            ))}
            <div className="mt-6 flex items-center justify-end gap-x-6"></div>
            <button
                type="button"
                className="rounded-sm bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-600 shadow-xs hover:bg-indigo-100"
                disabled={loading}
                onClick={() => {
                    setQuestions((prev) => [
                        ...prev,
                        {
                            type: "mcq",
                            prompt: "",
                            options: [],
                            correctAnswer: "",
                        },
                    ]);
                }}
            >
                Add Question
            </button>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    className="text-sm/6 font-semibold text-gray-900"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create"}
                </button>
            </div>
        </form>
    );
}

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { AlignLeft, CheckSquare, Circle, Phone, Plus, Square, Trash2, Type } from "lucide-react";
import { useState } from "react";

/**
 * @intent Questions configuration tab for appointment form
 */
function QuestionsTab() {
    const [questions, setQuestions] = useState([
        { id: 1, question: "Name", type: "single-line", answer: "Vipin Jindal", mandatory: false },
        { id: 2, question: "Phone", type: "phone", answer: "9874563210", mandatory: false },
        { id: 3, question: "Symptoms", type: "single-line", answer: "Cough", mandatory: false },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newQuestion, setNewQuestion] = useState({
        type: "single-line",
        question: "",
        mandatory: false
    });

    const questionTypes = [
        { id: "single-line", label: "Single line text", icon: Type },
        { id: "multi-line", label: "Multi-line text", icon: AlignLeft },
        { id: "phone", label: "Phone Number", icon: Phone },
        { id: "radio", label: "Radio (One Answer)", icon: Circle },
        { id: "checkbox", label: "Checkboxes (Multiple Answers)", icon: CheckSquare },
    ];

    const handleAddQuestion = () => {
        if (!newQuestion.question.trim()) return;

        setQuestions([
            ...questions,
            {
                id: Date.now(),
                ...newQuestion,
                answer: "" // Empty answer for new configuration
            }
        ]);
        setNewQuestion({ type: "single-line", question: "", mandatory: false });
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const renderAnswerPreview = (type, value) => {
        switch (type) {
            case "single-line":
                return <Input disabled value={value} className="h-8 bg-gray-50" />;
            case "phone":
                return <Input disabled value={value} className="h-8 bg-gray-50" />;
            case "multi-line":
                return <div className="h-8 w-full rounded border bg-gray-50 px-3 py-1.5 text-sm text-gray-500">{value}</div>;
            case "radio":
                return <div className="flex items-center gap-2 text-sm text-gray-500"><Circle className="h-4 w-4" /> Option 1</div>;
            case "checkbox":
                return <div className="flex items-center gap-2 text-sm text-gray-500"><Square className="h-4 w-4" /> Option 1</div>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Questions Table */}
            <div className="rounded-md border bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50/50 text-left text-xs font-medium text-gray-500">
                            <th className="px-4 py-3">Question</th>
                            <th className="px-4 py-3">Answer type</th>
                            <th className="px-4 py-3 w-1/3">Answer</th>
                            <th className="px-4 py-3 text-center">Mandatory</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {questions.map((q) => (
                            <tr key={q.id} className="group hover:bg-gray-50/50">
                                <td className="px-4 py-3 font-medium text-gray-900">{q.question}</td>
                                <td className="px-4 py-3 text-gray-600">
                                    {questionTypes.find(t => t.id === q.type)?.label || q.type}
                                </td>
                                <td className="px-4 py-3">
                                    {renderAnswerPreview(q.type, q.answer)}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex justify-center">
                                        <Checkbox checked={q.mandatory} disabled />
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleDelete(q.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Question Trigger */}
            {!isAdding ? (
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add a question
                </button>
            ) : (
                /* Question Builder */
                <div className="rounded-lg border bg-gray-50/50 p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="space-y-4">
                        {/* Type Selector */}
                        <div className="flex flex-wrap gap-2">
                            {questionTypes.map((type) => {
                                const Icon = type.icon;
                                const isActive = newQuestion.type === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setNewQuestion({ ...newQuestion, type: type.id })}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all border",
                                            isActive
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {type.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Question Input & Mandatory */}
                        <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-2">
                                <Label>Question</Label>
                                <Input
                                    placeholder="Anything else we should know ?"
                                    value={newQuestion.question}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                                    className="bg-white"
                                />
                            </div>
                            <div className="pt-8">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="mandatory-new"
                                        checked={newQuestion.mandatory}
                                        onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, mandatory: checked })}
                                    />
                                    <Label htmlFor="mandatory-new" className="font-normal text-gray-600">Mandatory Answer</Label>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleAddQuestion} disabled={!newQuestion.question.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                Save Question
                            </Button>
                            <Button variant="ghost" onClick={() => setIsAdding(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export { QuestionsTab };

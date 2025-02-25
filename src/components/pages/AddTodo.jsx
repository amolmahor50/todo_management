import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline, IoReturnUpForwardOutline, IoCheckmarkOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useContext } from "react";
import { addTodoData, TodoContextData } from "../context/TodoContext";

export default function AddTodo() {
    const { user, selectedFolder } = useContext(TodoContextData);
    const Navigate = useNavigate();

    const formatDate = () => {
        const now = new Date();
        const day = now.getDate();
        const month = now.toLocaleString('default', { month: 'long' });
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${day} ${month} ${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    // Track text history for undo/redo
    const [history, setHistory] = useState([{ title: "", description: "" }]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const [TodoData, setTodoData] = useState({
        title: "",
        description: "",
        date: formatDate(),
        pinned: false,
    });

    // Update history when user types
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const newData = { ...TodoData, [name]: value };
        setTodoData(newData);

        // Add new state to history only if it's a new change
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newData);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    // Undo action
    const handleUndo = () => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setTodoData(history[prevIndex]);
            setHistoryIndex(prevIndex);
        }
    };

    // Redo action
    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setTodoData(history[nextIndex]);
            setHistoryIndex(nextIndex);
        }
    };

    const handleSaveTodo = async () => {
        const folderTab = selectedFolder === "All" ? "Uncategorised" : selectedFolder;
        await addTodoData(user.uid, folderTab, { ...TodoData, pinned: false });
        Navigate('/todo-management');
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <IoIosArrowRoundBack onClick={() => Navigate(-1)} size={30} className="cursor-pointer" />
                <div className="flex sm:gap-8 gap-6 items-center">
                    <IoReturnUpBackOutline size={22} className={`cursor-pointer ${historyIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleUndo} />
                    <IoReturnUpForwardOutline size={22} className={`cursor-pointer ${historyIndex === history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleRedo} />
                    <IoCheckmarkOutline size={22} className="cursor-pointer" onClick={handleSaveTodo} />
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <Input
                    name="title"
                    placeholder="Title"
                    className="font-medium leading-none bg-transparent border-none p-0"
                    value={TodoData.title}
                    onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                    {TodoData.date} | {TodoData.title.length} characters
                </p>
                <Textarea
                    name="description"
                    placeholder="Start writing..."
                    value={TodoData.description}
                    onChange={handleInputChange}
                    className="bg-transparent border-none p-0 outline-none mt-4 no-scrollbar resize-none overflow-hidden"
                    rows={1}
                    onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                />
            </div>
        </>
    );
}

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

    // Utility function to format the current date and time
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

    // Initialize Todo Data with default pinned as false
    const [TodoData, setTodoData] = useState({
        title: "",
        description: "",
        date: formatDate(),
        pinned: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTodoData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Save Todo Data to Firestore
    const handleSaveTodo = async () => {
        const folderTab = selectedFolder === "All" ? "Uncategorised" : selectedFolder;

        // Ensure pinned is always set to false
        await addTodoData(user.uid, folderTab, { ...TodoData, pinned: false });

        Navigate('/todo-management');
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <IoIosArrowRoundBack onClick={() => Navigate(-1)} size={30} className="cursor-pointer" />
                <div className="flex sm:gap-8 gap-6 items-center">
                    <IoReturnUpBackOutline size={22} className="cursor-pointer" />
                    <IoReturnUpForwardOutline size={22} className="cursor-pointer" />
                    <IoCheckmarkOutline
                        size={22}
                        className="cursor-pointer"
                        onClick={handleSaveTodo}
                    />
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

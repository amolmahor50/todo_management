import { IoIosArrowRoundBack } from "react-icons/io";
import { IoReturnUpBackOutline, IoReturnUpForwardOutline, IoCheckmarkOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useEffect, useRef, useState } from "react";
import { EditedfetchTodoById, TodoContextData, updateTodoIndb } from "../context/TodoContext";

export default function EditTodo() {
    const { user } = useContext(TodoContextData);
    const Navigate = useNavigate();
    const { userId, folder, taskId } = useParams();

    console.log(userId, folder, taskId)

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

    const [todoData, setTodoData] = useState({
        title: "",
        description: "",
        date: "",
    });

    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [todoData.description]);

    useEffect(() => {
        if (userId && folder && taskId) {
            const unsubscribe = EditedfetchTodoById(userId, folder, taskId, setTodoData);
            return () => unsubscribe && unsubscribe();
        }
    }, [userId, folder, taskId]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTodoData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle save action
    const handleSave = () => {
        const updatedTodo = {
            title: todoData.title,
            description: todoData.description,
            date: formatDate(),
        };

        updateTodoIndb(userId, folder, taskId, updatedTodo);

        Navigate(-1);
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <IoIosArrowRoundBack onClick={() => Navigate(-1)} size={30} className="cursor-pointer" />
                <div className="flex sm:gap-8 gap-6 items-center">
                    <IoReturnUpBackOutline size={22} className="cursor-pointer" />
                    <IoReturnUpForwardOutline size={22} className="cursor-pointer" />
                    <IoCheckmarkOutline size={22} className="cursor-pointer" onClick={handleSave} />
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <Input
                    name="title"
                    value={todoData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="font-medium leading-none bg-transparent border-none p-0"
                />
                <p className="text-xs text-muted-foreground">
                    {formatDate()} | {todoData.title.length} characters
                </p>
                <Textarea
                    ref={textareaRef}
                    name="description"
                    value={todoData.description}
                    onChange={handleInputChange}
                    placeholder="Start writing..."
                    className="bg-transparent border-none p-0 outline-none mt-4 no-scrollbar resize-none overflow-hidden"
                    rows={1}
                />
            </div>
        </>
    );
}

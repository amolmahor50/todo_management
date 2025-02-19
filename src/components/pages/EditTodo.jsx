import { IoIosArrowRoundBack } from "react-icons/io";
import { IoReturnUpBackOutline, IoReturnUpForwardOutline, IoCheckmarkOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function EditTodo() {
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

    const [todoData, setTodoData] = useState({
        title: "",
        description: "",
        date: "",
    });

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTodoData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <IoIosArrowRoundBack onClick={() => Navigate(-1)} size={30} className="cursor-pointer" />
                <div className="flex sm:gap-8 gap-6 items-center">
                    <IoReturnUpBackOutline size={22} className="cursor-pointer" />
                    <IoReturnUpForwardOutline size={22} className="cursor-pointer" />
                    <IoCheckmarkOutline size={22} className="cursor-pointer" />
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
                    {todoData.date} | {todoData.description.length} characters
                </p>
                <Textarea
                    name="description"
                    value={todoData.description}
                    onChange={handleInputChange}
                    placeholder="Start writing..."
                    className="bg-transparent border-none p-0 outline-none mt-4"
                />
            </div>
        </>
    );
}

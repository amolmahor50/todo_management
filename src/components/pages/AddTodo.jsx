import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline, IoReturnUpForwardOutline, IoCheckmarkOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useState } from "react";
import { TodoContextData } from "../context/TodoContext";
import { collection, addDoc } from "firebase/firestore";
import { firebaseStore } from "../../lib/firebaseConfig";
import { toast } from "sonner";

export default function AddTodo() {
    const { user } = useContext(TodoContextData);
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

    const [TodoData, setTodoData] = useState({
        title: "",
        description: "",
        date: formatDate(),
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
        if (!user?.uid) {
            toast.error("User not logged in");
            return;
        }

        try {
            await addDoc(collection(firebaseStore, "users", user.uid, "todos"), {
                title: TodoData.title,
                description: TodoData.description,
                date: TodoData.date
            });
            toast.success("Todo saved successfully!");
            setTodoData({ title: "", description: "", date: formatDate() });
            Navigate('/')
        } catch (error) {
            console.error("Error saving todo:", error);
            toast.error("Failed to save todo.");
        }
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
                    className="bg-transparent border-none p-0 outline-none mt-4"
                    value={TodoData.description}
                    onChange={handleInputChange}
                />
            </div>
        </>
    );
}

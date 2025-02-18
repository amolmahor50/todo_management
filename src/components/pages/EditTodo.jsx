import { IoIosArrowRoundBack } from "react-icons/io";
import { IoReturnUpBackOutline, IoReturnUpForwardOutline, IoCheckmarkOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseStore } from "../../lib/firebaseConfig";
import { TodoContextData } from "../context/TodoContext";

export default function EditTodo() {
    const Navigate = useNavigate();
    const { id } = useParams();
    const { user } = useContext(TodoContextData);

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

    // Fetch todo data when component mounts
    useEffect(() => {
        if (!user || !id) return;

        const fetchTodo = async () => {
            try {
                const todoRef = doc(firebaseStore, `users/${user.uid}/todos`, id);
                const todoSnapshot = await getDoc(todoRef);

                if (todoSnapshot.exists()) {
                    setTodoData(todoSnapshot.data());
                } else {
                    console.error("Todo not found");
                }
            } catch (error) {
                console.error("Error fetching todo:", error);
            }
        };

        fetchTodo();
    }, [user, id]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTodoData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Update the todo in Firestore with a new formatted date
    const handleUpdateTodo = async () => {
        try {
            const updatedTodo = {
                ...todoData,
                date: formatDate(),
                updatedAt: new Date().toISOString(),
            };

            const todoRef = doc(firebaseStore, `users/${user.uid}/todos`, id);
            await updateDoc(todoRef, updatedTodo);

            // Update state to reflect changes immediately
            setTodoData(updatedTodo);
            Navigate(-1);
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <IoIosArrowRoundBack onClick={() => Navigate(-1)} size={30} className="cursor-pointer" />
                <div className="flex sm:gap-8 gap-6 items-center">
                    <IoReturnUpBackOutline size={22} className="cursor-pointer" />
                    <IoReturnUpForwardOutline size={22} className="cursor-pointer" />
                    <IoCheckmarkOutline onClick={handleUpdateTodo} size={22} className="cursor-pointer" />
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

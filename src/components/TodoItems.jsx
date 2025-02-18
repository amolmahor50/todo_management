import { collection, getDocs } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseStore } from "../lib/firebaseConfig";
import { TodoContextData } from "./context/TodoContext";
import { motion } from "framer-motion"; // Import motion

export default function TodoItems() {
    const { user, todos, setTodos } = useContext(TodoContextData);
    const Navigate = useNavigate();

    const handleEditTodo = (id) => {
        Navigate(`/editTodo/${id}`);
    };

    useEffect(() => {
        if (!user) return; // If user is not logged in, don't fetch

        const fetchTodos = async () => {
            try {
                const todosCollectionRef = collection(firebaseStore, `users/${user.uid}/todos`);
                const querySnapshot = await getDocs(todosCollectionRef);

                const todosList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setTodos(todosList);
            } catch (error) {
                console.error("Error fetching todos:", error);
            }
        };

        fetchTodos();
    }, [user]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {todos?.map((todo, index) => (
                <motion.div
                    key={index}
                    onClick={() => handleEditTodo(todo.id)}
                    className="bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and slide from below
                    animate={{ opacity: 1, y: 0 }} // Animate to full opacity and slide into place
                    transition={{ duration: 0.5 }} // Transition duration for the animation
                >
                    <p className="text-sm font-medium leading-none">{todo.title}</p>
                    <p className="text-sm text-muted-foreground">{todo.description}</p>
                    <p className="text-xs text-primary">{todo.date}</p>
                </motion.div>
            ))}
        </div>
    );
}

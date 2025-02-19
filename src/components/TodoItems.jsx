import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TodoContextData } from "./context/TodoContext";
import { motion } from "framer-motion";

export default function TodoItems() {
    const { todos } = useContext(TodoContextData);
    const Navigate = useNavigate();

    const handleEditTodo = (id) => {
        Navigate(`/editTodo/${id}`);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <motion.div
                onClick={() => handleEditTodo(12)}
                className="bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg"
                initial={{ opacity: 0, y: 20 }} // Start with opacity 0 and slide from below
                animate={{ opacity: 1, y: 0 }} // Animate to full opacity and slide into place
                transition={{ duration: 0.5 }} // Transition duration for the animation
            >
                <p className="text-sm font-medium leading-none">Amol</p>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-xs text-primary">18 February 7:15 PM</p>
            </motion.div>
        </div>
    );
}

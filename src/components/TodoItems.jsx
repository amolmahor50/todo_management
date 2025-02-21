import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchAllFoldersTasks, fetchTodosRealtime, TodoContextData } from "./context/TodoContext";

export default function TodoItems() {
    const { Notes, user, setNotes, selectedFolder, searchQuery } = useContext(TodoContextData);
    const navigate = useNavigate();

    const handleEditTodo = (userId, folder, taskId) => {
        navigate(`/editTodo/${userId}/${folder}/${taskId}`);
    };

    useEffect(() => {
        if (selectedFolder === "All") {
            fetchAllFoldersTasks(user.uid, setNotes);
            return;
        }

        const unsubscribe = fetchTodosRealtime(user.uid, selectedFolder, setNotes, searchQuery);

        return () => unsubscribe && unsubscribe();
    }, [user, selectedFolder, searchQuery]);

    const sortedNotes = Notes.sort((a, b) => new Date(b.date) - new Date(a.date));

    const matchesSearchQuery = (note) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return note.title.toLowerCase().includes(query) || note.description.toLowerCase().includes(query);
    };

    const filteredNotes = sortedNotes.filter(matchesSearchQuery);

    const highlightMatch = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <span key={index} style={{ color: "red", fontWeight: "semibold" }}>{part}</span> : part
        );
    };

    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {filteredNotes.length > 0 ? (
                filteredNotes.map((Note, index) => (
                    <motion.div
                        key={index}
                        onClick={() => handleEditTodo(user.uid, Note.folder, Note.id)}
                        className="bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                        transition={{ duration: 0.3 }}
                    >
                        <p className="text-sm font-medium leading-none">
                            {highlightMatch(String(Note?.title || "No title"), searchQuery)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {highlightMatch(String(Note?.description || "No text"), searchQuery)}
                        </p>
                        <p className="text-xs text-primary">
                            {highlightMatch(String(Note?.date || ""), searchQuery)}
                        </p>
                    </motion.div>
                ))
            ) : (
                <motion.p
                    className="text-center text-gray-500 col-span-2 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    No matching tasks found.
                </motion.p>
            )}
        </motion.div>
    );
}

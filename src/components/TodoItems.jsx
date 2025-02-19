import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllFoldersTasks, fetchTodosRealtime, TodoContextData } from "./context/TodoContext";

export default function TodoItems() {
    const { Notes, user, setNotes, selectedFolder } = useContext(TodoContextData);
    const navigate = useNavigate();

    const handleEditTodo = (id) => {
        navigate(`/editTodo/${id}`);
    };

    useEffect(() => {
        if (selectedFolder === "All") {
            fetchAllFoldersTasks(user.uid, setNotes);
            return;
        }

        const unsubscribe = fetchTodosRealtime(user.uid, selectedFolder, setNotes);

        return () => unsubscribe && unsubscribe();
    }, [user, selectedFolder]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {Notes.length > 0 ? (
                Notes.map((Note, index) => (
                    <div
                        key={index}
                        onClick={() => handleEditTodo(Note.id)}
                        className="bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg"
                    >
                        <p className="text-sm font-medium leading-none">{Note.title}</p>
                        <p className="text-sm text-muted-foreground">{Note.description}</p>
                        <p className="text-xs text-primary">{Note.date}</p>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 col-span-2">No tasks found.</p>
            )}
        </div>
    );
}

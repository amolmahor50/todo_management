import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { VscChecklist } from "react-icons/vsc";
import { TiPinOutline } from "react-icons/ti";
import { MdDriveFileMoveOutline } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteMultipleTodos, fetchAllFoldersTasks, fetchTodosRealtime, TodoContextData, toggleHiddenStatusForTodo, togglePinStatusForTodo } from "./context/TodoContext";
import { GoCheckCircleFill, GoUnlock } from "react-icons/go";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";

export default function TodoItems() {
    const {
        Notes,
        user,
        setNotes,
        selectedFolder,
        searchQuery,
        isContextMenuOpenForTodos,
        setIsContextMenuOpenForTodos
    } = useContext(TodoContextData);
    const Navigate = useNavigate();
    const [selectedTodos, setSelectedTodos] = useState([]);
    const [deletedPopUpOpen, setDeletedPopUpOpen] = useState(false);

    useEffect(() => {
        let unsubscribe;

        if (selectedFolder === "All") {
            fetchAllFoldersTasks(user.uid, setNotes);
        } else {
            unsubscribe = fetchTodosRealtime(user.uid, selectedFolder, setNotes, searchQuery);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user, selectedFolder, searchQuery]);

    // Search and Sort Together
    const filteredNotes = Array.isArray(Notes) ? Notes.filter((note) => {
        const query = searchQuery.toLowerCase();
        return (
            note?.title?.toLowerCase().includes(query) ||
            note?.description?.toLowerCase().includes(query) ||
            note?.date?.toLowerCase().includes(query)
        );
    }).sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return b.pinned - a.pinned || bTime - aTime;
    }) : [];

    const handleEditTodo = (userId, folder, taskId) => {
        Navigate(`/editTodo/${userId}/${folder}/${taskId}`);
    };

    const highlightMatch = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <span key={index} style={{ color: "red", fontWeight: "semibold" }}>{part}</span> : part
        );
    };

    const handleRightClick = (e, todoId) => {
        e.preventDefault();
        setIsContextMenuOpenForTodos(true);
        toggleTodoSelection(todoId);
    };

    const toggleTodoSelection = (todoId) => {
        setSelectedTodos((prevSelected) =>
            prevSelected.includes(todoId)
                ? prevSelected.filter(id => id !== todoId)
                : [...prevSelected, todoId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedTodos.length === filteredNotes.length) {
            setSelectedTodos([]);
        } else {
            setSelectedTodos(filteredNotes.map(note => note.id));
        }
    };

    const handleTogglePin = async () => {
        if (!selectedTodos.length) return;

        const selectedTasksByFolder = {};
        Notes.forEach((note) => {
            if (selectedTodos.includes(note.id)) {
                if (!selectedTasksByFolder[note.folder]) {
                    selectedTasksByFolder[note.folder] = [];
                }
                selectedTasksByFolder[note.folder].push(note);
            }
        });

        // Update pin status for each selected task in Firestore
        const batchPromises = Object.entries(selectedTasksByFolder).map(async ([folderName, tasks]) => {
            return Promise.all(tasks.map(async (task) => {
                await togglePinStatusForTodo(user.uid, folderName, task.id, task.pinned);
            }));
        });

        await Promise.all(batchPromises);

        // DO NOT update setNotes manually, Firestore's onSnapshot will handle it
        setSelectedTodos([]);
        setIsContextMenuOpenForTodos(false);
    };

    const handleHiddenTodo = async () => {
        if (!selectedTodos.length) return;

        const selectedTasksByFolder = {};
        Notes.forEach((note) => {
            if (selectedTodos.includes(note.id)) {
                if (!selectedTasksByFolder[note.folder]) {
                    selectedTasksByFolder[note.folder] = [];
                }
                selectedTasksByFolder[note.folder].push(note);
            }
        });

        // Update pin status for each selected task in Firestore
        const batchPromises = Object.entries(selectedTasksByFolder).map(async ([folderName, tasks]) => {
            return Promise.all(tasks.map(async (task) => {
                await toggleHiddenStatusForTodo(user.uid, folderName, task.id, task.hiddenTask);
            }));
        });

        await Promise.all(batchPromises);

        // DO NOT update setNotes manually, Firestore's onSnapshot will handle it
        setSelectedTodos([]);
        setIsContextMenuOpenForTodos(false);
    }

    const handleDeletedTasks = async () => {
        if (!selectedTodos.length) return;

        const selectedTasksByFolder = {};
        Notes.forEach((note) => {
            if (selectedTodos.includes(note.id)) {
                if (!selectedTasksByFolder[note.folder]) {
                    selectedTasksByFolder[note.folder] = [];
                }
                selectedTasksByFolder[note.folder].push(note.id);
            }
        });

        await deleteMultipleTodos(user.uid, selectedTasksByFolder);

        setNotes(prevNotes => prevNotes.filter(note => !selectedTodos.includes(note.id)));

        setDeletedPopUpOpen(false);
        setSelectedTodos([]);
        setIsContextMenuOpenForTodos(false);
    };

    const handleMoveToFolder = () => {
        if (!selectedTodos.length) return;

        // Collect selected todos data
        const selectedTasksData = Notes.filter(note => selectedTodos.includes(note.id));

        // Navigate to create-folder and pass selected notes as state
        Navigate("/create-folder", { state: { selectedTasks: selectedTasksData } });
    };

    return (
        <>
            {
                !isContextMenuOpenForTodos ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {filteredNotes.length > 0 ? (
                            filteredNotes
                                .filter(task => !task.hiddenTask)
                                .map((Note, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleEditTodo(user.uid, Note.folder, Note.id)}
                                        onContextMenu={(e) => handleRightClick(e, Note.id)}
                                        className="bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg select-none"

                                    >
                                        <p className="text-sm font-medium leading-none truncate">
                                            {highlightMatch(String(Note?.title || "No title"), searchQuery)}
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {highlightMatch(String(Note?.description || "No text"), searchQuery)}
                                        </p>
                                        <p className="text-xs text-primary flex items-center gap-1">
                                            {highlightMatch(String(Note?.date || ""), searchQuery)}
                                            {Note.pinned && <TiPinOutline color="orange" />}
                                        </p>
                                    </div>
                                ))
                        ) : (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-center">
                                No notes here yet.
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <div className="fixed top-0 left-0 sm:left-1/2 sm:translate-x-[-50%] py-6 sm:px-0 px-6 bg-muted z-50 w-full max-w-5xl mx-auto">
                            <div className=" flex justify-between items-center">
                                <RxCross2 className="cursor-pointer" size={24} onClick={() => {
                                    setIsContextMenuOpenForTodos(false)
                                    setSelectedTodos([]);
                                }
                                } />
                                <VscChecklist className="cursor-pointer" size={26} onClick={toggleSelectAll} />
                            </div>
                        </div>
                        <span className='text-2xl font-normal ml-2'>{selectedTodos.length} Selected Item</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                            {filteredNotes
                                .filter(task => !task.hiddenTask)
                                .map((Note, index) => {
                                    const isSelected = selectedTodos.includes(Note.id);
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => toggleTodoSelection(Note.id)}
                                            onContextMenu={(e) => handleRightClick(e, Note.id)}
                                            className={`${isSelected ? "bg-gray-200" : "bg-card"} rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-lg select-none`}
                                        >
                                            <div className="flex flex-col gap-1 truncate">
                                                <p className="text-sm font-medium leading-none truncate">
                                                    {highlightMatch(String(Note?.title || "No title"), searchQuery)}
                                                </p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {highlightMatch(String(Note?.description || "No text"), searchQuery)}
                                                </p>
                                                <p className="text-xs text-primary flex items-center gap-1">
                                                    {highlightMatch(String(Note?.date || ""), searchQuery)}
                                                    {Note.pinned && <TiPinOutline color="orange" />}
                                                </p>
                                            </div>
                                            <div>
                                                {isSelected ? (
                                                    <GoCheckCircleFill className="sm:text-xl text-lg" color="orange" />
                                                ) : (
                                                    <RiCheckboxBlankCircleLine className="sm:text-xl text-lg bg-muted rounded-full" color="transparent" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        {
                            Notes?.map((Note, index) => (
                                <div key={index} className="w-full mx-auto max-w-5xl fixed bottom-0 left-0 right-0 bg-muted z-40 py-6 sm:px-0 px-10 flex justify-between items-center">
                                    <div className="flex flex-col items-center cursor-pointer">
                                        <GoUnlock size={22} onClick={handleHiddenTodo} />
                                        <span className="text-xs">Hide</span>
                                    </div>
                                    <div
                                        className="flex flex-col items-center cursor-pointer"
                                        onClick={() => handleTogglePin(Note)}
                                    >
                                        <TiPinOutline size={22} />
                                        <span className="text-xs">Pin</span>
                                    </div>
                                    <div
                                        className="flex flex-col items-center cursor-pointer"
                                        onClick={handleMoveToFolder}
                                    >
                                        <MdDriveFileMoveOutline size={22} />
                                        <span className="text-xs">Move to</span>
                                    </div>
                                    <div
                                        className="flex flex-col items-center cursor-pointer"
                                        onClick={() => setDeletedPopUpOpen(true)}
                                    >
                                        <AiOutlineDelete size={22} />
                                        <span className="text-xs">Delete</span>
                                    </div>
                                    {
                                        deletedPopUpOpen && <motion.div
                                            className="fixed inset-0 flex justify-center items-center z-40"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setDeletedPopUpOpen(false)}
                                        >
                                            <div
                                                className="bg-card p-4 text-center grid gap-4 rounded-lg max-w-[450px] w-[90%] mx-auto absolute bottom-3"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <h3>Delete completed tasks</h3>
                                                <p className="text-sm text-muted-foreground">{`Delete ${selectedTodos.length} item?`}</p>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <Button variant="secondary" onClick={() => {
                                                        setDeletedPopUpOpen(false)
                                                        setIsContextMenuOpenForTodos(false)
                                                        setSelectedTodos([]);
                                                    }}>
                                                        Cancel
                                                    </Button>
                                                    <Button variant="destructive" onClick={handleDeletedTasks}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </>
    );
}

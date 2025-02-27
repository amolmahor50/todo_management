import { IoIosArrowRoundBack } from "react-icons/io";
import { motion } from "framer-motion"
import { VscChecklist } from "react-icons/vsc";
import { useContext, useEffect, useState } from "react";
import { deleteMultipleTodos, TodoContextData, toggleHiddenStatusForTodo } from "./context/TodoContext";
import { useNavigate } from "react-router-dom";
import { BsUnlock } from "react-icons/bs";
import { GoCheckCircleFill } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";

export default function LockItems() {
    const { user,
        Notes,
        setNotes,
        isContextMenuOpenForTodos,
        setIsContextMenuOpenForTodos,
    } = useContext(TodoContextData);
    const Navigate = useNavigate();

    const [selectedTodos, setSelectedTodos] = useState([]);
    const [deletedPopUpOpen, setDeletedPopUpOpen] = useState(false);

    const handleEditTodo = (userId, folder, taskId) => {
        Navigate(`/editTodo/${userId}/${folder}/${taskId}`);
    };

    useEffect(() => {

    }, [Notes])

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
        if (selectedTodos.length === Notes.length) {
            setSelectedTodos([]);
        } else {
            setSelectedTodos(Notes.map(note => note.id));
        }
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

    return (
        <div className='flex flex-col'>
            <div className="fixed top-0 left-0 sm:left-1/2 sm:translate-x-[-50%] py-4 sm:px-0 px-4 bg-muted z-50 w-full max-w-5xl mx-auto border-b-2">
                <div className=" flex justify-between items-center">
                    <IoIosArrowRoundBack size={28} className="cursor-pointer" onClick={() => Navigate(-1)} />
                </div>
            </div>
            {
                !isContextMenuOpenForTodos ?
                    <>
                        <span className='text-2xl font-normal mt-16 ml-2'>Lock Items</span>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {
                                Notes
                                    .filter(task => task.hiddenTask)
                                    .map((Note, index) => (
                                        <motion.div
                                            key={index}
                                            onClick={() => handleEditTodo(user.uid, Note.folder, Note.id)}
                                            onContextMenu={(e) => handleRightClick(e, Note.id)}
                                            className="bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p className="text-sm font-medium leading-none truncate">
                                                {Note.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {Note?.description || "No text"}
                                            </p>
                                            <p className="text-xs text-primary">
                                                {Note?.date}
                                            </p>
                                        </motion.div>
                                    ))
                            }
                        </motion.div>

                        {Notes && Notes.length === 0 ? (
                            <motion.p
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                No notes here yet.
                            </motion.p>
                        ) : null}
                    </>
                    :
                    <>
                        <div className="fixed top-0 left-0 sm:left-1/2 sm:translate-x-[-50%] py-5 sm:px-0 px-6 bg-muted z-50 w-full max-w-5xl  mx-auto">
                            <div className=" flex justify-between items-center">
                                <RxCross2 className="cursor-pointer" size={22} onClick={() => {
                                    setIsContextMenuOpenForTodos(false)
                                    setSelectedTodos([]);
                                }
                                } />
                                <VscChecklist className="cursor-pointer" size={22} onClick={toggleSelectAll} />
                            </div>
                        </div>
                        <span className='text-2xl font-normal mt-16 ml-2'>{selectedTodos.length} Selected Item</span>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {
                                Notes
                                    .filter(task => task.hiddenTask)
                                    .map((Note, index) => {
                                        const isSelected = selectedTodos.includes(Note.id);
                                        return (
                                            <motion.div
                                                key={index}
                                                onClick={() => toggleTodoSelection(Note.id)}
                                                onContextMenu={(e) => handleRightClick(e, Note.id)}
                                                className={`${isSelected ? "bg-gray-200" : "bg-card"} rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-lg`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ scale: 1.02, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="flex flex-col gap-1 truncate">
                                                    <p className="text-sm font-medium leading-none truncate">
                                                        {Note?.title || "No title"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {Note?.description || "No text"}
                                                    </p>
                                                    <p className="text-xs text-primary">
                                                        {Note?.date || ""}
                                                    </p>
                                                </div>
                                                <div>
                                                    {isSelected ? (
                                                        <GoCheckCircleFill className="sm:text-xl text-lg" color="orange" />
                                                    ) : (
                                                        <RiCheckboxBlankCircleLine className="sm:text-xl text-lg bg-muted rounded-full" color="transparent" />
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                        </motion.div>
                    </>
            }

            {
                isContextMenuOpenForTodos && <div className="w-full mx-auto max-w-5xl fixed bottom-0 left-0 right-0 bg-muted z-40 py-5 flex justify-around border-t-2 items-center">
                    <div className="flex flex-col items-center cursor-pointer">
                        <BsUnlock className="text-lg" onClick={handleHiddenTodo} />
                        <span className="text-xs">UnHide</span>
                    </div>
                    <div
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => setDeletedPopUpOpen(true)}
                    >
                        <AiOutlineDelete className="text-lg" />
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
                            <motion.div
                                className="bg-card p-4 text-center grid gap-4 rounded-lg max-w-[450px] w-[90%] mx-auto absolute bottom-3"
                                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
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
                            </motion.div>
                        </motion.div>
                    }
                </div>
            }
        </div>
    )
}

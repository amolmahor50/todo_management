import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox"
import { RxCross2 } from "react-icons/rx";
import { VscChecklist } from "react-icons/vsc";
import { deleteMultipleTasks, fetchTasks, TodoContextData, updateTaskCompletion } from "./context/TodoContext";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineDragIndicator } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TasksItems() {
    const {
        isContextMenuOpenForTodos,
        setIsContextMenuOpenForTodos,
        tasks,
        setTasks,
        user,
        searchQuery,
        setAddTaskPannelOpen,
    } = useContext(TodoContextData);
    const [isCardVisible, setIsCardVisible] = useState(true);
    const [deletePopUpOpen, setDeletePopUpOpen] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        if (!user.uid) return;

        const unsubscribe = fetchTasks(user.uid, setTasks);

        return () => unsubscribe();
    }, [user.uid, searchQuery]);

    const highlightMatch = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <span key={index} style={{ color: "red", fontWeight: "bold" }}>{part}</span> : part
        );
    };

    const toggleTaskSelection = (taskId) => {
        setSelectedTasks((prevSelected) => {
            if (prevSelected.includes(taskId)) {
                return prevSelected.filter((t) => t !== taskId);
            } else {
                return [...prevSelected, taskId];
            }
        });
    };

    const handleSelectItems = (e, taskId) => {
        e.preventDefault();

        setSelectedTasks((prev) => {
            if (prev.includes(taskId)) {
                return prev;
            }
            return [...prev, taskId];
        });
        setIsContextMenuOpenForTodos(true);
    }

    const hanldeEditTask = (taskId) => {
        setAddTaskPannelOpen(true);
        setSearchParams({ editTaskId: taskId })
    }

    // Handle multiple delete
    const handleDeleteItems = async () => {
        if (selectedTasks.length === 0) return;

        const success = await deleteMultipleTasks(user.uid, selectedTasks);
        if (success) {
            setTasks(prevTasks => prevTasks.filter(task => !selectedTasks.includes(task.id)));
            setSelectedTasks([]);
            setIsContextMenuOpenForTodos(false);
            setDeletePopUpOpen(false);
        }
    };

    const toggleTaskCompletion = async (taskId, isCompleted) => {
        try {
            // Update the task's completion status in the database
            await updateTaskCompletion(user.uid, taskId, !isCompleted);

            // Update local state after successful database update
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId ? { ...task, isCompleted: !isCompleted } : task
                )
            );
        } catch (error) {
            console.error("Error updating task completion:", error);
        }
    };

    return (
        <>
            {
                isContextMenuOpenForTodos ? (
                    <>
                        <div className="fixed top-0 left-0 sm:left-1/2 sm:translate-x-[-50%] sm:px-2 px-6 py-6 z-50 w-full max-w-5xl mx-auto">
                            <div className=" flex justify-between items-center">
                                <RxCross2 className="sm:text-2xl text-xl cursor-pointer" onClick={() => {
                                    {
                                        setIsContextMenuOpenForTodos(false)
                                        setSelectedTasks([])
                                    }
                                }
                                } />
                                <VscChecklist
                                    className="sm:text-2xl text-xl cursor-pointer"
                                    onClick={() => {
                                        if (selectedTasks.length === tasks.length) {
                                            setSelectedTasks([]);
                                        } else {
                                            setSelectedTasks(tasks.map(task => task.id));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <span className='text-2xl font-normal ml-2'>{selectedTasks.length} Selected Item</span>

                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {
                                tasks
                                    .filter(task => !task.isCompleted)
                                    .map((task, index) => (
                                        <motion.div
                                            key={index}
                                            onClick={() => toggleTaskSelection(task.id)}
                                            className={`${selectedTasks.includes(task.id) ? "bg-gray-200 text-muted" : "bg-card"} rounded-lg px-4 py-3 flex justify-between items-center gap-4 cursor-pointer shadow-sm hover:shadow-lg`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="flex items-center">
                                                <span>
                                                    <MdOutlineDragIndicator className="text-primary sm:text-xl text-lg cursor-move mr-4" />
                                                </span>
                                                <p className="text-muted-foreground text-sm line-clamp-3">
                                                    {task.taskMessage}
                                                </p>
                                            </div>
                                            <span className="cursor-pointer">
                                                {selectedTasks.includes(task.id) ? (
                                                    <GoCheckCircleFill className="sm:text-xl text-lg text-orange-500" />
                                                ) : (
                                                    <RiCheckboxBlankCircleLine className="sm:text-xl text-lg bg-muted rounded-full" color="transparent" />
                                                )}
                                            </span>

                                        </motion.div>
                                    ))
                            }
                        </motion.div>
                        <p
                            className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:mt-8 mt-4 cursor-pointer"
                            onClick={() => setIsCardVisible(!isCardVisible)}
                        >
                            {isCardVisible ? <MdKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
                            Completed {tasks.filter(task => task.isCompleted).length}
                        </p>
                        {/* Task Card complted */}
                        {isCardVisible && (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {tasks
                                    .filter(task => task.isCompleted)
                                    .map((task) => (
                                        <motion.div
                                            onClick={() => toggleTaskSelection(task.id)}
                                            key={task.id}
                                            className={`${selectedTasks.includes(task.id) ? "bg-gray-200" : "bg-card"} rounded-lg px-4 py-3 flex justify-between items-center gap-4 cursor-pointer shadow-sm hover:shadow-lg`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p className="text-muted-foreground text-sm line-clamp-3">
                                                {task.taskMessage}
                                            </p>

                                            <span className="cursor-pointer">
                                                {selectedTasks.includes(task.id) ? (
                                                    <GoCheckCircleFill className="sm:text-xl text-lg text-orange-500" />
                                                ) : (
                                                    <RiCheckboxBlankCircleLine className="sm:text-xl text-lg bg-muted rounded-full" color="transparent" />
                                                )}
                                            </span>
                                        </motion.div>
                                    ))}
                            </motion.div>
                        )}

                        <div className="w-full mx-auto max-w-5xl fixed bottom-0 left-0 right-0 bg-muted z-40 p-6 flex justify-center items-center">
                            <div className="flex flex-col items-center cursor-pointer" onClick={() => setDeletePopUpOpen(true)}>
                                <AiOutlineDelete className="text-lg" />
                                <span className="text-xs">Delete</span>
                            </div>
                        </div>
                        {
                            deletePopUpOpen && <motion.div
                                className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setDeletePopUpOpen(false)}
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
                                    <p className="text-sm text-muted-foreground">{`Delete ${selectedTasks.length} item?`}</p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <Button variant="secondary" onClick={() => {
                                            setSelectedTasks([])
                                            setIsContextMenuOpenForTodos(false)
                                            setDeletePopUpOpen(false)
                                        }}>
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDeleteItems}>
                                            Delete
                                        </Button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        }
                    </>
                )
                    :
                    (
                        <>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {
                                    tasks
                                        .filter(task =>
                                            !task.isCompleted &&
                                            task.taskMessage.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((task, index) => (
                                            <motion.div
                                                key={index}
                                                onContextMenu={(e) => handleSelectItems(e, task.id)}
                                                className="bg-card rounded-lg px-4 py-3 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-lg"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Checkbox
                                                    color="orange"
                                                    checked={task.isCompleted}
                                                    onCheckedChange={() => toggleTaskCompletion(task.id, task.isCompleted)}
                                                />

                                                <p
                                                    onClick={() => hanldeEditTask(task.id)}
                                                    className="text-primary text-sm line-clamp-3 flex-1"
                                                >
                                                    {highlightMatch(String(task.taskMessage), searchQuery)}
                                                </p>
                                            </motion.div>
                                        ))
                                }
                            </motion.div>
                            <p
                                className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:mt-8 mt-4 cursor-pointer"
                                onClick={() => setIsCardVisible(!isCardVisible)}
                            >
                                {isCardVisible ? <MdKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
                                Completed {tasks.filter(task => task.isCompleted).length}
                            </p>
                            {isCardVisible &&
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {
                                        tasks
                                            .filter(task =>
                                                task.isCompleted &&
                                                task.taskMessage.toLowerCase().includes(searchQuery.toLowerCase())
                                            )
                                            .map((task, index) => (
                                                <motion.div
                                                    key={index}
                                                    onContextMenu={(e) => handleSelectItems(e, task.id)}
                                                    className="bg-gray-200 rounded-lg px-4 py-3 flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-lg"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    whileHover={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <Checkbox
                                                        color="gray"
                                                        checked={task.isCompleted}
                                                        onCheckedChange={() => toggleTaskCompletion(task.id, task.isCompleted)}
                                                    />

                                                    <p
                                                        onClick={() => hanldeEditTask(task.id)}
                                                        className="dark:text-muted text-sm line-clamp-3 flex-1">
                                                        {highlightMatch(String(task.taskMessage), searchQuery)}
                                                    </p>
                                                </motion.div>
                                            ))
                                    }
                                </motion.div>
                            }
                        </>
                    )
            }

        </>
    )
}

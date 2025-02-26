import { IoIosArrowRoundBack } from "react-icons/io";
import { IoReturnUpBackOutline, IoReturnUpForwardOutline, IoCheckmarkOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useEffect, useRef, useState } from "react";
import { EditedfetchTodoById, TodoContextData, updateTodoIndb } from "../context/TodoContext";
import { PiShareFill } from "react-icons/pi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";

export default function EditTodo() {
    const {
        Notes,
    } = useContext(TodoContextData);
    const Navigate = useNavigate();
    const { userId, folder, taskId } = useParams();
    const [sharePopUpOpen, setSharePopUpOpen] = useState(false);
    const [showSendImg, setShowSendImg] = useState(false);

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

    const [history, setHistory] = useState([{ title: "", description: "" }]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const [todoData, setTodoData] = useState({
        title: "",
        description: "",
        date: "",
    });

    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [todoData.description]);

    useEffect(() => {
        if (userId && folder && taskId) {
            const unsubscribe = EditedfetchTodoById(userId, folder, taskId, (data) => {
                setTodoData(data || { title: "", description: "", date: "" });
            });

            return () => unsubscribe && unsubscribe();
        }
    }, [userId, folder, taskId]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...todoData, [name]: value };
        setTodoData(newData);

        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newData);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setTodoData(history[prevIndex]);
            setHistoryIndex(prevIndex);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setTodoData(history[nextIndex]);
            setHistoryIndex(nextIndex);
        }
    };

    // Handle save action
    const handleSaveTodo = () => {
        const updatedTodo = {
            title: todoData.title,
            description: todoData.description,
            date: formatDate(),
        };

        updateTodoIndb(userId, folder, taskId, updatedTodo);

        Navigate(-1);
    };

    const shareText = `*${todoData.title}*\n\n📅 Date: ${todoData.date}\n\n${todoData.description}`;

    // Share using Installed Apps (Web Share API)
    const handleTextShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: todoData.title,
                    text: shareText,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            alert("Your browser does not support native sharing.");
        }
    };

    const handleShareAsImage = async () => {
        setShowSendImg(true);

        setTimeout(async () => {
            const element = document.getElementById("shareable-note");

            if (!element) return;

            try {
                const canvas = await html2canvas(element, {
                    backgroundColor: null,
                    scale: 2,
                    x: -20,
                    y: -20,
                    width: element.offsetWidth + 40,
                    height: element.offsetHeight + 40
                });

                const imageDataUrl = canvas.toDataURL("image/png");

                if (navigator.share) {
                    const blob = await (await fetch(imageDataUrl)).blob();
                    const file = new File([blob], "Note.png", { type: "image/png" });

                    try {
                        await navigator.share({
                            files: [file],
                            title: "Shared Note",
                            text: todoData.title,
                        });
                    } catch (error) {
                        console.error("Error sharing:", error);
                    }
                } else {
                    alert("Your browser does not support image sharing.");
                }
            } catch (error) {
                console.error("Error generating image:", error);
            }

            setShowSendImg(false);
            setSharePopUpOpen(false);
        }, 300);
    };

    const handleDeletedTask = async () => {
        try {
            await deleteDoc(doc(db, "users", userId, "todos", folder, "tasks", taskId));
            console.log("Task deleted successfully!");
            Navigate(-1);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    const handleMoveTask = () => {

        // Collect selected todos data
        const selectedTasksData = Notes.filter(note => note.id === taskId);
        // Navigate to create-folder and pass selected notes as state
        Navigate("/create-folder", { state: { selectedTasks: selectedTasksData } });
    }

    // Determine which icons to show
    const shouldShowShareIcon = !isEditing && (todoData.title || todoData.description);
    const shouldShowUndoRedo = isEditing;

    return (
        <>
            <div className="flex justify-between items-center">
                <IoIosArrowRoundBack onClick={() => Navigate(-1)} size={30} className="cursor-pointer" />
                <div className="flex sm:gap-8 gap-6 items-center">
                    {shouldShowUndoRedo ? (
                        <>
                            <IoReturnUpBackOutline
                                size={22}
                                className={`cursor-pointer ${historyIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleUndo();
                                }}
                            />
                            <IoReturnUpForwardOutline
                                size={22}
                                className={`cursor-pointer ${historyIndex === history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleRedo();
                                }}
                            />
                            <IoCheckmarkOutline size={22} className="cursor-pointer"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSaveTodo();
                                }}
                            />
                        </>
                    ) : shouldShowShareIcon ? (
                        <div className="flex items-center gap-6">
                            <PiShareFill size={20} className="cursor-pointer" onClick={() => setSharePopUpOpen(true)} />
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none cursor-pointer flex items-center gap-1">
                                    <BsThreeDotsVertical size={18} className="cursor-pointer" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="relative sm:right-20 right-2">
                                    <DropdownMenuItem >
                                        Hide
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        Place on Home screen
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleMoveTask}>
                                        Move to
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDeletedTask}>
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : null}

                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <Input
                    name="title"
                    value={todoData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                    className="font-medium leading-none bg-transparent border-none p-0"
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                />
                <p className="text-xs text-muted-foreground">
                    {formatDate()} | {todoData.title.length} characters
                </p>
                <Textarea
                    ref={textareaRef}
                    name="description"
                    value={todoData.description}
                    onChange={handleInputChange}
                    placeholder="Start writing..."
                    className="bg-transparent border-none p-0 outline-none mt-4 no-scrollbar resize-none overflow-hidden"
                    rows={1}
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                />
            </div>
            {
                sharePopUpOpen && <motion.div
                    className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSharePopUpOpen(false)}
                >
                    <motion.div
                        className="bg-card p-6 grid gap-4 rounded-lg max-w-[450px] w-[90%] mx-auto absolute bottom-3"
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-center">Share note</h3>
                        <p className="text-sm text-primary cursor-pointer" onClick={handleTextShare}>Share note as text</p>
                        <p className="text-sm text-primary cursor-pointer" onClick={handleShareAsImage}>Share note as picture</p>
                        <Button variant="secondary" onClick={() => setSharePopUpOpen(false)}>
                            Cancel
                        </Button>
                    </motion.div>
                </motion.div>
            }
            {/* Shareable Note - Only visible when showNote is true */}
            {showSendImg && (
                <div className="w-[380px] p-6 bg-gray-100">
                    <div
                        id="shareable-note"
                        className="w-[350px] p-4 border-2 border-gray-400 rounded-lg bg-white shadow-lg m-6"
                    >
                        <h2 className="text-lg font-bold text-black">{todoData.title}</h2>
                        <p className="text-xs text-muted-foreground mt-1">📅 {todoData.date}</p>
                        <hr className="my-2 border-gray-300" />
                        <p className="text-sm text-gray-700">{todoData.description}</p>
                    </div>
                </div>
            )}
        </>
    );
}

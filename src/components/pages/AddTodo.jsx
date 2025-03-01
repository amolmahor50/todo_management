import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline, IoReturnUpForwardOutline, IoCheckmarkOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useContext } from "react";
import { addTodoData, TodoContextData } from "../context/TodoContext";
import { PiShareFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AddTodo() {
    const { user, selectedFolder } = useContext(TodoContextData);
    const Navigate = useNavigate();
    const [sharePopUpOpen, setSharePopUpOpen] = useState(false);
    const [showSendImg, setShowSendImg] = useState(false);

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

    const [TodoData, setTodoData] = useState({
        title: "",
        description: "",
        date: formatDate(),
        pinned: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newData = { ...TodoData, [name]: value };
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

    const handleSaveTodo = async () => {
        if (!TodoData.title) return Navigate(-1);

        const folderTab = selectedFolder === "All" ? "Uncategorised" : selectedFolder;
        await addTodoData(user.uid, folderTab, { ...TodoData, pinned: false });
        Navigate('/todo-management');
    };

    const shareText = `*${TodoData.title}*\n\n📅 Date: ${TodoData.date}\n\n${TodoData.description}`;

    // Share using Installed Apps (Web Share API)
    const handleTextShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: TodoData.title,
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
        }, 300);
    };

    // Determine which icons to show
    const shouldShowShareIcon = !isEditing && (TodoData.title || TodoData.description);
    const shouldShowUndoRedo = isEditing;

    return (
        <>
            <div className="flex justify-between items-center">
                <IoIosArrowRoundBack onClick={() => Navigate(-1)} size={36} className="cursor-pointer" />
                <div className="flex gap-8 items-center">
                    {shouldShowUndoRedo ? (
                        <>
                            <IoReturnUpBackOutline
                                size={24}
                                className={`cursor-pointer ${historyIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleUndo();
                                }}
                            />
                            <IoReturnUpForwardOutline
                                size={24}
                                className={`cursor-pointer ${historyIndex === history.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleRedo();
                                }}
                            />
                            <IoCheckmarkOutline
                                size={24}
                                className="cursor-pointer"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSaveTodo();
                                }}
                            />
                        </>
                    ) : shouldShowShareIcon ? (
                        <div className="flex items-center gap-6">
                            <PiShareFill size={22} className="cursor-pointer" onClick={() => setSharePopUpOpen(true)} />
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <Input
                    name="title"
                    placeholder="Title"
                    className="font-medium leading-none bg-transparent border-none p-0"
                    value={TodoData.title}
                    onChange={handleInputChange}
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                />
                <p className="text-xs text-muted-foreground">
                    {TodoData.date} | {TodoData.title.length} characters
                </p>
                <Textarea
                    name="description"
                    placeholder="Start writing..."
                    value={TodoData.description}
                    onChange={handleInputChange}
                    onFocus={() => setIsEditing(true)}
                    onBlur={() => setIsEditing(false)}
                    className="bg-transparent border-none p-0 outline-none mt-4 no-scrollbar resize-none overflow-hidden"
                    rows={1}
                    onInput={(e) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
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

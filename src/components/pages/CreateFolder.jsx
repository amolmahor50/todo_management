import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack, IoIosCheckmark, IoIosAdd } from "react-icons/io";
import { RiDeleteBinLine, RiCheckboxBlankCircleLine } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import { TiPinOutline } from "react-icons/ti";
import { AiOutlineDelete } from "react-icons/ai";
import { PiPencilSimpleLine } from "react-icons/pi";
import { VscChecklist } from "react-icons/vsc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { createFolder, deleteFolder, fetchFoldersRealtime, moveSelectedTasksToFolder, TodoContextData, toggleFolderPinned, updateFolderName } from "../context/TodoContext";
import { GoCheckCircleFill } from "react-icons/go";

export default function CreateFolder() {
    const { user, folderName, setFolderName, selectedFolder, setSelectedFolder } = useContext(TodoContextData);
    const Navigate = useNavigate();
    const location = useLocation();
    const selectedTasks = location.state?.selectedTasks || [];

    const [deletedPopUpOpen, setDeletedPopUpOpen] = useState(false);
    const [openCreateFolderPopUp, setOpenCreateFolderPopUp] = useState(false);
    const [inputFolderName, setInputFolderName] = useState("");
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [rightClickedFolder, setRightClickedFolder] = useState([]);

    useEffect(() => {
        const unsubscribe = fetchFoldersRealtime(user.uid, setFolderName);
        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
        };
    }, [user?.uid]);

    const handleClickFetchData = (tabFolder) => {
        setSelectedFolder(tabFolder);
        Navigate("/todo-management");
    };

    const handleRightClick = (e, folderName) => {
        e.preventDefault();

        if (folderName === "All" || folderName === "Uncategorised") return;

        setRightClickedFolder((prev) => {
            if (prev.includes(folderName)) {
                return prev;
            }
            return [...prev, folderName];
        });
        setIsContextMenuOpen(true);
    };

    const closeContextMenu = () => {
        setIsContextMenuOpen(false);
        setRightClickedFolder([]);
    };

    const handleCreateFolder = async () => {
        await createFolder(user.uid, inputFolderName);
        setInputFolderName("");
        setOpenCreateFolderPopUp(false);
    };

    const toggleFolderSelection = (folderName) => {
        if (folderName === "All" || folderName === "Uncategorised") return;

        setRightClickedFolder((prevSelected) => {
            if (prevSelected.includes(folderName)) {
                return prevSelected.filter(name => name !== folderName);
            } else {
                return [...prevSelected, folderName];
            }
        });
    };

    const handleDeletedFolder = async () => {
        try {
            await Promise.all(
                rightClickedFolder.map(async (folderName) => {
                    await deleteFolder(user.uid, folderName);
                })
            );

            setFolderName(prevFolders => prevFolders.filter(folder => !rightClickedFolder.includes(folder.name)));

            setRightClickedFolder([]);
            setDeletedPopUpOpen(false);
            setIsContextMenuOpen(false);
        } catch (error) {
            console.error("Error deleting folders:", error);
        }
    };

    const handleEditFolder = async () => {
        if (rightClickedFolder.length === 0 || !inputFolderName.trim()) return;

        const oldFolderName = rightClickedFolder[0];
        const newFolderName = inputFolderName.trim();

        try {
            await updateFolderName(user.uid, oldFolderName, newFolderName);
            setFolderName((prevFolders) =>
                prevFolders.map(folder =>
                    folder.name === oldFolderName ? { ...folder, name: newFolderName } : folder
                )
            );

            setRightClickedFolder([]);
            setOpenCreateFolderPopUp(false);
            setIsContextMenuOpen(false);
            setInputFolderName("");
        } catch (error) {
            console.error("Error updating folder:", error);
        }
    };

    const handleMoveTask = async (targetFolder) => {
        if (!selectedTasks.length) {
            console.error("No tasks selected!");
            return;
        }

        // Extract the folder name from the first task
        const sourceFolder = selectedTasks[0]?.folder;

        if (!sourceFolder) {
            console.error("Source folder not found!");
            return;
        }

        await moveSelectedTasksToFolder(user.uid, selectedTasks, sourceFolder, targetFolder);

        setSelectedFolder(targetFolder);
        Navigate("/todo-management");
    };

    return (
        <>
            {isContextMenuOpen && rightClickedFolder.length > 0 ? (
                <>
                    <motion.div
                        className="w-full mx-auto max-w-5xl fixed top-0 left-0 right-0 bg-muted z-40 p-6 flex justify-between items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <RxCross2 className="sm:text-2xl text-xl cursor-pointer" onClick={closeContextMenu} />
                        <span>{`${rightClickedFolder.length} item selected`}</span>
                        <VscChecklist
                            className="sm:text-2xl text-xl cursor-pointer"
                            onClick={() => {
                                const selectableFolders = folderName
                                    .map(folder => folder.name)
                                    .filter(name => name !== "All" && name !== "Uncategorised");

                                if (rightClickedFolder.length === selectableFolders.length) {
                                    setRightClickedFolder([]);
                                } else {
                                    setRightClickedFolder(selectableFolders);
                                }
                            }}
                        />
                    </motion.div>
                    <div className="grid gap-2 mt-16">
                        {Array.isArray(folderName) &&
                            folderName
                                .filter(folder => folderName.length >= 2 || folder.name !== "Uncategorised")
                                .map((folder, index) => {
                                    const isSelected = Array.isArray(rightClickedFolder) && rightClickedFolder.includes(folder.name);
                                    const isExcluded = folder.name === "All" || folder.name === "Uncategorised";

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => toggleFolderSelection(folder.name)}
                                            className="bg-card rounded-lg flex justify-between items-center px-4 py-2 text-sm"
                                        >
                                            <div className="flex items-center gap-1">
                                                <IoIosCheckmark
                                                    size={30}
                                                    color="orange"
                                                    className={selectedFolder === folder.name ? "visible" : "invisible"}
                                                />
                                                <span className={selectedFolder === folder.name ? "font-semibold" : "font-normal"}>{folder.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {folder.pinned ? <TiPinOutline className="text-sm sm:text-lg text-yellow-600" /> : ""}
                                                <div>
                                                    {!isExcluded ? (
                                                        isSelected ? (
                                                            <GoCheckCircleFill className="sm:text-xl text-lg" color="orange" />
                                                        ) : (
                                                            <RiCheckboxBlankCircleLine className="sm:text-xl text-lg bg-muted rounded-full" color="transparent" />
                                                        )
                                                    ) : null}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}
                    </div>

                    <motion.div
                        className="w-full mx-auto max-w-5xl fixed bottom-0 left-0 right-0 bg-muted z-40 p-6 flex justify-between items-center"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col items-center cursor-pointer"
                            onClick={() => {
                                if (rightClickedFolder.length === 1) {
                                    const folderToPin = folderName.find(folder => folder.name === rightClickedFolder[0]);
                                    if (folderToPin) {
                                        toggleFolderPinned(user.uid, folderToPin.name, folderToPin.pinned);
                                        setIsContextMenuOpen(false);
                                    }
                                }
                            }}>
                            <TiPinOutline className="text-lg" />
                            <span className="text-xs">Pin</span>
                        </div>
                        <div className="flex flex-col items-center cursor-pointer"
                            onClick={() => setDeletedPopUpOpen(true)}>
                            <AiOutlineDelete className="text-lg" />
                            <span className="text-xs">Delete</span>
                        </div>
                        <div className="flex flex-col items-center cursor-pointer"
                            onClick={() => {
                                setOpenCreateFolderPopUp(true);
                                setInputFolderName(rightClickedFolder[0]); // Setting the value
                            }}
                        >
                            <PiPencilSimpleLine className="text-lg" />
                            <span className="text-xs">Edit</span>
                        </div>
                    </motion.div>
                </>
            ) : (
                <>
                    <div className="w-full mx-auto max-w-5xl fixed top-0 left-0 right-0 bg-muted z-40 p-6 flex justify-between items-center">
                        <IoIosArrowRoundBack className="sm:text-3xl text-2xl cursor-pointer" onClick={() => Navigate(-1)} />
                        <span>Folders</span>
                        <RiDeleteBinLine className="sm:text-xl text-lg cursor-pointer" />
                    </div>

                    {/* Folder List */}
                    <div className="grid gap-2 sm:mt-20 mt-16">
                        {Array.isArray(folderName) &&
                            folderName.map((folder, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        handleClickFetchData(folder.name)
                                        handleMoveTask(folder.name)
                                    }}
                                    onContextMenu={(e) => handleRightClick(e, folder.name)}
                                    className="bg-card rounded-lg flex justify-between items-center px-4 py-2 text-sm"
                                >
                                    <div className="flex items-center gap-1">
                                        <IoIosCheckmark
                                            size={30}
                                            color="orange"
                                            className={selectedFolder === folder.name ? "visible" : "invisible"}
                                        />
                                        <span className={selectedFolder === folder.name ? "font-semibold" : "font-normal"}>{folder.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {folder.pinned ? <TiPinOutline className="text-sm sm:text-lg text-yellow-600" /> : ""}
                                        <div className="text-xs sm:text-sm">{folder.taskCount}</div>
                                    </div>
                                </button>
                            ))}
                    </div>

                    {/* New Folder Button */}
                    <div className="bg-card rounded-lg flex justify-center items-center mt-4 px-4 py-2">
                        <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={() => setOpenCreateFolderPopUp(true)}>
                            <IoIosAdd className="rounded-full bg-yellow-400 text-white text-xl" />
                            <span className="text-xs sm:text-sm">New folder</span>
                        </div>
                    </div>
                </>
            )
            }

            {/* Pop-up for Creating Folder */}
            {
                deletedPopUpOpen && (
                    <motion.div
                        className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-40"
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
                            <h3>Delete Folder</h3>
                            <p className="text-sm text-muted-foreground">{`Delete ${rightClickedFolder.length} item?`}</p>
                            <div className="grid grid-cols-2 gap-6">
                                <Button variant="secondary" onClick={() => setDeletedPopUpOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="blue" onClick={handleDeletedFolder}>
                                    OK
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )
            }

            {/* Pop-up for Creating Folder */}
            {
                openCreateFolderPopUp && (
                    <motion.div
                        className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpenCreateFolderPopUp(false)}
                    >
                        <motion.div
                            className="bg-card p-4 text-center grid gap-4 rounded-lg max-w-[450px] w-[90%] mx-auto absolute bottom-3"
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>New Folder</h3>
                            <Input
                                id="text"
                                name="text"
                                type="text"
                                value={inputFolderName}
                                onChange={(e) => setInputFolderName(e.target.value)}
                                placeholder="Unnamed folder"
                                className="border-2 focus:border-yellow-500"
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <Button variant="secondary" onClick={() => setOpenCreateFolderPopUp(false)}>
                                    Cancel
                                </Button>
                                <Button variant="blue" onClick={() => {
                                    if (rightClickedFolder.length > 0) {
                                        handleEditFolder();
                                    } else {
                                        handleCreateFolder();
                                    }
                                }}>
                                    OK
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )
            }
        </>
    );
}
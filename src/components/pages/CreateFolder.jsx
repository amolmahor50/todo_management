import { IoIosArrowRoundBack } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoIosCheckmark } from "react-icons/io";
import { IoIosAdd } from 'react-icons/io';
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TodoContextData } from "../context/TodoContext";

export default function CreateFolder() {
    const { folderNote, setFolderNote } = useContext(TodoContextData);
    const [openCreateFolderPopUp, setOpenCreateFolderPopUp] = useState(false);
    const [folderName, setFolderName] = useState("");

    // Utility function to convert text to a slug (e.g., "All" => "all")
    const slugify = (text) => {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    };

    const Navigate = useNavigate();

    // Function to handle adding a new folder
    const handleAddFolder = () => {
        // Check if the folder name is not empty and does not already exist
        if (folderName.trim() !== "" && !folderNote.includes(folderName)) {
            // Add the new folder name to the state
            setFolderNote((prev) => [...prev, folderName]);
            // Close the pop-up after adding the folder
            setOpenCreateFolderPopUp(false);
            setFolderName("");
        }
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <IoIosArrowRoundBack className="sm:text-3xl text-2xl cursor-pointer" onClick={() => Navigate(-1)} />
                <span>Folders</span>
                <RiDeleteBinLine className="sm:text-xl text-lg cursor-pointer" />
            </div>
            <div className="grid gap-2 mt-6">
                {
                    folderNote.map((folder, index) => (
                        <Link
                            to={folder === "All" ? "/todo-management" : `/todo-management/${slugify(folder)}`}
                            key={index}
                            className="bg-card rounded-lg flex justify-between items-center px-4 py-2"
                        >
                            <div className="flex items-center gap-1">
                                <IoIosCheckmark size={30} color="orange" />
                                <span>{folder}</span>
                            </div>
                            <div>3</div>
                        </Link>
                    ))
                }
                <Link
                    to="/todo-management"
                    className="bg-card rounded-lg flex justify-between items-center px-4 py-2" >
                    <div className="flex items-center gap-1">
                        <IoIosCheckmark size={30} color="orange" />
                        <span>Uncategorised</span>
                    </div>
                    <div>3</div>
                </Link>
            </div>
            <div className="bg-card rounded-lg flex justify-center items-center mt-4 px-4 py-2">
                <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={() => setOpenCreateFolderPopUp(true)}>
                    <IoIosAdd className="rounded-full bg-yellow-400 text-white text-xl" />
                    <span className="text-xs sm:text-sm">New folder</span>
                </div>
            </div>

            {/* Pop-up with Animation */}
            {openCreateFolderPopUp && (
                <motion.div
                    className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setOpenCreateFolderPopUp(false)} // Close on background click
                >
                    <motion.div
                        className="bg-card p-4 text-center grid gap-4 rounded-lg max-w-[450px] w-[90%] mx-auto absolute bottom-5"
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()} // Prevent background click from closing
                    >
                        <h3>New Folder</h3>
                        <Input
                            id="text"
                            name="text"
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Unnamed folder"
                            className="border-2 focus:border-yellow-500"
                        />
                        <div className="grid grid-cols-2 gap-6">
                            <Button variant="secondary" onClick={() => setOpenCreateFolderPopUp(false)}>Cancel</Button>
                            <Button variant="blue" onClick={handleAddFolder}>OK</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    )
}

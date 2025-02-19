import { SlFolderAlt } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { TodoContextData } from "./context/TodoContext";

export default function Navbar() {
    const { folderName } = useContext(TodoContextData);

    const location = useLocation();
    const navigate = useNavigate();

    // Get the folder name from the pathname (excluding "/todo-management/")
    const currentFolder = location.pathname.split('/').pop().toLowerCase(); // Convert to lowercase

    // Convert folderName items to lowercase and check if currentFolder exists
    const isFolder = folderName.map(folder => folder?.name.toLowerCase()).includes(currentFolder);

    return (
        <div className="flex justify-between items-center bg-muted px-8 py-4">
            <div></div>
            <div className="text-medium">
                {location.pathname === "/todo-management" || location.pathname === "/todo-management/uncategorised" || isFolder ? "Notes" : "Tasks"}
            </div>
            <div className="flex gap-6 items-center">
                {location.pathname === "/todo-management" || isFolder ? (
                    <SlFolderAlt className="text-xl cursor-pointer" onClick={() => navigate('/create-folder')} />
                ) : ""}
                <IoSettingsOutline className="text-xl cursor-pointer" onClick={() => navigate("/setting")} />
            </div>
        </div>
    );
}

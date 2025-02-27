import { SlFolderAlt } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center bg-muted px-8 py-4">
            <div></div>
            <div>
                {location.pathname === "/todo-management" ? "Notes" : "Tasks"}
            </div>
            <div className="flex gap-6 items-center">
                {location.pathname === "/todo-management" && (
                    <SlFolderAlt size={22} className="cursor-pointer" onClick={() => navigate('/create-folder')} />
                )}
                <IoSettingsOutline size={22} className="cursor-pointer" onClick={() => navigate("/setting")} />
            </div>
        </div>
    );
}

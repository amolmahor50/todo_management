import { SlFolderAlt } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center sm:px-0 px-3">
            <div className="flex gap-3 items-center text-2xl">
                <img src="/favicon.png"
                    className="h-8 w-8"
                />
                {location.pathname === "/todo-management" ? "Notes" : "Tasks"}
            </div>
            <div>

            </div>
            <div className="flex gap-7 items-center">
                {location.pathname === "/todo-management" && (
                    <SlFolderAlt size={24} className="cursor-pointer" onClick={() => navigate('/create-folder')} />
                )}
                <IoSettingsOutline size={24} className="cursor-pointer" onClick={() => navigate("/setting")} />
            </div>
        </div>
    );
}

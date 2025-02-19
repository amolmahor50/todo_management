import { SlFolderAlt } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center bg-muted px-8 py-4">
            <div></div>
            <div className="text-medium">
                Notes
            </div>
            <div className="flex gap-6 items-center">
                {location.pathname === "/todo-management" && (
                    <SlFolderAlt className="text-xl cursor-pointer" onClick={() => navigate('/create-folder')} />
                )}
                <IoSettingsOutline className="text-xl cursor-pointer" onClick={() => navigate("/setting")} />
            </div>
        </div>
    );
}

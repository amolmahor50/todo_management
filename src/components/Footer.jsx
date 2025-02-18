import { PiNoteDuotone } from "react-icons/pi";
import { IoCheckboxOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
    const location = useLocation();

    return (
        <div className='flex justify-around items-center py-3 bg-muted z-50'>
            <Link to='' className="flex flex-col gap-1 items-center cursor-pointer font-normal">
                <PiNoteDuotone className="text-lg" color={location.pathname === "/todo-management" ? "black" : "gray"} />
                <span className={`text-xs sm:text-sm ${location.pathname === "/todo-management" ? "font-bold text-black-800" : "text-gray-700"}`}>Notes</span>
            </Link>
            <Link to='tasks' className="flex flex-col gap-1 items-center cursor-pointer font-normal">
                <IoCheckboxOutline color={location.pathname === "/todo-management/tasks" ? "black" : "gray"} />
                <span className={`text-xs sm:text-sm ${location.pathname === "/todo-management/tasks" ? "font-bold text-black-800" : "text-gray-700"}`}>Tasks</span>
            </Link>
        </div>
    )
}

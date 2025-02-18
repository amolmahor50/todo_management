import { PiNoteDuotone } from "react-icons/pi";
import { IoCheckboxOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

export default function Footer() {
    const location = useLocation();

    return (
        <div className='flex justify-around items-center py-3 bg-muted'>
            <Link to='' className="flex flex-col gap-1 items-center cursor-pointer font-normal">
                <PiNoteDuotone />
                <span className={`text-xs sm:text-sm ${location.pathname === "/todo-management" ? "font-semibold text-primary" : "text-foreground"}`}>Notes</span>
            </Link>
            <Link to='tasks' className="flex flex-col gap-1 items-center cursor-pointer font-normal">
                <IoCheckboxOutline />
                <span className={`text-xs sm:text-sm ${location.pathname === "/todo-management/tasks" ? "font-semibold text-primary" : "text-foreground"}`}>Tasks</span>
            </Link>
        </div>
    )
}

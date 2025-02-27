import { BiNotepad } from "react-icons/bi";
import { MdOutlineCheckBox } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { LuLock } from "react-icons/lu";

export default function Footer() {
    const location = useLocation();

    return (
        <div className='flex justify-around items-center py-3 bg-muted'>
            <Link to='' className={`flex flex-col gap-1 items-center cursor-pointer ${location.pathname === "/todo-management" && "text-orange-700"}`}>
                <BiNotepad size={20} />
                <span className='text-xs sm:text-sm'>Notes</span>
            </Link>
            <Link to='tasks' className={`flex flex-col gap-1 items-center cursor-pointer ${location.pathname === "/todo-management/tasks" && "text-orange-700"}`}>
                <MdOutlineCheckBox size={20} />
                <span className='text-xs sm:text-sm'>Tasks</span>
            </Link>
            <Link to='/lock' className={`flex flex-col gap-1 items-center cursor-pointer`}>
                <LuLock size={20} />
                <span className='text-xs sm:text-sm'>Hide</span>
            </Link>
        </div>
    )
}

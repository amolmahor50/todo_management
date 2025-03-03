import { Input } from "@/components/ui/input"
import { useContext } from "react";
import { IoIosSearch } from "react-icons/io"
import { RxCross2 } from "react-icons/rx";
import { TodoContextData } from "./context/TodoContext";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

function SearchNotes() {
    const {
        searchQuery,
        setSearchQuery
    } = useContext(TodoContextData);

    const location = useLocation();

    return (
        <div className='sm:max-w-lg w-full my-2 mb-4'>
            <div className="flex justify-between items-center bg-popover px-4 py-[1px] w-full rounded-lg">
                <div className="flex items-center w-full">
                    <IoIosSearch size={22} />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={`Search ${location.pathname === "/todo-management" ? "Notes" : "Tasks"}`}
                        className="bg-none border-none text-sm w-full"
                    />
                </div>
                {searchQuery.length > 0 && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="cursor-pointer"
                        onClick={() => setSearchQuery("")}
                    >
                        <RxCross2 size={20} />
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default SearchNotes;

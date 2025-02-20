import { Input } from "@/components/ui/input"
import { useContext } from "react";
import { IoIosSearch } from "react-icons/io"
import { RxCross2 } from "react-icons/rx";
import { TodoContextData } from "./context/TodoContext";
import { motion } from "framer-motion";

function SearchNotes() {
    const { searchQuery, setSearchQuery } = useContext(TodoContextData);

    return (
        <div className='sm:max-w-lg w-full my-2 mb-4'>
            <div className="flex justify-between items-center bg-popover px-4 w-full rounded-full">
                <div className="flex items-center">
                    <IoIosSearch className="text-medium sm:text-lg" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search notes"
                        className="bg-none border-none text-xs p-0 ml-2"
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
                        <RxCross2 className="text-sm sm:text-medium" />
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default SearchNotes;

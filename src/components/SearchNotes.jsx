import { Input } from "@/components/ui/input"
import { IoIosSearch } from "react-icons/io"

function SearchNotes() {
    return (
        <div className='sm:max-w-lg w-full my-2 mb-4'>
            <div className="flex items-center bg-popover px-4 w-full rounded-full">
                <IoIosSearch />
                <Input
                    placeholder="Search notes"
                    className="bg-none border-none text-xs p-0 ml-2"
                />
            </div>
        </div>
    )
}

export default SearchNotes;
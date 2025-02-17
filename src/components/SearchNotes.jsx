import { Input } from "@/components/ui/input"
import { IoIosSearch } from "react-icons/io"

function SearchNotes() {
    return (
        <div className='sm:max-w-lg w-full flex my-2 mb-4'>
            <div className="flex items-center bg-gray-200 px-4 w-full rounded-full">
                <IoIosSearch />
                <Input
                    placeholder="Search notes"
                    className="bg-transparent border-none"
                />
            </div>
        </div>
    )
}

export default SearchNotes
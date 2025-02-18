import React, { useContext } from 'react'
import SearchNotes from '../SearchNotes'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { TodoContextData } from '../context/TodoContext'

function Notes() {
    const { folderNote } = useContext(TodoContextData);
    const location = useLocation();

    // Utility function to convert text to a slug (e.g., "All" => "all")
    const slugify = (text) => {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    };

    // Function to check if the current folder is active
    const isActive = (folder) => {
        return location.pathname === `/todo-management/${slugify(folder)}` || (folder === "All" && location.pathname === "/todo-management");
    };

    return (
        <div className='flex flex-col'>
            <SearchNotes />
            <span className='text-2xl font-normal ml-2'>Notes</span>
            <div className='flex gap-2 items-center sm:ml-2 mt-2 overflow-scroll no-scrollbar'>
                {
                    folderNote?.map((folder, index) => (
                        folderNote.length > 1 && <Link
                            to={folder === "All" ? "/todo-management" : `/todo-management/${slugify(folder)}`}
                            className={`cursor-pointer text-xs px-3 py-1 rounded-lg bg-secondary border ${isActive(folder) && "bg-yellow-400 text-primary"}`}
                            key={index}>
                            {folder}
                        </Link>
                    ))
                }
            </div>
            <Outlet />
        </div>
    )
}

export default Notes

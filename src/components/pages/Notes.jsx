import { useContext, useEffect } from 'react'
import SearchNotes from '../SearchNotes'
import { Outlet } from 'react-router-dom'
import { TiPinOutline } from "react-icons/ti";
import { fetchFoldersRealtime, TodoContextData } from '../context/TodoContext'

function Notes() {
    const {
        user,
        folderName,
        setFolderName,
        selectedFolder,
        setSelectedFolder,
        isContextMenuOpenForTodos
    } = useContext(TodoContextData);

    useEffect(() => {
        if (user?.uid) {
            const unsubscribe = fetchFoldersRealtime(user.uid, setFolderName);
            return () => unsubscribe && unsubscribe(); // Cleanup function to stop listening
        }
    }, [user]);

    return (
        <>
            {
                !isContextMenuOpenForTodos && (
                    <div className='flex flex-col'>
                        <SearchNotes />
                        <span className='text-2xl font-normal ml-2'>Notes</span>
                        <div className='flex gap-2 items-center sm:ml-2 mt-2 overflow-scroll no-scrollbar'>
                            {Array.isArray(folderName) && folderName.length > 2 && folderName.map((folder, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedFolder(folder.name)}
                                    className={`truncate px-3 py-1 rounded-md border-2 border-accent-foreground shadow-xl text-xs flex items-center gap-1
                                ${selectedFolder === folder.name ? "bg-accent-foreground text-accent" : ""}`}>
                                    {folder.pinned && <TiPinOutline className='text-xs sm:text-sm' color='orange' />}
                                    {(folder.name).length > 15 ? (folder.name).slice(0, 15) + "..." : folder.name}
                                    <span className="text-xs">({folder.taskCount})</span>
                                </button>
                            ))}
                        </div>
                    </div >
                )
            }
            <Outlet />
        </>

    )
}

export default Notes;

import { useContext, useEffect } from 'react'
import SearchNotes from '../SearchNotes'
import { Outlet } from 'react-router-dom'
import { fetchFoldersRealtime, TodoContextData } from '../context/TodoContext'

function Notes() {
    const { user,
        folderName,
        setFolderName,
        selectedFolder, setSelectedFolder,
        isContextMenuOpenForTodos
    } = useContext(TodoContextData);

    useEffect(() => {
        const unsubscribe = fetchFoldersRealtime(user.uid, setFolderName);

        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
        };
    }, [user?.uid]);

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
                                    className={`px-3 py-1 rounded-md border border-white text-xs flex items-center gap-1 min-w-fit
                                ${selectedFolder === folder.name ? "bg-yellow-400 dark:text-black border-none" : ""}`}>
                                    {folder.name}
                                    <span className="text-gray-500 text-xs">({folder.taskCount})</span>
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

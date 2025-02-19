import { useContext, useEffect } from 'react'
import SearchNotes from '../SearchNotes'
import { Outlet } from 'react-router-dom'
import { fetchFoldersRealtime, TodoContextData } from '../context/TodoContext'

function Notes() {
    const { user, folderName, setFolderName, selectedFolder, setSelectedFolder } = useContext(TodoContextData);
    useEffect(() => {
        const unsubscribe = fetchFoldersRealtime(user.uid, setFolderName);

        return () => unsubscribe && unsubscribe();
    }, [user.uid]);

    return (
        <div className='flex flex-col'>
            <SearchNotes />
            <span className='text-2xl font-normal ml-2'>Notes</span>
            <div className='flex gap-2 items-center sm:ml-2 mt-2 overflow-scroll no-scrollbar'>
                {folderName.length > 0 &&
                    <button
                        onClick={() => setSelectedFolder("All")}
                        className={`px-3 py-1 rounded-md border text-xs ${selectedFolder === "All" && "bg-yellow-400"}`}>
                        All
                    </button>
                }
                {folderName?.map((folder, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedFolder(folder.name)}
                        className={`px-3 py-1 rounded-md border text-xs ${selectedFolder === folder.name && "bg-yellow-400"}`}>
                        {folder.id}
                    </button>
                ))
                }
                {folderName.length > 0 &&
                    <button
                        onClick={() => setSelectedFolder("Uncategorised")}
                        className={`px-3 py-1 rounded-md border text-xs ${selectedFolder === "Uncategorised" && "bg-yellow-400"}`}>
                        Uncategorised
                    </button>
                }
            </div>
            <Outlet />
        </div >
    )
}

export default Notes

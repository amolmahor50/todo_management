import { useContext, useEffect } from 'react'
import SearchNotes from '../SearchNotes'
import { Outlet } from 'react-router-dom'
import { TiPinOutline } from "react-icons/ti";
import { fetchFoldersRealtime, TodoContextData } from '../context/TodoContext'
import Chip from '@mui/material/Chip';

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
                        <div className='flex gap-2 items-center sm:ml-2 mt-2 overflow-scroll no-scrollbar'>
                            {Array.isArray(folderName) && folderName.length > 2 && folderName.map((folder, index) =>
                                <Chip
                                    key={index}
                                    size="small"
                                    label={
                                        <div className="flex items-center gap-1 dark:text-primary">
                                            {folder.pinned && <TiPinOutline className="text-orange-500 text-xs sm:text-sm" />}
                                            <span>{folder.name.length > 15 ? folder.name.slice(0, 15) + "..." : folder.name}</span>
                                            <span className="text-xs">({folder.taskCount})</span>
                                        </div>
                                    }
                                    onClick={() => setSelectedFolder(folder.name)}
                                    variant={`${selectedFolder === folder.name ? "filled" : "outlined"}`}
                                    color={`${selectedFolder === folder.name && "primary"}`}
                                />
                            )}
                        </div>
                    </div >
                )
            }
            <Outlet />
        </>

    )
}

export default Notes;

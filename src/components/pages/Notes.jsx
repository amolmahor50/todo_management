import { useContext, useEffect } from 'react'
import SearchNotes from '../SearchNotes'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { fetchFolders, TodoContextData } from '../context/TodoContext'

function Notes() {
    const { user, folderName, setFolderName } = useContext(TodoContextData);

    const location = useLocation();

    // Utility function to convert text to a slug (e.g., "All" => "all")
    const slugify = (text) => {
        return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
    };

    // Function to check if the current folder is active
    const isActive = (folder) => {
        return location.pathname === `/todo-management/${slugify(folder)}` || (folder === "All" && location.pathname === "/todo-management");
    };

    useEffect(() => {
        const getFolders = async () => {
            const data = await fetchFolders(user.uid);
            setFolderName(data);
        };
        getFolders();
    }, [user.uid]);

    console.log("folderName", folderName);
    return (
        <div className='flex flex-col'>
            <SearchNotes />
            <span className='text-2xl font-normal ml-2'>Notes</span>
            <div className='flex gap-2 items-center sm:ml-2 mt-2 overflow-scroll no-scrollbar'>
                {folderName.length > 0 &&
                    <Link
                        to='/todo-management'
                        className={`cursor-pointer text-xs px-3 py-1 rounded-lg bg-secondary border ${location.pathname === '/todo-management' && "bg-yellow-400 text-primary"}`}
                    >
                        All
                    </Link>
                }
                {
                    folderName?.map((folder, index) => (
                        <Link
                            key={index}
                            to={`/todo-management/${slugify(folder.name)}`}
                            className={`cursor-pointer text-xs px-3 py-1 rounded-lg bg-secondary border ${isActive(folder.name) && "bg-yellow-400 text-primary"}`}
                        >
                            {folder.name}
                        </Link>
                    ))
                }
                {
                    folderName.length > 0 &&
                    <Link
                        to='/todo-management/uncategorised'
                        className={`cursor-pointer text-xs px-3 py-1 rounded-lg bg-secondary border ${location.pathname === '/todo-management/uncategorised' && "bg-yellow-400 text-primary"}`}
                    >
                        Uncategorised
                    </Link>
                }

            </div>
            <Outlet />
        </div >
    )
}

export default Notes

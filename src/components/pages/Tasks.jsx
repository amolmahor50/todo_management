import React, { useContext } from 'react'
import SearchNotes from '../SearchNotes'
import { Outlet } from 'react-router-dom'
import AddTasks from './AddTasks'
import { TodoContextData } from '../context/TodoContext';

function Tasks() {
    const { isContextMenuOpenForTodos } = useContext(TodoContextData);

    return (
        <>
            {!isContextMenuOpenForTodos && (
                <>
                    <SearchNotes />
                    <span className='text-2xl font-normal'>Tasks</span>
                    <AddTasks />
                </>
            )
            }
            <Outlet />
        </>
    )
}

export default Tasks
import React, { useContext } from 'react'
import SearchNotes from '../SearchNotes'
import { Outlet } from 'react-router-dom'
import AddTasks from './AddTasks'
import { TodoContextData } from '../context/TodoContext';

function Tasks() {
    const { isContextMenuOpenForTodos } = useContext(TodoContextData);

    return (
        <div className='flex flex-col'>
            {!isContextMenuOpenForTodos && (
                <>
                    <SearchNotes />
                    <AddTasks />
                </>
            )
            }
            <Outlet />
        </div>
    )
}

export default Tasks
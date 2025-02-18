import React from 'react'
import SearchNotes from '../SearchNotes'
import TodoItems from '../TodoItems'

function Notes() {
    return (
        <div>
            <SearchNotes />
            <span className='text-2xl font-normal ml-2'>Notes</span>
            <TodoItems />
        </div>
    )
}

export default Notes
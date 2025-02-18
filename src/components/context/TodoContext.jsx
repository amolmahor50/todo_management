import { createContext, useEffect, useState } from "react";

export const TodoContextData = createContext();

export const TodoContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [folderNote, setFolderNote] = useState(["All",]);
    const [todos, setTodos] = useState([]);

    useEffect(() => {

    }, [user])

    return (
        <TodoContextData.Provider value={{
            user, setUser, folderNote, setFolderNote, todos, setTodos
        }}>
            {children}
        </TodoContextData.Provider>
    )
}
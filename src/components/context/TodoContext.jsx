import { createContext, useEffect, useState } from "react";

export const TodoContextData = createContext();

export const TodoContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {

    }, [user])

    return (
        <TodoContextData.Provider value={{
            user, setUser
        }}>
            {children}
        </TodoContextData.Provider>
    )
}
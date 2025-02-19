import { createContext, useEffect, useState } from "react";
import { serverTimestamp, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { toast } from "sonner";

export const TodoContextData = createContext();

export const TodoContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [folderName, setFolderName] = useState([]);

    useEffect(() => {

    }, [user])

    return (
        <TodoContextData.Provider value={{
            user, setUser, folderName, setFolderName,
        }}>
            {children}
        </TodoContextData.Provider>
    )
}

// Create a new folder inside a user's collection
export const createFolder = async (userId, folderName) => {
    if (!userId) {
        toast.error("User ID is required!");
        return;
    }

    try {
        const folderRef = collection(db, "users", userId, "folders");
        await addDoc(folderRef, {
            name: folderName,
            createdAt: serverTimestamp(),
        });

        toast.success(`Folder "${folderName}" created successfully!`);
    } catch (error) {
        toast.error(`Error creating folder: ${error.message}`);
        console.error("Error creating folder:", error.message);
    }
};

// Fetch folder inside a user's collection
export const fetchFolders = async (userId) => {
    if (!userId) {
        console.error("User ID is required!");
        return [];
    }

    try {
        const folderRef = collection(db, "users", userId, "folders");

        const snapshot = await getDocs(folderRef);

        const folders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return folders;
    } catch (error) {
        console.error("Error fetching folders:", error.message);
        toast.error("Error fetching folders:", error.message);
        return [];
    }
};
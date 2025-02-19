import { createContext, useState } from "react";
import { serverTimestamp, collection, addDoc, onSnapshot, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { toast } from "sonner";

export const TodoContextData = createContext();

export const TodoContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [folderName, setFolderName] = useState([]);
    const [Notes, setNotes] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState("All");

    return (
        <TodoContextData.Provider value={{
            user, setUser, folderName, setFolderName, Notes, setNotes, selectedFolder, setSelectedFolder
        }}>
            {children}
        </TodoContextData.Provider>
    )
}

// Create a new folder inside a user's collection
export const createFolder = async (userId, folderName) => {
    try {

        const folderRef = doc(db, "users", userId, "todos", folderName);

        await setDoc(folderRef, {});

        toast.success(`Folder "${folderName}" created successfully!`);
    } catch (error) {
        toast.error(`Error creating folder: ${error.message}`);
        console.error("Error creating folder:", error.message);
    }
}

// Fetch folder inside a user's collection
export const fetchFoldersRealtime = (userId, setFolders) => {
    try {
        const folderRef = collection(db, "users", userId, "todos");

        return onSnapshot(folderRef, (snapshot) => {
            const folders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFolders(folders);
        });
    } catch (error) {
        console.error("Error fetching folders:", error.message);
        toast.error("Error fetching folders:", error.message);
    }
};

// add todo in which folder are selected in this added 
export const addTodoData = async (userId, folderName, TodoData) => {
    try {
        const todoRef = collection(db, "users", userId, "todos", folderName, "tasks");

        // Add the document
        await addDoc(todoRef, {
            title: TodoData.title,
            description: TodoData.description,
            date: TodoData.date,
            createdAt: serverTimestamp(),
        });

        toast.success(`Todo saved in folder: ${folderName}`);
    } catch (error) {
        console.error("Error saving todo:", error.message);
        toast.error(`Error saving todo: ${error.message}`);
    }
};

export const fetchTodosRealtime = (userId, folderName, setNotes) => {
    try {
        const todosRef = collection(db, "users", userId, "todos", folderName, "tasks");

        return onSnapshot(todosRef, (snapshot) => {
            const todos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNotes(todos);
        });
    } catch (error) {
        console.error("Error fetching todos:", error.message);
    }
};

// Fetch all tasks across all folders
export const fetchAllFoldersTasks = async (userId, setNotes) => {
    try {
        const foldersRef = collection(db, "users", userId, "todos");
        const foldersSnapshot = await getDocs(foldersRef);

        let allTasks = [];

        // Loop through each folder and fetch its tasks
        for (const folderDoc of foldersSnapshot.docs) {
            const folderId = folderDoc.id;
            const tasksRef = collection(db, "users", userId, "todos", folderId, "tasks");
            const tasksSnapshot = await getDocs(tasksRef);

            const tasks = tasksSnapshot.docs.map(doc => ({
                id: doc.id,
                folder: folderId,
                ...doc.data(),
            }));

            allTasks = [...allTasks, ...tasks];
        }

        setNotes(allTasks);
    } catch (error) {
        console.error("Error fetching all tasks:", error.message);
    }
}
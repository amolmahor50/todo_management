import { createContext, useState } from "react";
import { serverTimestamp, collection, addDoc, onSnapshot, doc, setDoc, getDocs, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
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
        if (!userId || !folderName) {
            toast.error("Invalid user ID or folder name.");
            return;
        }

        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            await setDoc(userRef, { folders: ["All", folderName, "Uncategorised"] });
        } else {
            let existingFolders = userDoc.data().folders || [];

            // Ensure "All" is first and "Uncategorised" is last
            existingFolders = existingFolders.filter(folder => folder !== "All" && folder !== "Uncategorised");
            existingFolders = ["All", ...existingFolders, folderName, "Uncategorised"];

            await updateDoc(userRef, {
                folders: existingFolders,
            });
        }

        const folderRef = doc(db, "users", userId, "todos", folderName);
        await setDoc(folderRef, {});

        toast.success(`Folder "${folderName}" created successfully!`);
    } catch (error) {
        toast.error(`Error creating folder: ${error.message}`);
        console.error("Error creating folder:", error.message);
    }
};

// Fetch folder inside a user's collection
export const fetchFoldersRealtime = (userId, setFolderName) => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);

    return onSnapshot(userRef, async (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            let folders = data.folders || [];

            // Ensure "All" is at the beginning and "Uncategorised" is at the end
            folders = folders.filter(folder => folder !== "All" && folder !== "Uncategorised");
            folders.unshift("All");
            folders.push("Uncategorised");

            let folderData = [];
            let totalTasks = 0; // To store total task count

            for (const folder of folders) {
                const tasksRef = collection(db, "users", userId, "todos", folder, "tasks");
                const tasksSnapshot = await getDocs(tasksRef);

                let taskCount = tasksSnapshot.size;
                totalTasks += taskCount; // Add count to totalTasks

                folderData.push({
                    name: folder,
                    taskCount: taskCount,
                });
            }

            // Update "All" folder to show the total task count
            folderData = folderData.map(folder =>
                folder.name === "All" ? { ...folder, taskCount: totalTasks } : folder
            );

            setFolderName(folderData);
        } else {
            setFolderName([{ name: "All", taskCount: 0 }, { name: "Uncategorised", taskCount: 0 }]);
        }
    }, (error) => {
        console.error("Error fetching folders:", error.message);
    });
};

// add todo in which folder are selected in this added 
export const addTodoData = async (userId, folderName, todoData) => {
    try {
        const todoRef = collection(db, "users", userId, "todos", folderName, "tasks");

        await addDoc(todoRef, {
            title: todoData.title,
            description: todoData.description,
            date: todoData.date,
            createdAt: serverTimestamp(),
        });

        toast.success(`Todo saved in folder: ${folderName}`);
    } catch (error) {
        console.error("Error saving todo:", error.message);
        toast.error(`Error saving todo: ${error.message}`);
    }
};

export const fetchTodosRealtime = (userId, folderName, setNotes) => {
    const todosRef = collection(db, "users", userId, "todos", folderName, "tasks");

    const unsubscribe = onSnapshot(todosRef, (snapshot) => {
        const todos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        setNotes(todos);
    }, (error) => {
        console.error("Error fetching todos:", error.message);
    });

    return unsubscribe;
};

// Fetch all tasks across all folders
export const fetchAllFoldersTasks = (userId, setNotes) => {
    if (!userId) return;

    const foldersRef = collection(db, "users", userId, "todos");

    return onSnapshot(foldersRef, async (foldersSnapshot) => {
        let allTasks = [];
        let folderListeners = [];

        const fetchTasks = async (folderId) => {
            const tasksRef = collection(db, "users", userId, "todos", folderId, "tasks");
            return onSnapshot(tasksRef, (tasksSnapshot) => {
                const tasks = tasksSnapshot.docs.map(doc => ({
                    id: doc.id,
                    folder: folderId,
                    ...doc.data(),
                }));

                allTasks = [...allTasks, ...tasks];
                setNotes([...allTasks]);
            });
        };

        // Fetch tasks from all user-defined folders
        foldersSnapshot.docs.forEach(folderDoc => {
            folderListeners.push(fetchTasks(folderDoc.id));
        });

        // Fetch tasks from "Uncategorised" folder explicitly
        const uncategorisedRef = collection(db, "users", userId, "todos", "Uncategorised", "tasks");
        folderListeners.push(
            onSnapshot(uncategorisedRef, (tasksSnapshot) => {
                const uncategorisedTasks = tasksSnapshot.docs.map(doc => ({
                    id: doc.id,
                    folder: "Uncategorised",
                    ...doc.data(),
                }));

                allTasks = [...allTasks, ...uncategorisedTasks];
                setNotes([...allTasks]);
            })
        );

        return () => {
            folderListeners.forEach(unsub => unsub());
        };
    });
};
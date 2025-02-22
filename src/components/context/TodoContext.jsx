import { createContext, useState } from "react";
import { serverTimestamp, collection, addDoc, onSnapshot, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, arrayRemove, writeBatch } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { toast } from "sonner";
import { saveUserProfile } from "../Authentication/auth";

export const TodoContextData = createContext();

export const TodoContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [folderName, setFolderName] = useState([]);
    const [Notes, setNotes] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isContextMenuOpenForTodos, setIsContextMenuOpenForTodos] = useState(false);

    return (
        <TodoContextData.Provider value={{
            user, setUser, folderName, setFolderName, Notes,
            setNotes, selectedFolder, setSelectedFolder,
            searchQuery, setSearchQuery, isContextMenuOpenForTodos, setIsContextMenuOpenForTodos
        }}>
            {children}
        </TodoContextData.Provider>
    )
}

// user profile data update
export const userProfileData = async (user, formData, setUser) => {
    try {
        if (!user?.uid) {
            toast.error("User ID not found. Please log in again.");
            return;
        }

        const userRef = doc(db, "users", user.uid);

        await setDoc(userRef, {
            ProfileData: {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                dateOfBirth: formData.dateOfBirth,
                mobile: formData.mobile,
                gender: formData.gender,
                address: formData.address,
                photo: formData.photo,
            }
        }, { merge: true });

        setUser((prev) => ({ ...prev, ProfileData: formData }));
        saveUserProfile(user, formData);
        toast.success("Profile Updated Successfully!", {
            action: { label: "Close" },
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        toast.error(`Error updating profile: ${error.message}`, {
            action: { label: "Close" },
        });
    }
};

// Create a new folder inside a user's collection
export const createFolder = async (userId, folderName, pinned = false) => {
    try {
        if (!userId || !folderName) {
            toast.error("Invalid user ID or folder name.");
            return;
        }

        // Check if the user document exists
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        let existingFolders = [];

        if (userDoc.exists()) {
            existingFolders = userDoc.data().folders || [];

            // Check if the folder name already exists (case insensitive)
            const isFolderExists = existingFolders.some(folder =>
                folder.name.toLowerCase() === folderName.toLowerCase()
            );

            if (isFolderExists) {
                toast.error(`Folder "${folderName}" already exists!`);
                return;
            }
        } else {
            // If user doc does not exist, create it with default folders
            await setDoc(userRef, {
                folders: [
                    { name: "All", pinned: false },
                    { name: "Uncategorised", pinned: false },
                    { name: folderName, pinned }
                ]
            });
            toast.success(`Folder "${folderName}" created successfully!`);
            return;
        }

        // Ensure "All" is first and "Uncategorised" is last
        existingFolders = existingFolders.filter(folder => folder.name !== "All" && folder.name !== "Uncategorised");
        existingFolders = [
            { name: "All", pinned: false },
            ...existingFolders,
            { name: folderName, pinned },
            { name: "Uncategorised", pinned: false }
        ];

        await updateDoc(userRef, { folders: existingFolders });

        // Create the folder document if it does not exist
        const folderRef = doc(db, "users", userId, "todos", folderName);
        const folderDoc = await getDoc(folderRef);

        if (!folderDoc.exists()) {
            await setDoc(folderRef, { pinned });
        }

        toast.success(`Folder "${folderName}" created successfully!`);
    } catch (error) {
        toast.error(`Error creating folder: ${error.message}`);
        console.error("Error creating folder:", error);
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
            folders = folders.filter(folder => folder.name !== "All" && folder.name !== "Uncategorised");
            folders.unshift({ name: "All", pinned: false });
            folders.push({ name: "Uncategorised", pinned: false });

            let folderData = [];
            let totalTasks = 0; // To store total task count

            for (const folder of folders) {
                const tasksRef = collection(db, "users", userId, "todos", folder.name, "tasks");
                const tasksSnapshot = await getDocs(tasksRef);

                let taskCount = tasksSnapshot.size;
                totalTasks += taskCount; // Add count to totalTasks

                folderData.push({
                    name: folder.name,
                    pinned: folder.pinned || false,
                    taskCount: taskCount,
                });
            }

            // Sort folders: "All" first, then pinned, then others, then "Uncategorised" last
            folderData.sort((a, b) => {
                if (a.name === "All") return -1;
                if (b.name === "All") return 1;
                if (a.pinned && !b.pinned) return -1; // Pinned folders should come first
                if (!a.pinned && b.pinned) return 1;
                if (a.name === "Uncategorised") return 1;
                if (b.name === "Uncategorised") return -1;
                return 0;
            });

            // Update "All" folder to show the total task count
            folderData = folderData.map(folder =>
                folder.name === "All" ? { ...folder, taskCount: totalTasks } : folder
            );

            setFolderName(folderData);
        } else {
            setFolderName([{ name: "All", pinned: false, taskCount: 0 }, { name: "Uncategorised", pinned: false, taskCount: 0 }]);
        }
    }, (error) => {
        console.error("Error fetching folders:", error.message);
    });
};

// Toggle pinned status for a folder
export const toggleFolderPinned = async (userId, folderName, currentPinned) => {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) return;

        let folders = userDoc.data().folders || [];
        folders = folders.map(folder =>
            folder.name === folderName ? { ...folder, pinned: !currentPinned } : folder
        );

        await updateDoc(userRef, { folders });

    } catch (error) {
        toast.error(`Error updating pinned status: ${error.message}`);
    }
};

export const deleteFolder = async (userId, folderId) => {
    try {
        // Step 1: Delete all tasks inside the folder
        const tasksRef = collection(db, "users", userId, "todos", folderId, "tasks");
        const tasksSnapshot = await getDocs(tasksRef);
        const deletePromises = tasksSnapshot.docs.map((task) => deleteDoc(task.ref));
        await Promise.all(deletePromises);

        // Step 2: Wait to ensure tasks are deleted
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Step 3: Delete the folder itself
        const folderRef = doc(db, "users", userId, "todos", folderId);
        await deleteDoc(folderRef);

        // Step 4: Remove folderId from the 'folders' array in user document
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            folders: arrayRemove(folderId), // Remove the deleted folder name from the array
        });

        console.log(`Folder '${folderId}' and its tasks deleted successfully`);
    } catch (error) {
        console.error("Error deleting folder:", error);
        throw error;
    }
};

export const updateFolderName = async (userId, oldName, newName) => {
    try {
        if (!userId || !oldName || !newName || oldName === newName) {
            toast.error("Invalid folder names.");
            return;
        }

        const oldFolderRef = doc(db, "users", userId, "todos", oldName);
        const newFolderRef = doc(db, "users", userId, "todos", newName);
        const userRef = doc(db, "users", userId);

        // Step 1: Get all tasks from the old folder
        const oldTasksRef = collection(db, "users", userId, "todos", oldName, "tasks");
        const tasksSnapshot = await getDocs(oldTasksRef);

        // Step 2: Copy all tasks to the new folder
        for (const taskDoc of tasksSnapshot.docs) {
            const taskData = taskDoc.data();
            await setDoc(doc(db, "users", userId, "todos", newName, "tasks", taskDoc.id), taskData);
        }

        // Step 3: Delete all tasks from the old folder
        for (const taskDoc of tasksSnapshot.docs) {
            await deleteDoc(taskDoc.ref);
        }

        // Step 4: Delete the old folder document
        await deleteDoc(oldFolderRef);

        // Step 5: Update the folders list in the user document
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            let folders = userData.folders || [];

            folders = folders.map(folder => folder === oldName ? newName : folder);

            await updateDoc(userRef, { folders });
        }

        toast.success(`Folder renamed from "${oldName}" to "${newName}" successfully!`);
    } catch (error) {
        console.error("Failed to update folder name:", error);
        toast.error(`Error updating folder name: ${error.message}`);
    }
};

// add todo in which folder are selected in this added 
export const addTodoData = async (userId, folderName, todoData) => {
    try {
        if (!userId || !folderName) {
            throw new Error("Missing required fields");
        }

        const todoRef = collection(db, "users", userId, "todos", folderName, "tasks");

        await addDoc(todoRef, {
            title: todoData.title,
            description: todoData.description || "",
            date: todoData.date || null,
            pinned: todoData.pinned || false,  // Default to false unless explicitly set
            createdAt: serverTimestamp(),
        });

        toast.success(`Todo saved in folder: ${folderName}`);
    } catch (error) {
        console.error("Error saving todo:", error.message);
        toast.error(`Error saving todo: ${error.message}`);
    }
};

export const fetchTodosRealtime = (userId, folderName, setNotes, searchQuery) => {
    const todosRef = collection(db, "users", userId, "todos", folderName, "tasks");

    const unsubscribe = onSnapshot(todosRef, (snapshot) => {
        let todos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        if (searchQuery) {
            todos = todos.filter(todo =>
                todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                todo.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        todos.sort((a, b) => {
            if (a.pinned === b.pinned) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return b.pinned - a.pinned;
        });

        setNotes(todos);
    }, (error) => {
        console.error("Error fetching todos:", error.message);
    });

    return unsubscribe;
};

export const togglePinStatusForTodo = async (userId, folderName, todoId, currentStatus) => {
    try {
        if (!userId || !folderName || !todoId) {
            console.error("Missing required fields");
            return;
        }

        const todoRef = doc(db, "users", userId, "todos", folderName, "tasks", todoId);
        await updateDoc(todoRef, { pinned: !currentStatus });

        console.log(`Todo ${todoId} pin status updated to ${!currentStatus}`);
    } catch (error) {
        console.error("Error toggling pin status:", error.message);
    }
};

// Fetch all tasks across all folders
export const fetchAllFoldersTasks = (userId, setNotes) => {
    if (!userId) return;

    const foldersRef = collection(db, "users", userId, "todos");

    return onSnapshot(foldersRef, async (foldersSnapshot) => {
        let allTasks = [];

        const fetchTasks = async (folderId) => {
            const tasksRef = collection(db, "users", userId, "todos", folderId, "tasks");
            return onSnapshot(tasksRef, (tasksSnapshot) => {
                const tasks = tasksSnapshot.docs.map(doc => ({
                    id: doc.id,
                    folder: folderId,
                    ...doc.data(),
                }));

                allTasks = allTasks.filter(task => task.folder !== folderId);
                allTasks = [...allTasks, ...tasks];

                const sortedTasks = allTasks.sort((a, b) => {
                    if (a.pinned === b.pinned) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }
                    return b.pinned - a.pinned;
                });

                setNotes([...sortedTasks]);
            });
        };

        let folderListeners = foldersSnapshot.docs.map(folderDoc => fetchTasks(folderDoc.id));

        // Fetch tasks from "Uncategorised" folder explicitly
        const uncategorisedRef = collection(db, "users", userId, "todos", "Uncategorised", "tasks");
        folderListeners.push(
            onSnapshot(uncategorisedRef, (tasksSnapshot) => {
                const uncategorisedTasks = tasksSnapshot.docs.map(doc => ({
                    id: doc.id,
                    folder: "Uncategorised",
                    ...doc.data(),
                }));

                allTasks = allTasks.filter(task => task.folder !== "Uncategorised");
                allTasks = [...allTasks, ...uncategorisedTasks];

                const sortedTasks = allTasks.sort((a, b) => {
                    if (a.pinned === b.pinned) {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    }
                    return b.pinned - a.pinned;
                });

                setNotes([...sortedTasks]);
            })
        );

        return () => {
            folderListeners.forEach(unsub => unsub());
        };
    });
};

export const EditedfetchTodoById = (userId, folderName, todoId, setTodoData) => {
    try {
        if (!userId || !folderName || !todoId) {
            console.error("Invalid parameters: Missing userId, folderName, or todoId.");
            return null;
        }

        const todoRef = doc(db, "users", userId, "todos", folderName, "tasks", todoId);

        // Listen for real-time updates
        const unsubscribe = onSnapshot(todoRef, (todoSnap) => {
            if (todoSnap.exists()) {
                setTodoData({ id: todoSnap.id, ...todoSnap.data() });
            } else {
                console.error("Todo not found!");
                setTodoData(null);
            }
        });

        return unsubscribe; // Return the unsubscribe function to stop listening when needed
    } catch (error) {
        console.error("Error fetching todo:", error.message);
        return null;
    }
};

export const updateTodoIndb = async (userId, folderName, todoId, updatedData) => {
    try {
        const todoRef = doc(db, "users", userId, "todos", folderName, "tasks", todoId);
        await updateDoc(todoRef, updatedData);
        toast.success("Todo updated successfully!");
    } catch (error) {
        console.error("Error updating todo:", error.message);
    }
};

export const deleteMultipleTasks = async (userId, selectedTodos) => {
    try {
        if (!userId || !selectedTodos || Object.keys(selectedTodos).length === 0) {
            toast.error("Invalid request. No tasks selected.");
            return;
        }

        const batch = writeBatch(db);

        Object.entries(selectedTodos).forEach(([folderName, taskIds]) => {
            taskIds.forEach((taskId) => {
                const taskRef = doc(db, "users", userId, "todos", folderName, "tasks", taskId);
                batch.delete(taskRef);
            });
        });

        await batch.commit();
        toast.success("Selected tasks deleted successfully!");
    } catch (error) {
        console.error("Error deleting tasks:", error);
        toast.error(`Error deleting tasks: ${error.message}`);
    }
};

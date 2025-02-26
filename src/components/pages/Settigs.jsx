import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronsUpDown } from "lucide-react"
import { MdNavigateNext } from "react-icons/md";
import { useContext, useState } from "react";
import { TodoContextData } from "../context/TodoContext";
import { logout } from '../Authentication/auth'
import { useTheme } from "@/components/theme-provider"
import { useFontSize } from "../context/FontSizeContext";
import { deleteUser, EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";
import { auth, db } from "../../lib/firebaseConfig";
import { toast } from "sonner";
import { deleteDoc, doc } from "firebase/firestore";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { version } from "../../../package.json";

export default function Settigs() {
    const { setUser } = useContext(TodoContextData);
    const Navigate = useNavigate();
    const { setTheme, theme } = useTheme();
    const { fontSize, setFontSize } = useFontSize();
    const [password, setPassword] = useState("");
    const [typePassword, setTypePassword] = useState("password");

    const handleLogout = async () => {
        await logout();
        setUser(null);
        Navigate("/")
    };

    const handleShow_hide_password = (type) => {
        type === "password" ? setTypePassword("text") : setTypePassword("password");
    }

    const user = auth.currentUser;

    // parmanently deletd account and deletd data all for user and navigate the login page
    const handleDeletedAccount = async () => {

        try {
            // Step 1: Re-authenticate the user
            if (user.providerData[0].providerId === "password") {
                // If user signed in with email & password, ask for password
                if (!password) {
                    toast.error("Password is required for authentication.", {
                        action: {
                            label: "Close",
                        },
                    });
                    return;
                }

                const credential = EmailAuthProvider.credential(user.email, password);
                await reauthenticateWithCredential(user, credential);
            } else {
                // If user signed in with Google, use popup re-authentication
                const provider = new GoogleAuthProvider();
                await reauthenticateWithPopup(user, provider);
            }

            // Step 2: Delete from Firestore
            await deleteDoc(doc(db, "users", user.uid));

            // Step 3: Delete user from Firebase Authentication
            await deleteUser(user);

            // Step 4: Clear local data
            localStorage.removeItem("userTodo");
            localStorage.removeItem("savedEmail");

            // navigate to the login page and log out account 
            await logout();
            setUser(null);
            Navigate("/")

            toast.success("Your account has been permanently deleted!", {
                action: {
                    label: "Close",
                },
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error(`Password Wrong please put the correct password`, {
                action: {
                    label: "Close",
                },
            });
        }
    }

    return (
        <>
            <IoIosArrowRoundBack size={30} className="cursor-pointer mb-3" onClick={() => Navigate(-1)} />
            <div>
                <span className='text-2xl font-normal'>Notes</span>
                <div className="mt-4 grid sm:grid-cols-2 gap-4 grid-cols-1">
                    <Link to='profile'>
                        <p className="text-sm text-muted-foreground">
                            Profile
                        </p>
                        <div className="grid gap-4 mt-1 bg-card rounded-lg px-2 py-4 sm:px-4 sm:py-6 cursor-pointer">
                            <div className="text-sm font-medium leading-none flex justify-between items-center">
                                Profile <MdNavigateNext />
                            </div>
                        </div>
                    </Link>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Cloud Services
                        </p>
                        <div className="grid gap-4 mt-1 bg-card rounded-lg px-2 py-4 sm:px-4 sm:py-6 cursor-pointer">
                            <div className="text-sm font-medium leading-none flex justify-between items-center">
                                Notes Cloud <MdNavigateNext />
                            </div>
                            <div className="text-sm font-medium leading-none flex justify-between items-center">
                                Recentaly Deleted Items <MdNavigateNext />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Style
                        </p>
                        <div className="grid gap-4 mt-1 bg-card rounded-lg px-2 py-4 sm:px-4 sm:py-6 cursor-pointer">
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-medium leading-none">
                                    Theme
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="outline-none cursor-pointer flex items-center gap-1">
                                        <p className="text-xs text-muted-foreground">
                                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                        </p>
                                        <ChevronsUpDown size={16} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="relative sm:right-8 right-6">
                                        <DropdownMenuItem onClick={() => setTheme("light")} className={`${theme === "light" ? "bg-accent" : ""}`}>
                                            Light
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("dark")} className={`${theme === "dark" ? "bg-accent" : ""}`}>
                                            Dark
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setTheme("system")} className={`${theme === "system" ? "bg-accent" : ""}`}>
                                            System
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-medium leading-none">
                                    Font Size
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="outline-none cursor-pointer flex items-center gap-1">
                                        <p className="text-xs text-muted-foreground">
                                            {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
                                        </p>
                                        <ChevronsUpDown size={16} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="relative sm:right-8 right-6">
                                        <DropdownMenuItem onClick={() => setFontSize("small")} className={`${fontSize === "small" ? "bg-accent" : ""}`}>
                                            Small
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFontSize("medium")} className={`${fontSize === "medium" ? "bg-accent" : ""}`}>
                                            Medium
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFontSize("large")} className={`${fontSize === "large" ? "bg-accent" : ""}`}>
                                            Large
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setFontSize("huge")} className={`${fontSize === "huge" ? "bg-accent" : ""}`}>
                                            Huge
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-medium leading-none">
                                    Sort
                                </div>
                                <DropdownMenu className="">
                                    <DropdownMenuTrigger className="outline-none cursor-pointer flex items-center gap-1">
                                        <p className="text-xs text-muted-foreground">
                                            By creation date
                                        </p>
                                        <ChevronsUpDown size={16} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="relative sm:right-8 right-6">
                                        <DropdownMenuItem>By creation date</DropdownMenuItem>
                                        <DropdownMenuItem>By modification date</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Reminders
                        </p>
                        <div className="flex justify-between items-center mt-1 bg-card rounded-lg px-2 py-4 sm:px-4 sm:py-6 cursor-pointer">
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium leading-none">
                                    High-priority reminders
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Play sound even when Silent or DND mode is on
                                </p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Others
                        </p>
                        <div className="grid gap-4 mt-1 bg-card rounded-lg px-2 py-4 sm:px-4 sm:py-6 cursor-pointer">
                            <Link to='https://privacy.mi.com/all/en_IN' className="text-sm font-medium leading-none flex justify-between items-center">
                                Privacy <MdNavigateNext />
                            </Link>
                            {user && user.providerData.length > 0 ? (
                                user.providerData[0].providerId !== "password" ? (
                                    <AlertDialog>
                                        <AlertDialogTrigger className="text-sm font-medium leading-none text-destructive flex justify-between items-center">
                                            Permanently Deleted Account <MdNavigateNext />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="bg-blue-600 hover:bg-blue-500"
                                                    onClick={handleDeletedAccount}
                                                >
                                                    Delete Account
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                ) : (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="text-sm font-medium leading-none text-destructive flex justify-between items-center border-none p-0 w-full">
                                                Permanently Delete Account <MdNavigateNext />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Confirm Deletion</DialogTitle>
                                                <DialogDescription>
                                                    Enter your password to confirm account deletion:
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div>
                                                    <Label htmlFor="password">Password</Label>
                                                    <div className="relative flex items-center">
                                                        <Input
                                                            id="password"
                                                            type={typePassword}
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            placeholder="Enter your correct password"
                                                        />
                                                        <span className="absolute right-4 cursor-pointer">
                                                            {
                                                                typePassword === "password" ?
                                                                    <IoEyeOutline size={20} onClick={() => handleShow_hide_password("password")} />
                                                                    : <IoEyeOffOutline size={20} onClick={() => handleShow_hide_password("text")} />
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="blue" onClick={handleDeletedAccount}>
                                                    Delete Account
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                )
                            ) : (<></>
                            )
                            }
                            <AlertDialog AlertDialog >
                                <AlertDialogTrigger className="text-sm font-medium leading-none text-destructive flex justify-between items-center">
                                    Logout <MdNavigateNext />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will LogOut your account
                                            from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-600 hover:bg-red-400" onClick={handleLogout}>LogOut</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            </div >
            <div className="text-center text-sm text-muted-foreground [&_a]:underline hover:[&_a]:text-primary mt-12">
                Copyright © {new Date().getFullYear()} amol.mahor. All rights reserved. Version : {version}
            </div>
        </>
    )
}

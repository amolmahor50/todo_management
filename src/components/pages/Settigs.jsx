import { IoIosArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch"
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
import { ChevronsUpDown } from "lucide-react"
import { MdNavigateNext } from "react-icons/md";
import { useContext } from "react";
import { TodoContextData } from "../context/TodoContext";
import { logout } from '../Authentication/auth'
import { useTheme } from "@/components/theme-provider"
import { useFontSize } from "../context/FontSizeContext";

export default function Settigs() {
    const { setUser } = useContext(TodoContextData);
    const Navigate = useNavigate();
    const { setTheme, theme } = useTheme();
    const { fontSize, setFontSize } = useFontSize();

    const handleLogout = async () => {
        await logout();
        setUser(null);
        Navigate("/")
    };

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
                            <div className="text-sm font-medium leading-none flex justify-between items-center">
                                Privacy <MdNavigateNext />
                            </div>

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
                                        <AlertDialogAction className="bg-blue-600 hover:bg-blue-500">Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
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
            </div>
        </>
    )
}

import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronsUpDown } from "lucide-react"
import { MdNavigateNext } from "react-icons/md";


export default function Settigs() {
    const Navigate = useNavigate()
    return (
        <div className="h-screen">
            <IoIosArrowRoundBack size={30} className="cursor-pointer mb-3" onClick={() => Navigate(-1)} />
            <div>
                <span className='text-2xl font-normal'>Notes</span>
                <div className="mt-4 grid sm:grid-cols-2 gap-4 grid-cols-1">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Cloud Services
                        </p>
                        <div className="grid gap-4 mt-1 bg-card rounded-lg px-2 py-4 sm:px-4 sm:py-6 cursor-pointer">
                            <div className="text-sm font-medium leading-none flex justify-between items-center">
                                Xiaomi Cloud <MdNavigateNext />
                            </div>
                            <p className="text-sm font-medium leading-none flex justify-between items-center">
                                Recentaly Deleted Items <MdNavigateNext />
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Style
                        </p>
                        <div className="grid gap-4 mt-1 bg-card rounded-lg px-2 py-4 sm:px-4 sm:py-6 cursor-pointer">
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-medium leading-none">
                                    Font Size
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="outline-none cursor-pointer flex items-center gap-1">
                                        <p className="text-xs text-muted-foreground">
                                            Small
                                        </p>
                                        <ChevronsUpDown size={16} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="relative sm:right-8 right-6">
                                        <DropdownMenuItem>Small</DropdownMenuItem>
                                        <DropdownMenuItem>Medium</DropdownMenuItem>
                                        <DropdownMenuItem>Large</DropdownMenuItem>
                                        <DropdownMenuItem>Huge</DropdownMenuItem>
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
                                <p className="text-sm text-muted-foreground">
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
                            <p className="text-sm font-normal leading-none text-red-700 flex justify-between items-center">
                                Permanently Deleted Account <MdNavigateNext />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

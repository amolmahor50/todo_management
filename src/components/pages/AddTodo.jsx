import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { IoReturnUpForwardOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IoCheckmarkOutline } from "react-icons/io5";

export default function AddTodo() {
    const Navigate = useNavigate();
    return (
        <div className="sm:px-8 sm:py-4 px-4 py-2 h-screen">
            <div className="flex justify-between items-center">
                <IoIosArrowRoundBack onClick={() => Navigate(-1)} size={30} className="cursor-pointer" />
                <div className="flex sm:gap-8 gap-6 items-center">
                    <IoReturnUpBackOutline size={22} className="cursor-pointer" />
                    <IoReturnUpForwardOutline size={22} className="cursor-pointer" />
                    <IoCheckmarkOutline size={22} className="cursor-pointer" />
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
                <Input
                    placeholder="Tittle"
                    className="font-medium leading-none bg-transparent border-none p-0"
                />
                <p className="text-xs text-muted-foreground">
                    17 February 10.24 PM | 0 character
                </p>
                <Textarea placeholder="Start writing..."
                    className="bg-transparent border-none p-0 outline-none mt-4"
                />
            </div>
        </div>
    )
}

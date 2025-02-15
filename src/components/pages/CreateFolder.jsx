import { IoIosArrowRoundBack } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoIosCheckmark } from "react-icons/io";
import { IoIosAdd } from 'react-icons/io';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateFolder() {
    const [openCreateFolderPopUp, setOpenCreateFolderPopUp] = useState(false);

    const Navigate = useNavigate();
    return (
        <div className="flex flex-col max-w-5xl mx-auto sm:px-8 px-4 sm:py-6 py-3">
            <div className="flex justify-between items-center">
                <IoIosArrowRoundBack className="sm:text-3xl text-2xl cursor-pointer" onClick={() => Navigate(-1)} />
                <span>Folders</span>
                <RiDeleteBinLine className="sm:text-xl text-lg cursor-pointer" />
            </div>
            <div className="bg-white rounded-lg flex justify-between items-center mt-4 px-4 py-2" onClick={() => Navigate('todo-management')}>
                <div className="flex items-center gap-1">
                    <IoIosCheckmark size={30} color="orange" />
                    <span>All</span>
                </div>
                <div>
                    3
                </div>
            </div>
            <div className="bg-white rounded-lg flex justify-center items-center mt-4 px-4 py-2">
                <div className="flex flex-col gap-1 items-center cursor-pointer" onClick={() => setOpenCreateFolderPopUp(true)}>
                    <IoIosAdd className="rounded-full bg-yellow-400 text-white text-xl" />
                    <span className="text-xs sm:text-sm">
                        New folder
                    </span>
                </div>
            </div>
            {
                openCreateFolderPopUp && <div className="flex justify-center items-center">
                    <div className="bg-white p-4 text-center grid gap-4 rounded-lg max-w-[450px] w-[90%] mx-auto absolute bottom-5">
                        <h3>New Folder</h3>
                        <Input
                            id="text"
                            name="text"
                            type="text"
                            value="Unnamed folder"
                            placeholder="Unnamed folder"
                            className="border-2 border-yellow-500"
                        />
                        <div className="grid grid-cols-2 gap-6">
                            <Button variant="secondary" onClick={() => setOpenCreateFolderPopUp(false)}>Cancel</Button>
                            <Button variant="blue">OK</Button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

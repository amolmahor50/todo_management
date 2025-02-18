import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Avatar from '@mui/material/Avatar';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MdDeleteOutline } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { TodoContextData } from "../context/TodoContext";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, setUser } = useContext(TodoContextData);
    const Navigate = useNavigate();

    // State for form inputs & validation errors
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email,
        dateOfBirth: user?.dateOfBirth || "",
        mobile: user?.mobile || "",
        gender: user?.gender || "",
        address: user?.address || "",
        photo: user?.photo || "",
    });


    // Handle input change with validation
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "mobile") {
            const formattedValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData((prev) => ({ ...prev, [name]: formattedValue }));
            if (formattedValue.length !== 10) {
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
            if (!value.trim()) {
            }
        }
    };

    // Handle radio button change
    const handleGenderChange = (value) => {
        setFormData((prev) => ({ ...prev, gender: value }));
    };

    // images uploded file 
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, photo: reader.result }));
        };
    };

    return (
        <div>
            <div className="border-none shadow-none bg-transparent">
                <IoIosArrowRoundBack size={30} className="cursor-pointer mb-3" onClick={() => Navigate(-1)} />
                <div>
                    <span className="sm:text-4xl text-2xl">Profile</span>
                </div>
                <div>
                    {/* Profile Picture */}
                    <div className="flex gap-4 items-center pb-4 border-b-2 mt-8">
                        <Avatar
                            alt={formData?.firstName}
                            src={formData?.photo}
                            sx={{ width: 85, height: 85 }}
                        >
                            {!user?.photo && formData?.firstName?.slice(0, 1).toUpperCase()}
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <span className="text-xl font-semibold">Profile Picture</span>
                            <span className="text-gray-600 text-sm">Supports PNGs, JPEGs under 3MB</span>
                            <div className="flex items-center gap-2">
                                <Button variant="blue" size="sm" className="w-fit">
                                    <label htmlFor="imageUpload" className="cursor-pointer flex items-center gap-2 ">
                                        <GoPencil />
                                        <span>Edit</span>
                                        <Input
                                            id="imageUpload"
                                            type="file"
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                </Button>
                                <Button variant="destructive" size="sm" className="w-fit" onClick={() => setFormData((prev) => ({ ...prev, photo: "" }))}>
                                    <MdDeleteOutline />
                                    <span>Delete</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Personal Details Form */}
                    <form className="grid gap-6 mt-6">
                        <h6 className="text-xl font-semibold">Personal Details</h6>

                        {/* Name Fields */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">First Name</Label>
                                <Input name="firstName" placeholder="First Name" type="text" className="focus:border-orange-400 border-2" value={formData?.firstName?.charAt(0).toUpperCase() + formData?.firstName?.slice(1)} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input name="lastName" placeholder="Last Name" type="text" className="focus:border-orange-400 border-2" value={formData?.lastName?.charAt(0).toUpperCase() + formData?.lastName?.slice(1)} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Email & dateOfBirth */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input name="email" disabled type="email" className="focus:border-orange-400 border-2" value={formData.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dateOfBirth">Date Of Birth</Label>
                                <Input name="dateOfBirth" type="date" className="focus:border-orange-400 border-2" value={formData.dateOfBirth} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Mobile & Gender */}
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <Input name="mobile" placeholder="Mobile Number" type="text" className="focus:border-orange-400 border-2" value={formData.mobile} onChange={handleChange} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <RadioGroup value={formData.gender} onValueChange={handleGenderChange} className="flex">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="male" id="r1" />
                                        <Label htmlFor="r1">Male</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="female" id="r2" />
                                        <Label htmlFor="r2">Female</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="other" id="r3" />
                                        <Label htmlFor="r3">Other</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="grid sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <textarea name="address" placeholder="Address" rows={3} value={formData.address} onChange={handleChange} className="p-3 rounded-md shadow-sm outline-none focus:border-orange-400 border-2" />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end items-end">
                            <Button variant="orange" className="w-fit" type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

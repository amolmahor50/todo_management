import React, { useContext, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Avatar from '@mui/material/Avatar';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MdDeleteOutline } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { TodoContextData, userProfileData } from "../context/TodoContext";

export default function Profile() {
    const { user, setUser } = useContext(TodoContextData);
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        mobile: "",
        gender: "",
        address: "",
        photo: "",
    });

    // Sync form data with context when user data changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                email: user?.email || "",
                dateOfBirth: user?.dateOfBirth || "",
                mobile: user?.mobile || "",
                gender: user?.gender || "",
                address: user?.address || "",
                photo: user?.photo || "",
            });
        }
    }, [user]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "mobile") {
            const formattedValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData((prev) => ({ ...prev, [name]: formattedValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle gender selection
    const handleGenderChange = (value) => {
        setFormData((prev) => ({ ...prev, gender: value }));
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, photo: reader.result }));
        };
    };

    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        // Validate form fields
        if (!formData.firstName || !formData.lastName || !formData.mobile) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            await userProfileData(user, formData, setUser);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3s
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    };

    return (
        <>
            <IoIosArrowRoundBack size={30} className="cursor-pointer mb-3" onClick={() => navigate(-1)} />
            <div>
                <span className="sm:text-4xl text-2xl">Profile</span>
            </div>

            {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}

            <div>
                {/* Profile Picture */}
                <div className="flex gap-4 items-center pb-4 border-b-2 mt-8">
                    <Avatar
                        alt={formData?.firstName}
                        src={formData?.photo}
                        sx={{ width: 85, height: 85 }}
                    >
                        {!formData.photo && formData.firstName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <span className="text-xl font-semibold">Profile Picture</span>
                        <span className="text-gray-600 text-sm">Supports PNGs, JPEGs under 3MB</span>
                        <div className="flex items-center gap-2">
                            <Button variant="blue" size="sm">
                                <label htmlFor="imageUpload" className="cursor-pointer flex items-center gap-2 ">
                                    <GoPencil />
                                    <span>Edit</span>
                                    <Input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => setFormData((prev) => ({ ...prev, photo: "" }))}>
                                <MdDeleteOutline />
                                <span>Delete</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Personal Details Form */}
                <form className="grid gap-6 mt-6" onSubmit={handleUpdateProfile}>
                    <h6 className="text-xl font-semibold">Personal Details</h6>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label>First Name</Label>
                            <Input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Last Name</Label>
                            <Input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input name="email" disabled value={formData.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Date Of Birth</Label>
                            <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label>Mobile Number</Label>
                            <Input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} />
                        </div>
                        <div className="grid gap-2">
                            <Label>Gender</Label>
                            <RadioGroup value={formData.gender} onValueChange={handleGenderChange} className="flex">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male">Male</Label>
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female">Female</Label>
                            </RadioGroup>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Address</Label>
                        <textarea name="address" placeholder="Address" rows={3} value={formData.address} onChange={handleChange} className="p-3 border-2 rounded-md" />
                    </div>

                    <div className="flex justify-end">
                        <Button variant="orange" type="submit">Save Changes</Button>
                    </div>
                </form>
            </div>
        </>
    );
}

import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { lockPasswordCreate, resetPasswordUsingSecurity, TodoContextData, verifyLockPassword } from './context/TodoContext';
import { toast } from 'sonner';
import LockItems from './LockItems';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { Textarea } from "@/components/ui/textarea"

export default function LockPannel() {
    const { user } = useContext(TodoContextData);

    // Check if the app is already unlocked
    const [unlocked, setUnlocked] = useState(() => {
        return sessionStorage.getItem("appUnlocked") === "true";
    });

    useEffect(() => {
        if (unlocked) {
            sessionStorage.setItem("appUnlocked", "true"); // Store unlock state
        }
    }, [unlocked]);

    const [pannelOpen, setPannelOpen] = useState({
        lockPassword: !unlocked,
        creatPassword: false,
        forgotPassword: false
    });

    const [typePassword, setTypePassword] = useState("password");
    const [confirmTypePassword, setConfirmTypePassword] = useState("password");

    const handleShow_hide_password1 = (type) => {
        type === "password" ? setTypePassword("text") : setTypePassword("password");
    };

    const handleShow_hide_password2 = (type) => {
        type === "password" ? setConfirmTypePassword("text") : setConfirmTypePassword("password");
    };

    const [inputData, setInputData] = useState({
        enteredPass: "",
        createPass: "",
        createConfirmPass: "",
        oldForgotPass: "",
        newForgotPass: "",
        securityQuestion: "",
        securityAnswer: "",
        enteredSecurityAnswer: "",
    });

    // Function to reset input fields when switching panels
    const resetInputData = () => {
        setInputData({
            enteredPass: "",
            createPass: "",
            createConfirmPass: "",
            oldForgotPass: "",
            newForgotPass: "",
            securityQuestion: "",
            securityAnswer: "",
            enteredSecurityAnswer: "",
        });
    };

    const handlePanelSwitch = (panel) => {
        resetInputData();
        setPannelOpen({
            lockPassword: panel === "lockPassword",
            creatPassword: panel === "creatPassword",
            forgotPassword: panel === "forgotPassword"
        });
    };

    const handleCreatePassword = async () => {
        if (inputData.createPass !== inputData.createConfirmPass) {
            toast.error("Passwords do not match!");
            return;
        }
        if (!inputData.securityQuestion.trim() || !inputData.securityAnswer.trim()) {
            toast.error("Security question and answer are required!");
            return;
        }

        await lockPasswordCreate(user.uid, inputData.createConfirmPass, inputData.securityQuestion, inputData.securityAnswer);
        toast.success("Password created successfully!");
        handlePanelSwitch("lockPassword");
    };

    // Handle password verification and unlocking
    const handleUnlock = async () => {
        const response = await verifyLockPassword(user.uid, inputData.enteredPass);
        if (response.success) {
            sessionStorage.setItem("appUnlocked", "true");
            setUnlocked(true);
            handlePanelSwitch("");
        } else {
            toast.error(response.message);
        }
    };

    const handleForgotPassword = async () => {
        const success = await resetPasswordUsingSecurity(user.uid, inputData.enteredSecurityAnswer, inputData.newForgotPass);
        if (success) handlePanelSwitch("lockPassword");
    };

    return (
        <>
            {unlocked ? <LockItems /> : null}

            {pannelOpen.lockPassword && (
                <motion.div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-40">
                    <motion.div className="bg-card p-4 grid gap-4 rounded-lg max-w-[450px] w-[90%] mx-auto absolute bottom-3">
                        <h2 className='text-center font-semibold'>Enter Your Password</h2>
                        <div className='grid gap-2'>
                            <Label>Password</Label>
                            <div className="relative flex items-center">
                                <Input
                                    type={typePassword}
                                    placeholder="Enter password"
                                    className="border-2 focus:border-orange-500"
                                    value={inputData.enteredPass}
                                    onChange={(e) => setInputData(prev => ({ ...prev, enteredPass: e.target.value }))}
                                />
                                <span className="absolute right-4 cursor-pointer">
                                    {typePassword === "password"
                                        ? <IoEyeOutline size={20} onClick={() => handleShow_hide_password1("password")} />
                                        : <IoEyeOffOutline size={20} onClick={() => handleShow_hide_password1("text")} />}
                                </span>
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className="text-sm underline cursor-pointer" onClick={() => handlePanelSwitch("creatPassword")}>
                                Create Password
                            </span>
                            <span className="text-sm underline cursor-pointer" onClick={() => handlePanelSwitch("forgotPassword")}>
                                Forgot password?
                            </span>
                        </div>
                        <Button variant="blue" onClick={handleUnlock}>Enter</Button>
                    </motion.div>
                </motion.div>
            )}

            {pannelOpen.forgotPassword && (
                <motion.div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-40">
                    <motion.div className="bg-card p-4 grid gap-4 rounded-lg max-w-[450px] w-[90%] mx-auto absolute bottom-3">
                        <h2 className='text-center font-semibold'>Forgot Password</h2>
                        <div className='grid gap-2'>
                            <Label>Enter Security Answer</Label>
                            <Textarea
                                placeholder="Enter Security Answer."
                                className="border-2 focus:border-orange-500"
                                value={inputData.enteredSecurityAnswer}
                                onChange={(e) => setInputData(prev => ({ ...prev, enteredSecurityAnswer: e.target.value }))}
                            />
                        </div>
                        <div className='grid gap-2'>
                            <Label>New Password</Label>
                            <div className="relative flex items-center">
                                <Input
                                    type={confirmTypePassword}
                                    placeholder="Enter new password"
                                    className="border-2 focus:border-orange-500"
                                    value={inputData.newForgotPass}
                                    onChange={(e) => setInputData(prev => ({ ...prev, newForgotPass: e.target.value }))}
                                />
                                <span className="absolute right-4 cursor-pointer">
                                    {confirmTypePassword === "password"
                                        ? <IoEyeOutline size={20} onClick={() => handleShow_hide_password2("password")} />
                                        : <IoEyeOffOutline size={20} onClick={() => handleShow_hide_password2("text")} />}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <Button variant="secondary" onClick={() => handlePanelSwitch("lockPassword")}>Cancel</Button>
                            <Button variant="blue" onClick={handleForgotPassword}>Submit</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {pannelOpen.creatPassword && (
                <motion.div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-40">
                    <motion.div className="bg-card p-4 grid gap-4 rounded-lg max-w-[450px] w-[90%] mx-auto absolute bottom-3">
                        <h2 className='text-center font-semibold'>Create New Password</h2>
                        <div className='grid gap-2'>
                            <Label>Password</Label>
                            <div className="relative flex items-center">
                                <Input
                                    type={typePassword}
                                    placeholder="Enter password"
                                    className="border-2 focus:border-orange-500"
                                    value={inputData.createPass}
                                    onChange={(e) => setInputData(prev => ({ ...prev, createPass: e.target.value }))}
                                />
                                <span className="absolute right-4 cursor-pointer">
                                    {typePassword === "password"
                                        ? <IoEyeOutline size={20} onClick={() => handleShow_hide_password1("password")} />
                                        : <IoEyeOffOutline size={20} onClick={() => handleShow_hide_password1("text")} />}
                                </span>
                            </div>
                        </div>
                        <div className='grid gap-2'>
                            <Label>Confirm Password</Label>
                            <div className="relative flex items-center">
                                <Input
                                    type={confirmTypePassword}
                                    placeholder="Enter confirm password"
                                    className="border-2 focus:border-orange-500"
                                    value={inputData.createConfirmPass}
                                    onChange={(e) => setInputData(prev => ({ ...prev, createConfirmPass: e.target.value }))}
                                />
                                <span className="absolute right-4 cursor-pointer">
                                    {confirmTypePassword === "password"
                                        ? <IoEyeOutline size={20} onClick={() => handleShow_hide_password2("password")} />
                                        : <IoEyeOffOutline size={20} onClick={() => handleShow_hide_password2("text")} />}
                                </span>
                            </div>
                        </div>
                        <div className='grid gap-2'>
                            <Label>Add Security Question</Label>
                            <Input
                                type="text"
                                placeholder="Security Question"
                                className="border-2 focus:border-orange-500 outline-none"
                                value={inputData.securityQuestion}
                                onChange={(e) => setInputData(prev => ({ ...prev, securityQuestion: e.target.value }))}
                            />
                            <Textarea
                                placeholder="Type your Security Answer."
                                value={inputData.securityAnswer}
                                className="border-2 focus:border-orange-500"
                                onChange={(e) => setInputData(prev => ({ ...prev, securityAnswer: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <Button variant="secondary" onClick={() => handlePanelSwitch("lockPassword")}>Cancel</Button>
                            <Button variant="blue" onClick={handleCreatePassword}>Submit</Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}

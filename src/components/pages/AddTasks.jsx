import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { LuAlarmClockCheck } from "react-icons/lu";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addTasks, updateTask, TodoContextData } from "../context/TodoContext";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AddTasks() {
    const { setTasks, tasks, user, addTaskPannelOpen, setAddTaskPannelOpen } = useContext(TodoContextData);
    const datePickerRef = useRef(null);
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get("editTaskId");
    const Navigate = useNavigate();

    // Initial Task Data
    const [taskData, setTaskData] = useState({
        taskMessage: "",
        alarmTimer: "",
        isCompleted: false
    });

    // Load Task Data for Editing
    useEffect(() => {
        if (taskId) {
            const existingTask = tasks.find(task => task.id === taskId);
            if (existingTask) {
                setTaskData({
                    taskMessage: existingTask.taskMessage,
                    alarmTimer:
                        existingTask.alarmTimer && !isNaN(new Date(existingTask.alarmTimer).getTime())
                            ? new Date(existingTask.alarmTimer)
                            : null, // Ensure alarmTimer is either a Date or null
                    isCompleted: existingTask.isCompleted
                });
            }
        }
    }, [taskId, tasks]);

    const handleDateChange = (date) => {
        if (date && date instanceof Date && !isNaN(date.getTime())) {
            setTaskData(prev => ({ ...prev, alarmTimer: date }));
        } else {
            setTaskData(prev => ({ ...prev, alarmTimer: null })); // Prevent invalid dates
        }
    };

    const handleSubmit = async () => {
        try {
            if (taskId) {
                // Update existing task
                await updateTask(user.uid, taskId, taskData);
                setTasks(prevTasks => {
                    const updatedTaskList = prevTasks.filter(task => task.id !== taskId);
                    return [{ id: taskId, ...taskData }, ...updatedTaskList];
                });
                Navigate(-1)
            } else {
                // Add new task
                const newTask = await addTasks(user.uid, taskData);

                if (!newTask) {
                    throw new Error("Failed to create task: newTask is undefined or null.");
                }

                setTasks(prev => [{ id: newTask.id, ...taskData }, ...prev]);
            }

            setAddTaskPannelOpen(false);
            setTaskData({ taskMessage: "", alarmTimer: "", isCompleted: false });
        } catch (error) {
            console.error("Error submitting task:", error);
        }
    };

    return (
        <div>
            {addTaskPannelOpen && (
                <motion.div
                    className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                        setAddTaskPannelOpen(false);
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.delete("editTaskId");
                        Navigate(`?${newSearchParams.toString()}`);
                        setTaskData({
                            taskMessage: "",
                            alarmTimer: "",
                            isCompleted: false
                        });
                    }}
                >
                    <motion.div
                        className="bg-card p-4 text-center grid gap-4 rounded-lg max-w-[450px] w-[90%] mx-auto absolute bottom-3"
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Task Input */}
                        <div className="flex gap-2 items-start">
                            <MdOutlineCheckBoxOutlineBlank className="mt-1" />
                            <Textarea
                                name="description"
                                placeholder="Start writing..."
                                className="bg-transparent border-none text-sm py-2 outline-none resize-none overflow-y-auto w-full h-[200px] no-scrollbar"
                                rows={3}
                                value={taskData.taskMessage}
                                onChange={(e) =>
                                    setTaskData(prev => ({ ...prev, taskMessage: e.target.value }))
                                }
                            />
                        </div>

                        {/* Reminder Section */}
                        <div className="flex justify-between items-center px-2">
                            <p
                                onClick={() => datePickerRef.current.setOpen(true)}
                                className="text-sm text-primary flex items-center gap-1 cursor-pointer"
                            >
                                <LuAlarmClockCheck className="text-sm sm:text-lg" />
                                Set Reminder
                            </p>

                            {/* Hidden DatePicker but opens on button click */}
                            {taskData.alarmTimer instanceof Date && !isNaN(taskData.alarmTimer.getTime()) ? (
                                <DatePicker
                                    selected={taskData.alarmTimer}
                                    onChange={handleDateChange}
                                    showTimeSelect
                                    timeFormat="hh:mm aa"
                                    timeIntervals={15}
                                    dateFormat="MM/dd/yyyy hh:mm aa"
                                    ref={datePickerRef}
                                    className="hidden"
                                />
                            ) : null}

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={!taskData.taskMessage.trim()}
                                className={`${!taskData.taskMessage.trim()
                                    ? " text-gray-500 cursor-not-allowed"
                                    : "text-orange-500 cursor-pointer"
                                    }`}
                            >
                                {taskId ? "Update" : "Done"}
                            </button>
                        </div>

                        {/* Show selected date if available */}
                        {taskData.alarmTimer instanceof Date && !isNaN(taskData.alarmTimer.getTime()) && (
                            <p className="text-xs text-gray-400">
                                Reminder set for: {taskData.alarmTimer.toLocaleString()}
                            </p>
                        )}
                    </motion.div>
                </motion.div>
            )}

            {/* Add Task Button */}
            {!addTaskPannelOpen && (
                <motion.div
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-20 right-6 sm:right-[20%] z-50"
                >
                    <span
                        onClick={() => setAddTaskPannelOpen(true)}
                        className="rounded-full bg-yellow-500 w-[50px] h-[50px] flex justify-center items-center text-white cursor-pointer shadow-lg"
                    >
                        <IoAdd size={24} />
                    </span>
                </motion.div>
            )}
        </div>
    );
}

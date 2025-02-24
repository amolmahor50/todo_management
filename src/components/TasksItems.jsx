import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox"
import { RxCross2 } from "react-icons/rx";
import { VscChecklist } from "react-icons/vsc";
import { TodoContextData } from "./context/TodoContext";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineDragIndicator } from "react-icons/md";
import { GoCheckCircleFill } from "react-icons/go";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function TasksItems() {
    const { isContextMenuOpenForTodos, setIsContextMenuOpenForTodos, tasks, setTasks } = useContext(TodoContextData);
    const [isCardVisible, setIsCardVisible] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [selectedTasks, setSelectedTasks] = useState([]);

    const Navigate = useNavigate();

    const toggleTaskSelection = (task) => {
        setSelectedTasks((prevSelected) => {
            if (prevSelected.includes(task)) {
                return prevSelected.filter((t) => t !== task);
            } else {
                return [...prevSelected, task];
            }
        });
    };

    // Handle Drag and Drop Reordering
    const handleDragEnd = (result) => {
        if (!result.destination) return; // If dropped outside, do nothing

        const reorderedTasks = [...tasks];
        const [movedTask] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, movedTask);

        setTasks(reorderedTasks);
    };

    return (
        <>
            {
                isContextMenuOpenForTodos ? (
                    <>
                        <div className="fixed top-0 left-0 sm:left-1/2 sm:translate-x-[-50%] sm:px-2 px-6 py-6 bg-muted z-50 w-full max-w-5xl mx-auto">
                            <div className=" flex justify-between items-center">
                                <RxCross2 className="sm:text-2xl text-xl cursor-pointer" onClick={() => {
                                    setIsContextMenuOpenForTodos(false)
                                }
                                } />
                                <VscChecklist
                                    className="sm:text-2xl text-xl cursor-pointer"
                                    onClick={() => {
                                        if (selectedTasks.length === tasks.length) {
                                            setSelectedTasks([]);
                                        } else {
                                            setSelectedTasks(tasks.map(task => task));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <span className='text-2xl font-normal ml-2'>{selectedTasks.length} Selected Item</span>

                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="tasks-list">
                                {(provided) => (
                                    <motion.div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {tasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <motion.div
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        onClick={() => toggleTaskSelection(task)}
                                                        className="bg-gray-200 rounded-lg px-4 py-3 flex justify-between items-center gap-4 cursor-pointer shadow-sm hover:shadow-lg"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        whileHover={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span>
                                                                <MdOutlineDragIndicator className="sm:text-xl text-lg cursor-move" />
                                                            </span>
                                                            <p className="text-muted-foreground text-sm line-clamp-3">
                                                                {task.taskMessage}
                                                            </p>
                                                        </div>
                                                        <span className="cursor-pointer">
                                                            {selectedTasks.includes(task) ? (
                                                                <GoCheckCircleFill className="sm:text-xl text-lg text-orange-500" />
                                                            ) : (
                                                                <RiCheckboxBlankCircleLine className="sm:text-xl text-lg bg-muted rounded-full" color="transparent" />
                                                            )}
                                                        </span>
                                                    </motion.div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </motion.div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <p
                            className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:mt-8 mt-4 cursor-pointer"
                            onClick={() => setIsCardVisible(!isCardVisible)}
                        >
                            {isCardVisible ? <MdKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
                            Completed {isCompleted ? "1" : "0"}
                        </p>
                        {/* Task Card complted */}
                        {isCardVisible && (
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    onClick={() => setIsCompleted(!isCompleted)}
                                    className="bg-gray-200 rounded-lg px-4 py-3 flex justify-between items-center gap-4 cursor-pointer shadow-sm hover:shadow-lg"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="text-muted-foreground text-sm line-clamp-3">
                                        Disclaimer: The information produced here is the best of our knowledge and experience, and we have tried our best to make it as accurate and up-to-date as possible, but it should not be treated as a substitute for professional advice.
                                    </p>

                                    {/* Toggle Checkbox */}
                                    <span className="cursor-pointer">
                                        {isCompleted ? (
                                            <GoCheckCircleFill className="sm:text-xl text-lg text-orange-500" />
                                        ) : (
                                            <RiCheckboxBlankCircleLine className="sm:text-xl text-lg bg-muted rounded-full" color="transparent" />
                                        )}
                                    </span>
                                </motion.div>
                            </motion.div>
                        )}

                        <div className="w-full mx-auto max-w-5xl fixed bottom-0 left-0 right-0 bg-muted z-40 p-6 flex justify-center items-center">
                            <div
                                className="flex flex-col items-center cursor-pointer"
                            >
                                <AiOutlineDelete className="text-lg" />
                                <span className="text-xs">Delete</span>
                            </div>
                        </div>
                    </>
                )
                    :
                    (
                        <>
                            <motion.div
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {
                                    tasks.map((task, index) => (
                                        <motion.div
                                            key={index}
                                            onContextMenu={() => setIsContextMenuOpenForTodos(true)}
                                            className="bg-card rounded-lg px-4 py-3 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-lg"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            whileHover={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Checkbox color="orange" />

                                            <p className="text-primary text-sm line-clamp-3">
                                                {task.taskMessage}
                                            </p>
                                        </motion.div>
                                    ))
                                }
                            </motion.div>
                            <p
                                className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 sm:mt-8 mt-4 cursor-pointer"
                                onClick={() => setIsCardVisible(!isCardVisible)}
                            >
                                {isCardVisible ? <MdKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
                                Completed 1
                            </p>
                            {isCardVisible &&
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <motion.div
                                        onContextMenu={() => setIsContextMenuOpenForTodos(true)}
                                        className="bg-[#adadad] rounded-lg px-4 py-3 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-lg"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Checkbox
                                            color="gray"
                                        />

                                        <p className="text-muted text-sm line-clamp-3">
                                            Disclaimer : The information produced here is best of our knowledge and experience and we have tried our best to make it as accurate and up-to-date as possible, but we would like to request that it should not be treated as a substitute for professional advice, diagnosis or treatment.

                                            Lybrate is a medium to provide our audience with the common information on medicines and does not guarantee its accuracy or exhaustiveness. Even if there is no mention of a warning for any drug or combination, it never means that we are claiming that the drug or combination is safe for consumption without any proper consultation with an expert.

                                            Lybrate does not take responsibility for any aspect of medicines or treatments. If you have any doubts about your medication, we strongly recommend you to see a doctor immediately.
                                        </p>
                                    </motion.div>
                                </motion.div>
                            }
                        </>
                    )
            }

        </>
    )
}

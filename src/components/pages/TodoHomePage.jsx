import Navbar from '../Navbar'
import Footer from '../Footer'
import { IoAdd } from "react-icons/io5"
import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from "framer-motion";
import { useContext } from 'react';
import { TodoContextData } from '../context/TodoContext';

function TodoHomePage() {
    const location = useLocation();
    const { isContextMenuOpenForTodos } = useContext(TodoContextData);

    return (
        <>
            {/* Navbar - Centered on Large Screens */}
            {!isContextMenuOpenForTodos &&
                < div className='w-full sm:max-w-5xl mx-auto fixed top-0 sm:left-1/2 sm:translate-x-[-50%] left-0 border-b-2 border-gray-300 py-4 px-2'>
                    <Navbar />
                </ div>
            }

            {/* Content Area */}
            <div className='sm:mt-16 mt-14 pb-20'>
                <Outlet />
            </div>

            {/* Footer - Centered on Large Screens */}
            <div className='w-full sm:max-w-5xl mx-auto fixed bottom-0 sm:left-1/2 sm:translate-x-[-50%] left-0 border-t-2 border-gray-300'>
                <Footer />
            </div>

            {/* Floating Button Logic */}
            {
                !isContextMenuOpenForTodos && <motion.div
                    initial={{ scale: 0, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-20 right-6 sm:right-[20%] z-50"
                >
                    {location.pathname === "/todo-management" &&
                        <Link
                            to="/addNotes"
                            className="rounded-full bg-yellow-500 w-[50px] h-[50px] flex justify-center items-center text-white cursor-pointer shadow-lg"
                        >
                            <IoAdd size={24} />
                        </Link>
                    }
                </motion.div >
            }
        </>
    )
}

export default TodoHomePage;

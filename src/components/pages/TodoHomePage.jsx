import Navbar from '../Navbar'
import Footer from '../Footer'
import { IoAdd } from "react-icons/io5"
import { Link, Outlet, useLocation } from 'react-router-dom'

function TodoHomePage() {
    const location = useLocation();

    return (
        <>
            <div className='w-full sm:max-w-5xl mx-auto fixed top-0 sm:border-b-2 border-gray-300 '>
                <Navbar />
            </div>
            <div className='mb-20 sm:mt-16 mt-14'>
                <Outlet />
            </div>
            <div className='w-full sm:max-w-5xl mx-auto fixed bottom-0 border-t-2 border-gray-300'>
                <Footer />
            </div>
            {
                location.pathname === "/todo-management"
                    ?
                    <Link to='/addTodo' className='rounded-full bg-yellow-500 w-[40px] h-[40px] flex justify-center items-center text-white fixed bottom-20 right-6 sm:right-[20%] cursor-pointer '>
                        <IoAdd size={24} />
                    </Link>
                    :
                    <Link to='/todo-management/tasks' className='rounded-full bg-yellow-500 w-[40px] h-[40px] flex justify-center items-center text-white fixed bottom-20 right-6 sm:right-[20%] cursor-pointer '>
                        <IoAdd size={24} />
                    </Link>
            }
        </>
    )
}

export default TodoHomePage
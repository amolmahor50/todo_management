import { useNavigate } from "react-router-dom"

export default function TodoItems() {
    const Navigate = useNavigate();

    const handleEditTodo = (id) => {
        Navigate(`/editTodo/${id}`);
    }

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4'>
            <div onClick={() => handleEditTodo(12)} className='bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg'>
                <p className="text-sm font-medium leading-none">
                    Mail Card
                </p>
                <p className="text-sm text-muted-foreground">
                    team@arrow.com
                </p>
                <p className="text-xs text-primary">
                    Oct 19, 2022
                </p>
            </div>
            <div onClick={() => handleEditTodo(12)} className='bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg'>
                <p className="text-sm font-medium leading-none">
                    TItle Data test
                </p>
                <p className="text-sm text-muted-foreground">
                    Hello
                </p>
                <p className="text-xs text-primary">
                    Oct 19, 2022
                </p>
            </div>
            <div onClick={() => handleEditTodo(12)} className='bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg'>
                <p className="text-sm font-medium leading-none">
                    TItle Data test
                </p>
                <p className="text-sm text-muted-foreground">
                    Hello
                </p>
                <p className="text-xs text-primary">
                    Oct 19, 2022
                </p>
            </div>
            <div onClick={() => handleEditTodo(12)} className='bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg'>
                <p className="text-sm font-medium leading-none">
                    TItle Data test
                </p>
                <p className="text-sm text-muted-foreground">
                    Hello
                </p>
                <p className="text-xs text-primary">
                    Oct 19, 2022
                </p>
            </div>
            <div onClick={() => handleEditTodo(12)} className='bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg'>
                <p className="text-sm font-medium leading-none">
                    TItle Data test
                </p>
                <p className="text-sm text-muted-foreground">
                    Hello
                </p>
                <p className="text-xs text-primary">
                    Oct 19, 2022
                </p>
            </div>
            <div onClick={() => handleEditTodo(12)} className='bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg'>
                <p className="text-sm font-medium leading-none">
                    TItle Data test
                </p>
                <p className="text-sm text-muted-foreground">
                    Hello
                </p>
                <p className="text-xs text-primary">
                    Oct 19, 2022
                </p>
            </div>
            <div onClick={() => handleEditTodo(12)} className='bg-card rounded-lg px-4 py-3 flex flex-col gap-1 cursor-pointer shadow-sm hover:shadow-lg'>
                <p className="text-sm font-medium leading-none">
                    TItle Data test
                </p>
                <p className="text-sm text-muted-foreground">
                    Hello
                </p>
                <p className="text-xs text-primary">
                    Oct 19, 2022
                </p>
            </div>
        </div>
    )
}

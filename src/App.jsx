import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import { getUser } from "./components/Authentication/auth";
import { useContext, useEffect } from "react";
import { LoginForm } from "./components/Authentication/loginForm";
import { CreateAccount } from "./components/Authentication/CreateAccount";
import { ForgotPassword } from "./components/Authentication/ForgotPassword";
import Settigs from "./components/pages/Settigs";
import CreateFolder from "./components/pages/CreateFolder";
import AddTodo from "./components/pages/AddTodo";
import TodoHomePage from "./components/pages/TodoHomePage";
import { TodoContextData } from "./components/context/TodoContext";
import Tasks from "./components/pages/Tasks";
import Notes from "./components/pages/Notes";
import EditTodo from "./components/pages/EditTodo";
import Profile from "./components/pages/Profile";
import TodoItems from "./components/TodoItems";


// LoginHandler Component
const LoginHandler = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      navigate("/todo-management");
    }
  }, [navigate]);

  return children;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, setUser } = useContext(TodoContextData);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = getUser();
    if (savedUser) {
      setUser(savedUser);
    } else {
      navigate("/");
    }
  }, [setUser, navigate]);

  return user ? children : null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginHandler>
      <LoginForm />
    </LoginHandler>
  },
  {
    path: 'signUp',
    element: <CreateAccount />
  },
  {
    path: 'forgotPass',
    element: <ForgotPassword />
  },
  {
    path: 'todo-management',
    element: <ProtectedRoute>
      <TodoHomePage />
    </ProtectedRoute>,
    children: [
      {
        path: '',
        element: <ProtectedRoute>
          <Notes />
        </ProtectedRoute>,
        children: [
          {
            path: '',
            element: <ProtectedRoute>
              <TodoItems />
            </ProtectedRoute>
          },
        ]
      },
      {
        path: 'tasks',
        element: <ProtectedRoute>
          <Tasks />
        </ProtectedRoute>
      },
    ]
  },
  {
    path: 'setting',
    element: <ProtectedRoute>
      <Settigs />
    </ProtectedRoute>
  },
  {
    path: 'create-folder',
    element: <ProtectedRoute>
      <CreateFolder />
    </ProtectedRoute>
  },
  {
    path: 'addTodo',
    element: <ProtectedRoute>
      <AddTodo />
    </ProtectedRoute>
  },
  {
    path: "editTodo/:userId/:folder/:taskId",
    element: <ProtectedRoute>
      <EditTodo />
    </ProtectedRoute>
  },
  {
    path: 'setting/profile',
    element: <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  },
])

function App() {
  return (
    <div className="sm:max-w-5xl w-full mx-auto">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
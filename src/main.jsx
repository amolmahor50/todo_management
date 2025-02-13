import { StrictMode, useContext, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import { CreateAccount } from './components/Authentication/CreateAccount.jsx'
import { LoginForm } from './components/Authentication/loginForm.jsx'
import { ForgotPassword } from './components/Authentication/ForgotPassword.jsx'
import { TodoContextData, TodoContextProvider } from './components/context/TodoContext.jsx'
import { getUser } from './components/Authentication/auth.jsx'
import TodoHomePage from './components/pages/TodoHomePage.jsx'
import { Toaster } from "sonner"

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
      navigate("/signIn");
    }
  }, [setUser, navigate]);

  return user ? children : null;
};

const router = createBrowserRouter([
  {
    path: "signIn",
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
    </ProtectedRoute>
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TodoContextProvider>
      <RouterProvider router={router} />
    </TodoContextProvider>
    <Toaster />
  </StrictMode>,
)

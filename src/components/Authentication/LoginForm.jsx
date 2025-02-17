import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { FaFacebookF } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { TodoContextData } from "../context/TodoContext";
import { toast } from "sonner";
import { getUser, loginWithGoogle, loginWithEmail, loginWithFacebook } from "./auth";

export function LoginForm({ className, ...props }) {
  const { setUser } = useContext(TodoContextData);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle Email and Password login
  const handleEmailWithLogin = async (e) => {
    e.preventDefault();
    console.log("Login Data:", loginData);
    try {
      await loginWithEmail(loginData.email, loginData.password);
      const user = getUser();
      if (user) {
        setUser(user);
        saveEmailToStorage(loginData.email);
        navigate("/todo-management");
        console.log("Login Success:", loginData);
      } else {
        toast.error("Failed to retrieve user after email login.");
      }
    } catch (error) {
      toast.error("Incorrect Email or Password");
    }
  };

  // Save email to localStorage
  const saveEmailToStorage = (newEmail) => {
    localStorage.setItem("savedEmail", newEmail);
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      const user = getUser();
      if (user) {
        setUser(user);
        saveEmailToStorage(user.email);
        navigate("/todo-management");
      } else {
        toast.error("Failed to retrieve user after Google login.");
      }
    } catch (error) {
      toast.error("Login with Google failed.");
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      const user = getUser();
      if (user) {
        setUser(user);
        saveEmailToStorage(user.email);
        navigate("/todo-management");
        console.log("FacebookLogin", user);
      } else {
        toast.error("Failed to retrieve user after Google login.");
      }
    } catch (error) {
      toast.error("Login with Google failed.");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6 ", className)} {...props}>
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleEmailWithLogin}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome</h1>
                    <p className="text-muted-foreground">Login to your account</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgotPass"
                        className="ml-auto text-sm underline-offset-2 hover:underline text-orange-600"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData((prev) => ({ ...prev, password: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <Button variant="orange" type="submit" className="w-full">
                    Login
                  </Button>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                      <FaGoogle color="orange" />
                      <span className="sr-only">Login with Google</span>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleFacebookLogin}>
                      <FaFacebookF color="orange" />
                      <span className="sr-only">Login with Facebook</span>
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FaGithub color="orange" />
                      <span className="sr-only">Login with GitHub</span>
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/signUp" className="underline text-orange-600 ml-1">
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/placeholder.svg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-center text-xs text-muted-foreground [&_a]:underline hover:[&_a]:text-primary">
            By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

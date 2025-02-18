import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { sendVerificationLink } from "./auth"
import { auth } from "../../lib/firebaseConfig"

export function ForgotPassword({ className, ...props }) {
    const [email, setEmail] = useState("");
    const [screenLable, setScreenLable] = useState("Enter your email below to reset your password")
    const [sendVarificationScreen, setsendVarificationScreen] = useState(null);
    const Navigate = useNavigate();

    // handle forgot send email
    const handleSendVerificationLinkForEmail = async (e) => {
        e.preventDefault();
        setsendVarificationScreen("1254");
        setScreenLable("Check your email and reset password");
        await sendVerificationLink(auth, email);
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card className="overflow-hidden">
                        <CardContent className="max-w-xl mx-auto">

                            <form className="p-6 md:p-8" onSubmit={handleSendVerificationLinkForEmail}>
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-2xl font-bold">Forgot Password</h1>
                                        <p className="text-muted-foreground">
                                            {screenLable}
                                        </p>
                                    </div>
                                    {sendVarificationScreen === null ?
                                        <>
                                            <div className="grid gap-3">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <Button variant="orange" type="submit" className="w-full">
                                                Send Verification Code
                                            </Button>
                                            <div className="text-center text-sm">
                                                If you already have an account?
                                                <Link to="/" className="underline underline-offset-4 text-orange-600 ml-1">
                                                    Sign In
                                                </Link>
                                            </div>
                                        </>
                                        :
                                        <div className='flex flex-col gap-4'>
                                            <Input
                                                disabled
                                                type="email"
                                                placeholder="Email Address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            <p className="text-red-900">
                                                Check Your Email We have send the reset password link in your email, after reset the password click Continue button
                                            </p>
                                            <div className='flex items-center gap-2'>
                                                <Button
                                                    variant="orange"
                                                    onClick={() => Navigate('/')}
                                                >
                                                    Continue
                                                </Button>
                                                <Button variant="outline"
                                                    onClick={handleSendVerificationLinkForEmail}
                                                >
                                                    Resend
                                                </Button>
                                            </div>
                                        </div>
                                    }
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
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div >
    )
}

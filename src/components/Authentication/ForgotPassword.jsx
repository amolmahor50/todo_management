import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

export function ForgotPassword({ className, ...props }) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card className="overflow-hidden">
                        <CardContent className="max-w-xl mx-auto">
                            <form className="p-6 md:p-8">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-2xl font-bold">Forgot Password</h1>
                                        <p className="text-muted-foreground">
                                            Enter your email below to reset your password
                                        </p>
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </div>
                                    <Button variant="orange" type="submit" className="w-full">
                                        Send Verification Code
                                    </Button>
                                    <div className="text-center text-sm">
                                        If you already have an account?
                                        <Link to="/signIn" className="underline underline-offset-4 text-orange-600 ml-1">
                                            Sign In
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
                    <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                        and <a href="#">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </div>
    )
}

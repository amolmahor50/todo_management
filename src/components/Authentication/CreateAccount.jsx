import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { useContext, useState } from "react"
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { toast } from "sonner"
import { TodoContextData } from "../context/TodoContext"
import { db } from "../../lib/firebaseConfig"

const required = [
    { regex: /.{8,}/, message: "Password must be at least 8 characters long." },
    { regex: /[0-9]/, message: "Password must contain at least one number." },
    { regex: /[A-Z]/, message: "Password must contain at least one uppercase letter." },
    { regex: /[a-z]/, message: "Password must contain at least one lowercase letter." },
    { regex: /[^A-Za-z0-9]/, message: "Password must contain at least one special character." }
];

export function CreateAccount({ className, ...props }) {
    const { setUser } = useContext(TodoContextData);
    const auth = getAuth();
    const [typePassword, setTypePassword] = useState("password");
    const [confirmTypePassword, setConfirmTypePassword] = useState("password");
    const [loading, setLoading] = useState(false)

    // State for form inputs
    const [createAccountData, setCreateAccountData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
    });

    const [error, setError] = useState("");
    const Navigate = useNavigate();

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCreateAccountData({
            ...createAccountData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const validatePassword = (password) => {
        for (let rule of required) {
            if (!rule.regex.test(password)) return rule.message;
        }
        return null;
    };

    // Validation function
    const validateForm = () => {
        const { firstName, lastName, email, password, confirmPassword, termsAccepted } = createAccountData;
        if (!firstName || !lastName || !firstName.trim() || !lastName.trim()) return "First and Last Name are required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format.";
        const passwordError = validatePassword(password);
        if (passwordError) return passwordError;
        if (password !== confirmPassword) return "Passwords do not match.";
        if (!termsAccepted) return "You must accept the Terms and Conditions.";
        return null;
    };

    // password hide and show toggle
    const handleShow_hide_password1 = (type) => {
        type === "password" ? setTypePassword("text") : setTypePassword("password");
    }

    const handleShow_hide_password2 = (type) => {
        type === "password" ? setConfirmTypePassword("text") : setConfirmTypePassword("password");
    }

    // Handle form submission
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        setLoading(true);
        const { firstName, lastName, email, password } = createAccountData;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Firebase Auth profile (Only for display purposes)
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`,
            });

            // Save firstName and lastName separately in Firestore
            await setDoc(doc(db, "users", user.uid), {
                ProfileData: {
                    uid: user.uid,
                    firstName,
                    lastName,
                    email,
                }
            });

            setUser({
                uid: user.uid,
                firstName,
                lastName,
                email: user.email,
            });

            Navigate("/");
            setLoading(false);
            toast.success("Account created successfully! Please log in.");
        } catch (err) {
            toast.error("Error: Email already in use or invalid details.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Card className="overflow-hidden">
                        <CardContent className="grid p-0 md:grid-cols-2">
                            <div className="relative hidden bg-muted md:block">
                                <img
                                    src="/placeholder.svg"
                                    alt="Image"
                                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                                />
                            </div>
                            <form className="p-6 md:p-8" onSubmit={handleCreateAccount}>
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col items-center text-center">
                                        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="grid gap-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                type="text"
                                                name="firstName"
                                                placeholder="First Name"
                                                value={createAccountData.firstName}
                                                onChange={handleInputChange}

                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                type="text"
                                                name="lastName"
                                                placeholder="Last Name"
                                                value={createAccountData.lastName}
                                                onChange={handleInputChange}

                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={createAccountData.email}
                                            onChange={handleInputChange}

                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative flex items-center">
                                            <Input
                                                type={typePassword}
                                                name="password"
                                                placeholder="Password"
                                                value={createAccountData.password}
                                                onChange={handleInputChange}

                                            />
                                            <span className="absolute right-4 cursor-pointer">
                                                {
                                                    typePassword === "password" ?
                                                        <IoEyeOutline size={20} onClick={() => handleShow_hide_password1("password")} />
                                                        : <IoEyeOffOutline size={20} onClick={() => handleShow_hide_password1("text")} />
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Confirm Password</Label>
                                        <div className="relative flex items-center">
                                            <Input
                                                type={confirmTypePassword}
                                                name="confirmPassword"
                                                placeholder="Confirm Password"
                                                value={createAccountData.confirmPassword}
                                                onChange={handleInputChange}

                                            />
                                            <span className="absolute right-4 cursor-pointer">
                                                {
                                                    confirmTypePassword === "password" ?
                                                        <IoEyeOutline size={20} onClick={() => handleShow_hide_password2("password")} />
                                                        : <IoEyeOffOutline size={20} onClick={() => handleShow_hide_password2("text")} />
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            name="termsAccepted"
                                            checked={createAccountData.termsAccepted} // Make sure checkbox is controlled
                                            onClick={() => setCreateAccountData((prevState) => ({
                                                ...prevState,
                                                termsAccepted: !prevState.termsAccepted // Toggle the checkbox state
                                            }))}
                                        />
                                        <label
                                            className="my-1 text-sm font-medium leading-none"
                                        >
                                            I have read the <span className="text-orange-400 cursor-pointer">terms and conditions</span>
                                        </label>
                                    </div>
                                    {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
                                    <Button variant="orange" type="submit" className="w-full">
                                        {loading ? "Wait...." : "Create Account"}
                                    </Button>
                                    <div className="text-center text-sm">
                                        You Have already account?
                                        <Link to='/' className="underline underline-offset-4 ml-1 text-orange-600">
                                            Sign In
                                        </Link>
                                    </div>
                                </div>
                            </form>
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

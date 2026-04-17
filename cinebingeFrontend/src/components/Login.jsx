import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/authSchema";

const BASE_URL = "https://cinebinge-jc5s.onrender.com";

function Login({ setIsLoggedIn, goToSignup }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (formData) => {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                setIsLoggedIn(true);
            } else {
                alert(data.message || "Login failed");
            }
        } catch (err) {
            console.log(err);
            alert("Server error");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white">

            <h1 className="text-3xl mb-6 text-black">Login</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

                {/* Email */}
                <input
                    {...register("email")}
                    type="email"
                    placeholder="Email"
                    className="mb-2 p-2 w-64 border rounded"
                />
                <p className="text-red-500 text-sm mb-2">
                    {errors.email?.message}
                </p>

                {/* Password */}
                <input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className="mb-2 p-2 w-64 border rounded"
                />
                <p className="text-red-500 text-sm mb-2">
                    {errors.password?.message}
                </p>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-700 to-blue-600 px-6 py-2 rounded text-white mt-2"
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>

            </form>

            <p
                onClick={goToSignup}
                className="mt-4 text-blue-500 cursor-pointer"
            >
                Don’t have an account? Sign up
            </p>

        </div>
    );
}

export default Login;
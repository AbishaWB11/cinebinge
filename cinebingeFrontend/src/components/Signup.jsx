import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../schemas/authSchema";

const BASE_URL = "https://cinebinge-jc5s.onrender.com";

function Signup({ goToLogin }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (formData) => {
        try {
            const res = await fetch(`${BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Signup successful! Please login.");
                setTimeout(() => goToLogin(), 1500);
            } else {
                alert(data.message || "Signup failed");
            }
        } catch (err) {
            console.log(err);
            alert("Server error");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white p-8">

            <h1 className="text-3xl mb-6 text-black">Signup</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

                {/* Name */}
                <input
                    {...register("name")}
                    placeholder="Name"
                    className="mb-2 p-2 w-64 border rounded"
                />
                <p className="text-red-500 text-sm mb-2">
                    {errors.name?.message}
                </p>

                {/* Email */}
                <input
                    {...register("email")}
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
                    {isSubmitting ? "Signing up..." : "Signup"}
                </button>

            </form>

            <p
                onClick={goToLogin}
                className="mt-4 text-blue-500 cursor-pointer"
            >
                Already have an account? Login
            </p>

        </div>
    );
}

export default Signup;
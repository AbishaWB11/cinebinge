import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

function Signup({ goToLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignup = async () => {
        try {
            setError("");
            setSuccess("");

            if (!name || !email || !password) {
                setError("All fields are required");
                return;
            }

            const res = await fetch(`${BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess("Signup successful. Redirecting...");
                setTimeout(() => goToLogin(), 1500);
            } else {
                setError(data.message || "Signup failed");
            }

        } catch (err) {
            console.log(err);
            setError("Server error");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white text-white rounded p-8">

            <h1 className="text-3xl mb-6">Signup</h1>

            <input
                placeholder="Name"
                className="mb-3 p-2 w-64 text-black rounded"
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Email"
                className="mb-3 p-2 w-64 text-black rounded"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                className="mb-3 p-2 w-64 text-black rounded"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleSignup}
                className="bg-gradient-to-r from-purple-700 to-blue-600 px-6 py-2 rounded"
            >
                Signup
            </button>

            {error && <p className="text-red-400 mt-3">{error}</p>}
            {success && <p className="text-green-400 mt-3">{success}</p>}

            <p
                onClick={goToLogin}
                className="mt-4 text-blue-400 cursor-pointer"
            >
                Already have an account? Login
            </p>

        </div>
    );
}

export default Signup;
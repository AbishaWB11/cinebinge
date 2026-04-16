import { useState } from "react";
const BASE_URL = "https://cinebinge-jc5s.onrender.com";

function Login({ setIsLoggedIn, goToSignup }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setError("");

            const res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                setIsLoggedIn(true);
            } else {
                setError(data.message || "Login failed");
            }

        } catch (err) {
            console.log(err);
            setError("Server error");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-white text-black">

            <h1 className="text-3xl mb-6">Login</h1>

            <input
                type="email"
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
                onClick={handleLogin}
                className="bg-gradient-to-r from-purple-700 to-blue-600 px-6 py-2 rounded"
            >
                Login
            </button>

            {error && <p className="text-red-400 mt-3">{error}</p>}

            <p
                onClick={goToSignup}
                className="mt-4 text-blue-400 cursor-pointer"
            >
                Don’t have an account? Sign up
            </p>

        </div>
    );
}

export default Login;
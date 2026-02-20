import React, { useState } from "react";
import Logo from "../../public/images/logo.svg"
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../Redux/apis/authApi"
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("onkarmadane79@gmail.com");
  const [password, setPassword] = useState("Onkar123");
  const navigate = useNavigate();

  const [login, { isLoading, isError }] = useLoginMutation();

  const handleSubmit = async () => {
    try {
      const res = await login({ email, password }).unwrap();
       localStorage.setItem("Admin_token",res.token);     
      navigate("/dashboard");
      toast.success("Login Successffully");
    } catch (err) {
      console.error("Login failed", err);
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A2550] to-[#62CDB9] p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6">

        {/* Heading */}
        <img className="text-center justify-center items-center ml-32 mb-4" src={Logo}></img>
        <h2 className="text-2xl font-semibold text-center mb-4">
          Login
        </h2>

        {/* Email Input */}
        <div className="mb-4">
          <label className="text-sm font-medium">Email ID</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07d8ab]"
          />

          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07d8ab]"
          />
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full mt-4 py-2 rounded-lg font-medium transition
       ${isLoading
              ? "bg-emerald-400 cursor-not-allowed text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
        >
          {isLoading ? "Logging in..." : "Submit"}
        </button>

      </div>
    </div>
  );
}

export default Login;

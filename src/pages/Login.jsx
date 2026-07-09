import React, { useState } from "react";
import Logo from "../../public/AVMartLogo.png"
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../Redux/apis/authApi"
import { useEffect } from "react";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("onkarmadane79@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [login, { isLoading, isError }] = useLoginMutation();

  useEffect(() => {
    const token = localStorage.getItem("Admin_token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (!isExpired) {
          navigate("/dashboard");
        } else {
          localStorage.removeItem("Admin_token");
          localStorage.removeItem("admin");
        }
      } catch (err) {
        localStorage.removeItem("Admin_token");
      }
    }
  }, [navigate]);

  const handleSubmit = async () => {
    try {
      const res = await login({ email, password }).unwrap();

      if (!res?.token) {
        toast.error(res?.error || res?.message || "Login failed");
        return;
      }

      localStorage.setItem("Admin_token", res.token);
      localStorage.setItem("admin", JSON.stringify(res.admin));

      toast.success(res.message || "Login Successfully");
      navigate("/dashboard");

    } catch (err) {
      console.error("Login failed", err);
      toast.error(err?.data?.error || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A2550] to-[#FF8800]/60 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6">

        {/* Heading */}
        <img className="text-center justify-center items-center ml-24 w-48 h-28 mb-4" src={Logo}></img>
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

          <div className="mb-4">
            <label className="text-sm font-medium">Password</label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07d8ab]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full mt-4 py-2 rounded-lg font-medium transition
       ${isLoading
              ? "bg-gradient-to-r from-[#FD610D] to-[#FF8800] cursor-not-allowed text-white"
              : "bg-gradient-to-br from-[#FD610D] to-[#FF8800] hover:bg-emerald-700 text-white"}`}
        >
          {isLoading ? "Logging in..." : "Submit"}
        </button>

      </div>
    </div>
  );
}

export default Login;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      toast.error("Session expired. Please log in again.");
      navigate("/");
    };
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <AppRouter />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
}

export default App;
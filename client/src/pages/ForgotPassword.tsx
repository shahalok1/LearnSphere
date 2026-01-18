import { useState } from "react";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setToken(res.data.resetToken);
      alert("Reset token generated (dev mode)");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2">
          Generate Reset Token
        </button>

        {token && (
          <p className="mt-3 text-sm break-all">
            <strong>Reset Token:</strong> {token}
          </p>
        )}
      </form>
    </div>
  );
}

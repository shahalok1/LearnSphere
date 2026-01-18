import { useState } from "react";
import api from "../api/axios";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");

  const handleReset = async (e: any) => {
    e.preventDefault();
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: password
      });
      alert("Password reset successful");
    } catch (err: any) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-6 rounded shadow w-96" onSubmit={handleReset}>
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Reset token"
          onChange={(e) => setToken(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          type="password"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-black text-white p-2">
          Reset Password
        </button>
      </form>
    </div>
  );
}

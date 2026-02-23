import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {

  const [email,setEmail] = useState("");
  const [msg,setMsg] = useState("");

  const submit = async e => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/auth/forgot-password",{email});
      setMsg(res.data.message);
    } catch(err){
      setMsg(err.response?.data?.message);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">

      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-96 space-y-4">

        <h2 className="text-xl font-bold">Forgot Password</h2>

        <input
          placeholder="Email"
          className="border p-2 w-full"
          onChange={e=>setEmail(e.target.value)}
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Send Reset Link
        </button>

        {msg && <p className="text-center text-green-600">{msg}</p>}
      </form>

    </div>
  );
}
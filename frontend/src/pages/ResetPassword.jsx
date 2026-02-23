import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword(){

  const { token } = useParams();
  const navigate = useNavigate();
  const [password,setPassword] = useState("");
  const [msg,setMsg] = useState("");

  const submit = async e =>{
    e.preventDefault();

    try{
      await axios.post(`http://localhost:8000/api/auth/reset-password/${token}`,{password});
      navigate("/login");
    }catch(err){
      setMsg("Token expired");
    }
  }

  return(
    <div className="h-screen flex justify-center items-center bg-gray-100">

      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-96 space-y-4">

        <h2 className="text-xl font-bold">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          className="border p-2 w-full"
          onChange={e=>setPassword(e.target.value)}
        />

        <button className="bg-green-600 text-white w-full py-2 rounded">
          Reset
        </button>

        {msg && <p className="text-red-600 text-center">{msg}</p>}

      </form>

    </div>
  )
}
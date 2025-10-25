import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login() function from AuthContext

  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user || !pass) {
      toast.error('Fill both fields');
      return;
    }

    // ✅ use login() from AuthContext
    const result = await login(user, pass);

    if (result.success) {
      toast.success('Login successful!');
      navigate('/Homepage');
      setUser('');
      setPass('');
    } else {
      toast.error(result.message || 'Invalid credentials');
      setPass('');
    }
  };

  return (
    <div className="bg-[url(@/assets/solar-bg-5.jpg)] bg-cover bg-center h-screen flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="bg-transparent backdrop-blur-md border border-white/30 shadow-2xl flex flex-col gap-5 p-10 rounded-2xl w-80 sm:w-96 text-center"
      >
        <h1 className="text-2xl font-semibold text-white drop-shadow-lg">
          Welcome Back
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="p-2 rounded-md outline-none border border-white/40 bg-white/30 text-white placeholder:text-gray-200 focus:bg-white/40 focus:border-white transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="p-2 rounded-md outline-none border border-white/40 bg-white/30 text-white placeholder:text-gray-200 focus:bg-white/40 focus:border-white transition"
        />

        <button
          type="submit"
          className="bg-white/70 hover:bg-white text-gray-800 font-semibold py-2 rounded-md transition cursor-pointer mt-7"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

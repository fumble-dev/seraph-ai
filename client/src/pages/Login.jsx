import React from 'react'

const Login = () => {
  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] 
        text-gray-200 rounded-lg shadow-xl border border-gray-800 bg-gray-900"
    >
      {/* Title */}
      <p className="text-2xl font-medium m-auto">
        <span className="text-purple-400">User</span>{" "}
        {state === "login" ? "Login" : "Sign Up"}
      </p>

      {/* Name (only register) */}
      {state === "register" && (
        <div className="w-full">
          <p className="text-sm text-gray-400">Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Type here"
            className="border border-gray-700 rounded w-full p-2 mt-1 
              bg-gray-800 text-gray-200 placeholder-gray-500
              focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
            type="text"
            required
          />
        </div>
      )}

      {/* Email */}
      <div className="w-full">
        <p className="text-sm text-gray-400">Email</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Type here"
          className="border border-gray-700 rounded w-full p-2 mt-1 
            bg-gray-800 text-gray-200 placeholder-gray-500
            focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
          type="email"
          required
        />
      </div>

      {/* Password */}
      <div className="w-full">
        <p className="text-sm text-gray-400">Password</p>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Type here"
          className="border border-gray-700 rounded w-full p-2 mt-1 
            bg-gray-800 text-gray-200 placeholder-gray-500
            focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
          type="password"
          required
        />
      </div>

      {/* Toggle login/register */}
      {state === "register" ? (
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => setState("login")}
            className="text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            Click here
          </span>
        </p>
      ) : (
        <p className="text-sm text-gray-400">
          Create an account?{" "}
          <span
            onClick={() => setState("register")}
            className="text-purple-400 hover:text-purple-300 cursor-pointer"
          >
            Click here
          </span>
        </p>
      )}

      {/* Submit Button */}
      <button
      type='submit'
        className="bg-purple-500 hover:bg-purple-600 transition-all 
          text-white w-full py-2 rounded-md cursor-pointer shadow-md"
      >
        {state === "register" ? "Create Account" : "Login"}
      </button>
    </form>
  );
};

export default Login;

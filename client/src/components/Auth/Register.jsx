import { useAuth } from "@/context/AuthContext";
import { set } from "lodash";
import React from "react";

const Register = ({ isRegisterPopup, setIsRegisterPopup }) => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { register } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const form = e.target;
    try {
      await register(username, email, password);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("Register Error!!!", error);
    }
  };
  const onClose = () => {
    setIsRegisterPopup(false);
  };

  return (
    <div>
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <div className=" justify-between items-center mb-6 cursor-pointer">
            <div className="flex justify-between items-center mb-6 cursor-pointer">
              <h1 className="text-2xl font-bold text-center flex-1">
                Register
              </h1>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-1">
                Username:
                <input
                  type="text"
                  name="username"
                  required
                  className="border border-gray-300 p-2 rounded-md"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                Email:
                <input
                  type="email"
                  name="email"
                  required
                  className="border border-gray-300 p-2 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-1">
                Password:
                <input
                  type="password"
                  name="password"
                  required
                  className="border border-gray-300 p-2 rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <div className="flex justify-center p-2 bg-success text-white rounded-md hover:bg-primary/100 cursor-pointer transition-colors">
                <button type="submit" className="btn p-2 cursor-pointer" onClick={handleSubmit}>
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

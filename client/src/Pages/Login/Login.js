import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../../axios/instance";
import { useSelector, useDispatch } from "react-redux";
import { setAuth } from "../../redux/actions";

function Login() {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const history = useHistory();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(userData);

      if (res.status === 400) {
        toast.error(res.data.error);
      } else if (res.status === 200) {
        
        // Dispatch login state
        dispatch(setAuth(true));

        // Redirect to homepage
        history.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      history.replace("/");
    }
  }, [isAuthenticated, history]);

  return (
    <div className="login">
      <ToastContainer />
      <div className="login__wrapper">
        <div className="login_left">
          <div className="inputs">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              autoComplete="off"
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />

            <button onClick={handleLogin}>Login</button>
            <p>
              Don’t have an account? <Link to="/signup">Signup</Link>
            </p>
          </div>
        </div>

        <div className="login_right">
          <div className="login__content">
            <h1>Login</h1>
            <h4>Secure your passwords, for free.</h4>
            <p>
              New here? <Link to="/signup">Signup</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

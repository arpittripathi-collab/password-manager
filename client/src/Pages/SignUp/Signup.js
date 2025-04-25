import React, { useState, useEffect } from 'react';
import './Signup.css';
import { Link, useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signupUser } from '../../axios/instance';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';

function Signup() {
    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        cpassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            const res = await signupUser(userData);
            if (res.status === 400) {
                toast.error(res.data.error);
                setIsLoading(false);
            } else if (res.status === 201) {
                toast.success(res.data.message);
                setUserData({ name: '', email: '', password: '', cpassword: '' });
                setIsLoading(false);
                history.push('/signin');
            }
        } catch (error) {
            toast.error("Something went wrong.");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) history.replace('/');
    }, [isAuthenticated, history]);

    return (
        <div className="signup">
            <ToastContainer />
            <div className="signup__wrapper">
                {/* Left side: form */}
                <div className="signup__left">
                    <div className="inputs">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" name="name" placeholder="Full Name" value={userData.name} onChange={handleChange} required />
                    </div>
                    <div className="inputs">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
                    </div>
                    <div className="inputs">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
                    </div>
                    <div className="inputs">
                        <label htmlFor="cpassword">Confirm Password</label>
                        <input type="password" id="cpassword" name="cpassword" placeholder="Confirm Password" value={userData.cpassword} onChange={handleChange} required />
                    </div>
                    
                    {isLoading && <ReactLoading type="balls" color="#ff1f5a" height={20} width={20} />}
                    <button onClick={handleRegister} disabled={isLoading}>
                        {isLoading ? "Signing Up..." : "SignUp"}
                    </button>
                </div>

                {/* Right side: Image and text */}
                <div className="signup__right">
                    <div className="signup__content">
                        <h1>SignUp</h1>
                        <h4>Secure your passwords with ease.</h4>
                        <p>Already have an account? <Link to="/signin">Login</Link></p>
                        <a className="attr" href="https://www.freepik.com/vectors/star" target="_blank" rel="noreferrer">
                           
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;

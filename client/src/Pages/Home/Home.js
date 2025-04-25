import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import "./Home.css";

function Home() {
    const { name, isAuthenticated } = useSelector(state => state);

    return (
        <div className="home">
            <div className="home__left">
                {!isAuthenticated ? (
                    <>
                        <h1 >
                            Welcome to <span className="name">Password Manager</span>
                        </h1>
                        <p >
                            The best and most secure way to store your passwords, all in one place.
                        </p>
                        <Link to="/signup" >
                            <i className="fas fa-user-plus"></i> Sign Up Now
                        </Link>
                    </>
                ) : (
                    <>
                        <h1  >
                            Welcome, <span className="name">{name}</span>
                        </h1>
                        <p>
                            Hope you're doing well! Ready to manage your saved passwords?
                        </p>
                        <Link to="/passwords">
                            <i className="fas fa-key"></i> See Your Passwords
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;

import React, { useState } from 'react';
import "./Password.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { decryptThePass, deleteAPassword } from "../../axios/instance";
import { delPass } from "../../redux/actions";
import { useDispatch } from "react-redux";

function Password({ id, name, password, email, iv }) {
    const [show, setShow] = useState(false);
    const [decPassword, setDecPassword] = useState("");

    const dispatch = useDispatch();

    // Function to delete the password
    const deletePassword = async () => {
        try {
            const res = await deleteAPassword({ id });

            if (res.status === 400) {
                toast.error(res.data.error, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else if (res.status === 200) {
                dispatch(delPass(id));  // Remove from Redux state
                toast.success(res.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Function to decrypt password
    const decryptPassword = async () => {
        try {
            if (!show) {
                const res = await decryptThePass({
                    iv: iv,
                    encryptedPassword: password,
                });

                if (res.status === 200) {
                    setDecPassword(res.data); // Set the decrypted password
                    setShow(true); // Toggle visibility to true (show password)
                }
            } else {
                setShow(false); // Toggle to hide the password
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="password">
            <ToastContainer />
            <div className="media">
                {/* Platform Icon */}
                <i className={`fab fa-${name.toLowerCase()}`}></i>
                <h3 className="password__name"> {name} </h3>

                {/* Delete button */}
                <FontAwesomeIcon
                    className="delete__btn1"
                    onClick={deletePassword}
                    icon={faTrash}
                />
            </div>

            <div className="email">
                <p> {email} </p>
            </div>

            <div className="user-password">
                {/* Password input */}
                <input
                    type={show ? "text" : "password"} // Show/hide password
                    value={decPassword}
                    disabled={true} // Disable editing
                />

                {/* Toggle eye icon to show/hide password */}
                <FontAwesomeIcon
                    icon={faEyeSlash}
                    onClick={decryptPassword}
                />
            </div>

            {/* Delete button */}
            <FontAwesomeIcon
                className="delete__btn2"
                onClick={deletePassword}
                icon={faTrash}
            />
        </div>
    )
}

export default Password;

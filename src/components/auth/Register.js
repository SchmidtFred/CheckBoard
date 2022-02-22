import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import useSimpleAuth from "../../hooks/useSimpleAuth";

export const Register = () => {
    const [credentials, syncAuth] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })
    const { register } = useSimpleAuth()
    const history = useHistory()

    const handleRegister = (e) => {
        e.preventDefault()

        const newUser = {
            firstName: credentials.firstName,
            lastName: credentials.lastName,
            email: credentials.email,
            password: credentials.password
        }

        register(newUser).then(() => {
            history.push("/")
        })
    }

    const handleUserInput = (event) => {
        const copy = {...credentials}
        copy[event.target.id] = event.target.value
        syncAuth(copy)
    }


    return (
        <main className="container--register">
            <h1 className="registrationHeader">Registration For CheckBoard</h1>
            <form className="form--register" onSubmit={handleRegister}>
                <div className="firstName inputDiv">
                    <input type="text" onChange={handleUserInput} id="firstName" className="form-control" placeholder="First name" required autoFocus />
                    <label htmlFor="firstName" className="form-label"> First Name </label>
                </div>
                <div className="lastName inputDiv">
                    <input type="text" onChange={handleUserInput} id="lastName" className="form-control" placeholder="Last name" required />
                    <label htmlFor="lastName" className="form-label"> Last Name </label>
                </div>
                <div className="email inputDiv">
                    <input type="email" onChange={handleUserInput} id="email" className="form-control" placeholder="Email address" required />
                    <label htmlFor="email" className="form-label"> Email address </label>
                </div>
                <div className="password inputDiv">
                        <input type="password" onChange={handleUserInput} id="password" className="form-control" placeholder="*******" required />
                    <label htmlFor="password" className="form-label"> Password </label>
                </div>
                <button type="submit regBtn" className="btn">
                    Sign in
                </button>
            </form>
        </main>
    )
}

export default Register;
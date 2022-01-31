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
        <main style={{ textAlign: "center" }}>
            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">Registration For CheckBoard</h1>
                <fieldset>
                    <label htmlFor="firstName"> First Name </label>
                    <input type="text" onChange={handleUserInput}
                        id="firstName"
                        className="form-control"
                        placeholder="First name"
                        required autoFocus />
                </fieldset>
                <fieldset>
                    <label htmlFor="lastName"> Last Name </label>
                    <input type="text" onChange={handleUserInput}
                        id="lastName"
                        className="form-control"
                        placeholder="Last name"
                        required />
                </fieldset>
                <fieldset>
                    <label htmlFor="email"> Email address </label>
                    <input type="email" onChange={handleUserInput}
                        id="email"
                        className="form-control"
                        placeholder="Email address"
                        required />
                </fieldset>
                <fieldset>
                        <label htmlFor="password"> Password </label>
                        <input type="password" onChange={handleUserInput}
                            id="password"
                            className="form-control"
                            placeholder="*******"
                            required />
                </fieldset>
                <fieldset>
                    <button type="submit">
                        Sign in
                    </button>
                </fieldset>
            </form>
        </main>
    )
}

export default Register;
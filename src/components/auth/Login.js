import React, { useState } from "react";
import useSimpleAuth from "../../hooks/useSimpleAuth";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";

const Login = () => {
	const [credentials, syncAuth] = useState({
		email: "",
		password: "",
		remember: false
	});
	const { login } = useSimpleAuth();
	const history = useHistory();

	// Simplistic handler for login submit
	const handleLogin = (e) => {
		e.preventDefault();
		const storage = credentials.remember ? localStorage : sessionStorage;

		/*
            For now, just store the email and userName that
            the customer enters into local storage.
        */
		console.log("*** Initiate authentication ***");
		login(credentials.email, credentials.password, storage).then(
			(success) => {
				if (success) {
					console.log("*** Rerouting to root URL ***");
					history.push("/");
				}
			}
		);
	};

	const handleUserInput = (event) => {
		const copy = { ...credentials };
		copy[event.target.id] = event.target.value;
		syncAuth(copy);
	};

	return (
		<main className="container--login">
            <div className="loginHeader">
                <h1 className="siteName">CheckBoard</h1>
				<h2 className="userGreeting">Please sign in</h2>
            </div>
				<form className="form--login" onSubmit={handleLogin}>
                    <div className="email inputDiv">
                        <input type="email" onChange={handleUserInput} id="email" className="form-control" placeholder="Email address" required autoFocus />
                        <label htmlFor="email" className="form-label"> Email address </label>
                    </div>
                    <div className="password inputDiv">
                        <input type="password" onChange={handleUserInput} id="password" className="form-control" placeholder="*******" required />
                        <label htmlFor="password" className="form-label"> Password </label>
                    </div>
                    <div className="bottomLogin">
                        <label htmlFor="remember" className="switch"> 
                            <input onChange={(event) => {
                                    const copy = { ...credentials };
                                    if (event.target.checked) {
                                        copy.remember = true;
                                    } else {
                                        copy.remember = false;
                                    }
                                    syncAuth(copy);
                                }}
                                defaultChecked={credentials.remember}
                                type="checkbox"
                                name="remember"
                                id="remember"
                            />
                            <span className="slider round authToggle"></span>
                            <div className="toggleLabel">Remember Me</div>
                        </label>
                        <button className="btn" type="submit">Sign in</button>
                    </div>
				</form>
			<section className="link--register">
				<Link to="/register">Not a member yet?</Link>
			</section>
		</main>
	);
};
export default Login;

import React from "react";
import useSimpleAuth from "../../hooks/useSimpleAuth";
import { Link, useHistory } from "react-router-dom";
import "./navbar.css";

export const NavBar = () => {
    const { logout } = useSimpleAuth();
    const history = useHistory();

    return (
        <>
        <section className="navbar">
            <Link className="nav-link" to="/">Home</Link>
            <Link className="nav-link logout" to="/Login" onClick={() => logout()}>Logout</Link>
        </section>
        </>
    )
}
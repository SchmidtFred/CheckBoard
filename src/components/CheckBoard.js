import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ApplicationViews } from "./ApplicationViews";
import Login from "./auth/Login";
import Register from "./auth/Register";
import useSimpleAuth from "../hooks/useSimpleAuth";

export const CheckBoard = () => {
    const { isAuthenticated } = useSimpleAuth();

    return <>
        <Route render={() => {
            if (isAuthenticated()) {
                return <>
                    <ApplicationViews />
                </>
            } else {
                return <Redirect to="/login" />
            }
        }} />

        <Route path="/login">
            <Login />
        </Route>

        <Route path="/register">
            <Register />
        </Route>
    </>
}
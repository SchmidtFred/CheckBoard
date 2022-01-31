import React from "react";
import { Route } from "react-router-dom";
import { HomePage } from "./homePage/HomePage";

export const ApplicationViews = () => {
    return (
        <>
            <Route path="/">
                <HomePage />
            </Route>
        </>
    )
}
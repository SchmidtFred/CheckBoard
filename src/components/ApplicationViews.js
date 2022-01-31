import React from "react";
import { Route } from "react-router-dom";
import { HomePage } from "./homePage/HomePage";
import { ListCreate } from "./listCreate/ListCreate";

export const ApplicationViews = () => {
    return (
        <>
            <Route exact path="/">
                <HomePage />
            </Route>

            <Route path="/ListCreate">
                <ListCreate />
            </Route>
        </>
    )
}
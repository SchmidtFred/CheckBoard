import React from "react";
import { Route } from "react-router-dom";
import { ActiveBoard } from "./activeBoard/ActiveBoard";
import { HomePage } from "./homePage/HomePage";
import { ListCreate } from "./listCreate/ListCreate";

export const ApplicationViews = () => {
    return (
        <>
            <Route exact path="/">
                <HomePage />
            </Route>

            <Route exact path="/ListCreate">
                <ListCreate />
            </Route>

            <Route path="/ListCreate/:templateId(\d+)">
                <ListCreate />
            </Route>

            <Route path="/ActiveBoard/:boardId(\d+)">
                <ActiveBoard />
            </Route>
        </>
    )
}
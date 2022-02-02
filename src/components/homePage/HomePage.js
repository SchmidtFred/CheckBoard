import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import TemplateData from "../../data/TemplateData";
import useSimpleAuth from "../../hooks/useSimpleAuth";
import { UserBoards } from "./UserBoards";


export const HomePage = () => {
    const [ currentUser, setUser ] = useState({});
    const { getCurrentUser } = useSimpleAuth();
    const history = useHistory();

    useEffect(() => {
        getCurrentUser().then((data) => setUser(data));
    }, [])
    return (
        <>
            <h1 className="siteName">CheckBoard</h1>
            <h2 className="userGreeting">Welcome User</h2>

            <select className="boardSelect" defaultValue=""  >
                <option value="">Choose A Board In Progress...</option>
            </select>
            <button className="btn" >Continue Board</button>
            <button className="btn" onClick={() => history.push("/ListCreate")} >Create New Board</button>

            <h2 className="">Start A Board</h2>
            <UserBoards currentUser={currentUser} />
            {/* The list of community boards goes here */}
        </>
    )
}
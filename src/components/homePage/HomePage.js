import React from "react";

export const HomePage = () => {


    return (
        <>
            <h1 className="siteName">CheckBoard</h1>
            <h2 className="userGreeting">Welcome User</h2>

            <select className="boardSelect" defaultValue=""  >
                <option value="">Choose A Board In Progress...</option>
            </select>
            <button className="btn" >Continue Board</button>
            <button className="btn" >Create New Board</button>

            <h2 className="">Start A Board</h2>
            {/* The list of user boards goes here */}
            {/* The list of community boards goes here */}
        </>
    )
}
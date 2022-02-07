import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useSimpleAuth from "../../hooks/useSimpleAuth";
import { UserBoards } from "./UserBoards";
import { CommunityBoards } from "./CommunityBoards";
import ActiveListData from "../../data/ActiveListData";
import "./HomePage.css";

export const HomePage = () => {
    const [ currentUser, setUser ] = useState({});
    const [ activeLists, setActiveLists ] = useState([]);
    const [ selectedBoard, setSelectedBoard ] = useState(0);
    const { getCurrentUser } = useSimpleAuth();
    const history = useHistory();

    useEffect(() => {
        getCurrentUser().then((data) => setUser(data));
    }, [])

    useEffect(() => {
        ActiveListData.lists.getByUser(currentUser.id).then((data) => setActiveLists(data));
    }, [currentUser]);


    const selectBoard = (event) => {
        history.push(`/ActiveBoard/${parseInt(event.target.value)}`);
    }

    return (
        <>
            <h1 className="siteName">CheckBoard</h1>
            <h2 className="userGreeting">Welcome {currentUser.firstName}</h2>
            <div className="mainMenu">
                <div className="menuItem boardSelect">
                    <div className="boardSelectBackgroundHover">
                        <div className="btn boardSelect">Continue Board</div>
                        <input type="checkbox" className="btn boardSelect menuItem" id="boardSelectToggle" defaultChecked="true"/>
                        <div className="boardSelectItemsContainer">
                            {activeLists.map((list) => (
                                <button key={list.id} value={list.id} className="btn" onClick={selectBoard}>{list.name}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <button className="btn menuItem" onClick={() => history.push("/ListCreate")} >Create Board</button>
            </div>

            <UserBoards currentUser={currentUser} />
            <CommunityBoards currentUser={currentUser} />
        </>
    )
}
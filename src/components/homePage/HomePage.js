import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useSimpleAuth from "../../hooks/useSimpleAuth";
import { UserBoards } from "./UserBoards";
import { CommunityBoards } from "./CommunityBoards";
import ActiveListData from "../../data/ActiveListData";

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
        setSelectedBoard(parseInt(event.target.value));
    }

    return (
        <>
            <h1 className="siteName">CheckBoard</h1>
            <h2 className="userGreeting">Welcome User</h2>

            <select className="boardSelect" defaultValue="" onChange={selectBoard} >
                <option value="">Choose A Board In Progress...</option>
                {activeLists.map((list) => (
                    <option key={list.id} value={list.id}>{list.name}</option>
                ))}
            </select>
            <button className="btn" onClick={() => selectedBoard ? history.push(`/ActiveBoard/${selectedBoard}`) : window.alert("select a board")}>Continue Board</button>
            <button className="btn" onClick={() => history.push("/ListCreate")} >Create New Board</button>

            <h2 className="">Start A Board</h2>
            <UserBoards currentUser={currentUser} />
            <CommunityBoards currentUser={currentUser} />
        </>
    )
}
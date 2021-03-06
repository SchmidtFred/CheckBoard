import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import TemplateData from "../../data/TemplateData";
import UserData from "../../data/UserData";
import GenerateBoard from "../activeBoard/GenerateBoard";
import "./CommunityBoards.css";

export const CommunityBoards = ({currentUser}) => {
    const [ communityTemplates, setTemplates ] = useState([]);
    const [ userLikes, setLikes ] = useState([]);
    const history = useHistory();

    useEffect(() => {
            TemplateData.lists.getAllPublicAndFinished()
            .then((data) => {
                const filteredTemplates = data.filter(x => x.user.id !== currentUser.id);
                //randomize order
                for (let i = filteredTemplates.length -1; i > 0; i--) {
                    const j = Math.floor(Math.random() * i);
                    const temp = filteredTemplates[i];
                    filteredTemplates[i] = filteredTemplates[j];
                    filteredTemplates[j] = temp;
                }
                setTemplates(filteredTemplates)
            });
            UserData.likes.getByUser()
            .then((data) => setLikes(data));
    }, [currentUser]);

    return (<>
    <section className="communityBoards">
        <h2>Community Boards</h2>
        <ul className="communityBoardsList">
            {communityTemplates.map((temp) => {
                return <li key={temp.id} className="communityBoardsItem">
                    <div className="communityBoardName">{temp.name}</div>
                    <div className="boardCreator">By {temp.user.firstName} {temp.user.lastName}</div>
                    <button className="btn btn__start ready" onClick={() => GenerateBoard(temp.id, currentUser).then((activeList) => history.push(`ActiveBoard/${activeList.id}`))}>Start</button>
                </li>
            })
        }
        </ul>
    </section>
    </>
    )
}
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import TemplateData from "../../data/TemplateData";
import GenerateBoard from "../activeBoard/GenerateBoard";
import Public from "../../images/public.png";
import Private from "../../images/private.png";
import "./UserBoards.css";

export const UserBoards = ({currentUser}) => {
    const [ userTemplates, setUserTemplates ] = useState([]);
    const [ effectTrigger, setEffectTrigger ] = useState(false);
    const history = useHistory();

    useEffect(() => {
            TemplateData.lists.getAllByUser(currentUser.id)
            .then((data) => setUserTemplates(data));
    }, [currentUser, effectTrigger]);

    return (<>
    <section className="userBoards">
        <h2>Your Boards</h2>
        <ul className="userBoardsList">
            {userTemplates.map((temp) => {
                return <li key={temp.id} className="userBoardsItem">
                    <div className="userBoardHead">
                        <div className="userBoardName">{temp.name}</div>
                        <div className="userBoardPublic">{temp.public ? <img src={Public} className="userBoardImg"/> : <img src={Private} className="userBoardImg" />}</div>
                    </div>
                    <div className="userBoardsButtons">
                        {temp.finished ?
                        <button className="btn btn__start ready" onClick={() => GenerateBoard(temp.id, currentUser).then((activeList) => history.push(`ActiveBoard/${activeList.id}`))}>Start</button> :
                        null } 
                        <button className="btn btn_edit" onClick={() => history.push(`/ListCreate/${temp.id}`)}>Edit</button>
                        <button className="btn btn__delete" onClick={() => TemplateData.lists.delete(temp.id).then(() => effectTrigger ? setEffectTrigger(false) : setEffectTrigger(true))}>Delete</button>
                    </div>
                </li>
            })
        }
        </ul>
    </section>
    </>
    )
}
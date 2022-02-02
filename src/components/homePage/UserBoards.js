import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import TemplateData from "../../data/TemplateData";

export const UserBoards = ({currentUser}) => {
    const [ userTemplates, setUserTemplates ] = useState([]);
    const history = useHistory();

    useEffect(() => {
            TemplateData.lists.getAllByUser(currentUser.id)
            .then((data) => setUserTemplates(data));
    }, [currentUser]);

    return (<>
    <section className="userBoards">
        <h2>Your Boards</h2>
        <ul className="userBoardsList">
            {userTemplates.map((temp) => {
                return <li key={temp.id} className="userBoardsItem">
                    <div className="userBoardPublic">{temp.public ? "Public" : "NotPub"}</div>
                    <div className="boardName">{temp.name}</div>
                    {temp.finished ?
                    <button className="btn btn__start ready">Start</button> :
                    <button className="btn btn__start notReady">No Start</button>
                    }   
                    <button className="btn btn_edit" onClick={() => history.push(`/ListCreate/${temp.id}`)}>Edit</button>
                    <button className="btn btn__delete">Delete</button>
                </li>
            })
        }
        </ul>
    </section>
    </>
    )
}
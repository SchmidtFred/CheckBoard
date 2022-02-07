import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ActiveListData from "../../data/ActiveListData";
import useSimpleAuth from "../../hooks/useSimpleAuth";
import "./ActiveBoard.css";
import { BoardSquare } from "./BoardSquare";

export const ActiveBoard = () => {
    const [ activeList, setActiveList ] = useState({});
    const [ boardSquares, setBoardSquares ] = useState([]);
    const [ gridArray, setGridArray ] = useState([]);
    const [ currentUser, setCurrentUser ] = useState({});
    const { getCurrentUser } = useSimpleAuth();
    const { boardId } = useParams();
    const history = useHistory();
    
    useEffect(() => {
        getCurrentUser().then((data) => setCurrentUser(data));
    }, [])

    useEffect(() => {
        if (currentUser.id && boardId) {
            ActiveListData.lists.get(boardId).then((data) => {
                if (data.userId === currentUser.id) {
                    setActiveList(data)
                } else {
                    history.push("/");
                    throw new Error("incorrect user for chosen board");
                }})
            .then(() => ActiveListData.squares.getAllByList(boardId))
            .then((data) => setBoardSquares(data))
            .catch((error) => console.log(error.message));
        }
    }, [currentUser]);

    //set our board squares into a 2d array
    useEffect(() => {
        const rowsArray = [];
        for(let y = 1; y <= activeList.gridHeight; y++) {
            const internalRowArray = [];
            for(let x = 1; x <= activeList.gridWidth; x++) {
                internalRowArray.push(boardSquares.find((square) => square.yPos === y && square.xPos === x));
            }
            rowsArray.push(internalRowArray);
        }
        setGridArray(rowsArray);;
    }, [boardSquares]);


    const deleteActiveList = () => {

        ActiveListData.lists.delete(activeList.id).then(() => history.push("/"));
    }


    return (
        <>
        <section className="header">
            <h1>{activeList.name}</h1>
            <div>{activeList.description}</div>
            <button className="btn btn-delete" onClick={deleteActiveList}>Delete List</button>
        </section>
        <article className="board">
            {gridArray.length > 0 ? gridArray.map((row) => {
                return <section key={row[0].yPos} className="gridRow">
                    {row.map((square) => <BoardSquare key={square.id} square={square} boardSquares={boardSquares} setBoardSquares={setBoardSquares} />)}
                </section>
            })
            : null }
        </article>
        </>
    )
}
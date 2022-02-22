import React, { useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import "./BoardSquare.css";
import ActiveListData from "../../data/ActiveListData";
import confetti from "canvas-confetti";

export const BoardSquare = ({square, boardSquares, setBoardSquares}) => {
    const [myCanvas, setCanvas ] = useState("");


    //confetti setup
    // useEffect(() => {
    //     const myCanvas = document.createElement("canvas");
    //     document.body.appendChild(myCanvas);
    //     setCanvas(myCanvas);
    // }, [])
    //reveal and completed functionality
    const squareClick = (event) => {
        const squareCopy = {...square};
        const promiseArray = [];
        //what to do when clicked to completed
        if (square.revealed === true) {
            squareCopy.completed = true;
            promiseArray.push(ActiveListData.squares.update(squareCopy, squareCopy.id));
            
            //get our neighbors, if they exists, updated
            for (let y = -1; y < 2; y += 2) {
                const copy = boardSquares.find((square) => square.xPos === squareCopy.xPos && square.yPos === squareCopy.yPos + y);
                //if it exists, we update it and add it to the array
                if (copy) {
                    copy.revealed = true;
                    promiseArray.push(ActiveListData.squares.update(copy, copy.id));
                }
            }

            for (let x = -1; x < 2; x += 2) {
                const copy = boardSquares.find((square) => square.xPos === squareCopy.xPos + x && square.yPos === squareCopy.yPos);
                //if it exists, we update it and add it to the array
                if (copy) {
                    copy.revealed = true;
                    promiseArray.push(ActiveListData.squares.update(copy, copy.id));
                }
            }
            
            const squareEl = document.querySelector(`#square--${square.id}`);
            const domRect = squareEl.getBoundingClientRect();
            confetti({
                particleCount : 200,
                spread: 360,
                startVelocity: 30,
                gravity: 0.7,
                ticks: 250,
                origin: {
                    x: (domRect.x + (domRect.width/2))/window.innerWidth,
                    y: (domRect.y + (domRect.height/2))/window.innerHeight
                }})

            Promise.all(promiseArray).then(() => ActiveListData.squares.getAllByList(square.activeListId)).then((data) => setBoardSquares(data));
        }
    }

    return ( <>
    <Tilt tiltEnable={square.revealed} perspective={300} tiltReverse={true} className={`parallax-effect ${square.revealed ? square.completed ? "completed" : "revealed" : "unrevealed"}`} >
        <div  id={`square--${square.id}`} className={`gridSquare column--${square.xPos}`}
                            onClick={squareClick}>
                            <div className="squareText">{square.revealed ? square.text : "secrets"}</div>
                        </div>
    </Tilt>
    </>)
}
import React, { useEffect, useState } from "react";
import useSimpleAuth from "../../hooks/useSimpleAuth";

export const ListCreate = () => {
    const [ listTemplate, updateTemplate ] = useState({
        name: "",
        description:    "",
        revealStart:    "",
        gridWidth:      0,
        gridHeight:     0,
        userId:         0,
        public:         false,
        finished:       false
    });
    const [ listItemTotal, setItemTotal ] = useState(0);
    const gridOptionsArray = [1,2,3,4,5,6,7,8,9,10];
    const { getCurrentUser } = useSimpleAuth();

    //Adjust our list item total whenever we change grid height and width
    useEffect(() =>{
        setItemTotal(listTemplate.gridWidth * listTemplate.gridHeight);
    }, [listTemplate]);

    const handleUserInput = (event) => {
        const copy = {...listTemplate};
        const id = event.target.id;
        //Make sure that we are getting an integer or boolean where we need it
        if (id.startsWith("grid")) {
            copy[id] = parseInt(event.target.value);
        } else if (id === "public" || id === "public") {
            if (event.target.value === "on") {
                copy[id] = true;
            } else {
                copy[id] = false;
            }
        } else {
            copy[id] = event.target.value;
        }
        updateTemplate(copy);
    };

    return (
        <>
            <h1>Create A New Board</h1>
            <div className="title">
                <label htmlFor="name">Board Title</label>
                <input type="text" onChange={handleUserInput} id="name" className="form-control" placeholder="My Cool Board" required autoFocus />
            </div>
            <div className="description">
                <label htmlFor="description">Board Description</label>
                <input type="textfield" onChange={handleUserInput} id="description" className="form-control" placeholder="Awesome Board Details" required />
            </div>
            <div className="gridDimensions">
                <label htmlFor="gridWidth">Grid Width</label>
                <select onChange={handleUserInput} defaultValue="" name="gridHeight" id="gridWidth">
                    <option value="0">Set Grid Width</option>
                    {gridOptionsArray.map(x => (
                        <option key={x} value={x}>{x}</option>
                    ))}
                </select>
                <label htmlFor="gridHeight">Grid Height</label>
                <select onChange={handleUserInput} defaultValue="" name="gridHeight" id="gridHeight">
                    <option value="0">Set Grid Height</option>
                    {gridOptionsArray.map(x => (
                        <option key={x} value={x}>{x}</option>
                    ))}
                </select>
            </div>
            <div className="templateCheckboxes">
                <label htmlFor="finished">Complete</label>
                <input type="checkbox" onChange={handleUserInput} name="finished" id="finished" />
                <label htmlFor="public">Public</label>
                <input type="checkbox" onChange={handleUserInput} name="public" id="public" />
            </div>

            {/* ListItemInput goes here */}
        </>
    )
}
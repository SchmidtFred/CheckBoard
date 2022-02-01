import React from "react";

export const ItemInput = ({listItem, listItemsArray, setListItemsArray}) => {

    const handleUserInput = (event) => {
        const copy = {...listItem};
        if (event.target.id === "startRevealed") {
            if (event.target.value === "on") {
                copy.startRevealed = true;
            } else {
                copy.startRevealed = false;
            }
        } else {
            copy.text = event.target.value;
        }
        const arrayCopy = listItemsArray.map((e) => ({...e}));
        const itemIndex = arrayCopy.findIndex(i => i.tempId === listItem.tempId);
        arrayCopy[itemIndex] = copy;
        setListItemsArray(arrayCopy);
    }

    return (<>
                <label htmlFor={`text--${listItem.tempId}`} >Square Text</label>
                <input type="text" onKeyUp={handleUserInput} id={`text--${listItem.tempId}`} className="form-control" placeholder={`Square - ${listItem.tempId}`}></input>
                <label htmlFor="startRevealed">Start Revealed</label>
                <input type="checkbox" onChange={handleUserInput} name="startRevealed" id="startRevealed" />
            </>
    )

}
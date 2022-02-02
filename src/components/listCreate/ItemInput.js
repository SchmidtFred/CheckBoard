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
        const itemIndex = arrayCopy.findIndex(i => i.internalTempId === listItem.internalTempId);
        arrayCopy[itemIndex] = copy;
        setListItemsArray(arrayCopy);
    }

    return (<>
                <label htmlFor="text" >Square Text</label>
                <input type="text" onKeyUp={handleUserInput} id='text' className="form-control" defaultValue={listItem.text} placeholder={`Square - ${listItem.internalTempId}`}/>
                <label htmlFor="startRevealed">Start Revealed</label>
                <input type="checkbox" onChange={handleUserInput} name="startRevealed" id="startRevealed" defaultChecked={listItem.startRevealed} />
            </>
    )

}
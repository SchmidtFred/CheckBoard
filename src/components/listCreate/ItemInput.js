import React from "react";

export const ItemInput = ({listItem, listItemsArray, setListItemsArray}) => {

    const handleUserInput = (event) => {
        const copy = {...listItem};
        if (event.target.id.startsWith("startRevealed--")) {
            if (event.target.checked) {
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
                <input type="text" onChange={handleUserInput} id={`text--${listItem.internalTempId}`}  className="form-control" value={listItem.text} placeholder={`Square - ${listItem.internalTempId}`} required/>
                <label htmlFor={`text--${listItem.internalTempId}`} className="form-label">{`Square - ${listItem.internalTempId}`}</label>
                <div className="revealedToggle">
                    <label htmlFor={`startRevealed--${listItem.internalTempId}`} className="switch">                       
                        <input type="checkbox" onChange={handleUserInput} name="startRevealed" id={`startRevealed--${listItem.internalTempId}`} checked={listItem.startRevealed} />
                        <span className="slider round"></span>
                        <div className="toggleLabel" >Start Revealed</div>
                    </label>
                </div>
            </>
    )

}
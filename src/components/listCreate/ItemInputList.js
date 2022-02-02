//This module is for styling and controlling the listItem inputs
import React from "react";
import { ItemInput } from "./ItemInput";

export const ItemInputList = ({listItems, setListItems}) => {

    return (
        <>
            <section className="inputList">
                <h2>What Goes In Your Squares</h2>
                {listItems.length > 0 ? listItems.map(item => {
                           return <div className="inputList__item" key={item.internalTempId}>
                               <ItemInput  listItem={item} listItemsArray={listItems} setListItemsArray={setListItems} />
                           </div>
                }) : null}
            </section>
        </>
    )
}
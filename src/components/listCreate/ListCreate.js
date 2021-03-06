import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useSimpleAuth from "../../hooks/useSimpleAuth";
import { ItemInputList } from "./ItemInputList";
import TemplateData from "../../data/TemplateData";
import "./ListCreate.css";

export const ListCreate = () => {
    const [ listTemplate, updateTemplate ] = useState({
        name: "",
        description:    "",
        revealStart:    "",
        userId:         0,
        public:         false,
        finished:       false
    });
    //separating these from the listTemplate so I can use them to adjust listitemTotal independently
    const [ gridWidth, setWidth ] = useState(0);
    const [ gridHeight, setHeight ] = useState(0);
    //track list item totals
    const [ listItemTotal, setItemTotal ] = useState(0);
    const [ startingTotal, setStartingTotal ] = useState(0); // to track how many list items we start with so we can determine what needs to be deleted on an update
    //keep track of all of our listItems in an array of objects
    // {text: "", startRevealed: false} listTemplateId gets set when we create the template
    const [ startingListItems, setStartingList ] = useState([]); //to access the ids of existing items that may not exist at the end FOR DELETE SPECIFICALLY
    const [ listItems, setListItems ] = useState([]); // The most up to date version of this list's data before save. And is updated AFTER save as well.
    const [ currentUser, setUser ] = useState({});
    const gridOptionsArray = [1,2,3,4,5,6,7,8,9,10];
    const { getCurrentUser } = useSimpleAuth();
    const history = useHistory();
    const { templateId } = useParams();


    //set our user
    useEffect(() => {
        getCurrentUser().then((user) => setUser(user));
    }, [])

    //set our template if we have one alread
    useEffect(() => {
        if (templateId && currentUser.id) {
            TemplateData.lists.get(templateId)
                .then((data) => {
                    if (data.userId === currentUser.id) {
                    updateTemplate(data);
                    setWidth(data.gridWidth);
                    setHeight(data.gridHeight);
                    } else {
                        history.push("/ListCreate");
                        throw new Error("incorrect user for chosen board")
                    }
                })
                .then(() => TemplateData.squares.getAllByTemplate(templateId))
                .then((data) => {
                    setListItems(data);
                    setStartingList(data);
                    setStartingTotal(data.length)
                })
                .catch(error => {
                    console.log(error.message);
                });
    }   
    }, [currentUser])
    
    //Adjust our list item total and listItems whenever we change grid height and width
    useEffect(() =>{
        const newTotal = gridWidth * gridHeight
        //now update the listItems array
        const diff = newTotal - listItemTotal;
        if (diff !== 0) {
            let copy;
            if (listItems.length > 0) {
                copy = listItems.map((m) => ({...m}));
            } else {
                copy = [];
            }
            if (diff > 0) {
                //add more empty objects to the end of the array
                if (templateId) {
                    const tempId = parseInt(templateId);
                    for (let i = 0; i < diff; i++) {
                        copy.push({text: "", startRevealed: false, listTemplateId: tempId, internalTempId: copy.length + 1})
                    }
                } else {
                    for (let i = 0; i < diff; i++) {
                        copy.push({text: "", startRevealed: false, internalTempId: copy.length + 1});
                    }
                }
            } else {
                //remove the last ones from the array
                for (let i = 0; i > diff; i--) {
                    copy.pop();
                }
            }
            setListItems(copy);
        }
        setItemTotal(newTotal);
    }, [gridWidth, gridHeight]);

    const handleUserInput = (event) => {
        const copy = {...listTemplate};
        const id = event.target.id;
        //Make sure that we are getting an integer or boolean where we need it
        if (id.startsWith("grid")) {
            if (id === "gridWidth") {
                setWidth(parseInt(event.target.value));
            } else {
                setHeight(parseInt(event.target.value));
            }
        } else if (id === "public" || id === "finished") {
            if (event.target.checked) {
                copy[id] = true;
            } else {
                copy[id] = false;
            }
        } else {
            copy[id] = event.target.value;
        }
        updateTemplate(copy);
    };

       //update the template and all existing board squares, as well as create new boardsquares where needed
    const putTemplate = () => {
        //this variable will track if there any empty list items when someone clicks finish
        let hasEmptyListItem = false;
        let hasOneRevealed   = false;

        const templateObject = {
            name: listTemplate.name,
            description: listTemplate.description,
            revealStart: listTemplate.revealStart,
            gridWidth: gridWidth,
            gridHeight: gridHeight,
            userId: currentUser.id,
            public: listTemplate.public,
            finished: listTemplate.finished
        }
        
        //add this to promisearray
        TemplateData.lists.update(templateObject, templateId).then((templateObject) => {
            const promiseArray = [];
            const diff = listItems.length - startingTotal;
            let endConditional = startingTotal;
            console.log(endConditional);

            if (diff < 0) {
                //if we have less list items now, delete the extra
                for (let i = startingTotal -1; i > listItems.length - 1; i--) {
                    promiseArray.push(TemplateData.squares.delete(startingListItems[i].id));
                }
                //update the end conditional so we aren't putting into ids that don't exist
                endConditional = listItems.length;
            } 

            console.log(endConditional)
            //update and put the previous list items into the database
            for (let i = 0; i < endConditional; i++)
            {   
                const copy = listItems[i];
                const itemObject = {
                    listTemplateId: templateObject.id,
                    text: copy.text,
                    startRevealed: copy.startRevealed,
                    internalTempId: copy.internalTempId
                };

                if (itemObject.text === "") {
                    hasEmptyListItem = true;
                }

                if (itemObject.startRevealed) {
                    hasOneRevealed = true;
                }

                promiseArray.push(TemplateData.squares.update(itemObject, listItems[i].id));
            };

            //create any new listitems that have been made
            if (diff > 0) {
                //we have more items now, so create them
                for (let i = startingTotal; i < listItems.length; i++) {
                    const copy = listItems[i];
                    const itemObject = {
                        listTemplateId: templateObject.id,
                        text: copy.text,
                        startRevealed: copy.startRevealed,
                        internalTempId: copy.internalTempId
                    };

                    if (itemObject.text === "") {
                        hasEmptyListItem = true;
                    }

                    if (itemObject.startRevealed) {
                        hasOneRevealed = true;
                    }

                    promiseArray.push(TemplateData.squares.create(itemObject));
                }
            }


            //resolve promise then go to list edit
            return Promise.all(promiseArray).then(() => {
                //unmark the template as finished if it has an empty item 
                if ((templateObject.finished && hasEmptyListItem) || (templateObject.finished && !hasOneRevealed)) {
                    const copy = templateObject;
                    copy.finished = false;
                    if (hasEmptyListItem) {
                        window.alert("Fill out all list items before saving as complete") //replace with modal
                    } else {
                        window.alert("Make sure you have at least one item start revealed!")
                    }
                    TemplateData.lists.update(templateObject, templateId).then((tempObject) => {
                        updateTemplate(tempObject);
                        history.push(`/ListCreate/${tempObject.id}`);
                    })
                } else {
                    history.push(`/ListCreate/${templateObject.id}`);
                }
            });
        }).then(() => TemplateData.squares.getAllByTemplate(templateId))
        .then((data) => {
            setListItems(data);
            setStartingList(data);
            setStartingTotal(data.length)});
    }


     //create the template and all of the boardSquareTemplates
    const createTemplate = () => {
        //this variable will track if there any empty list items when someone clicks finish
        let hasEmptyListItem = false;
        let hasOneRevealed = false;

        const templateObject = {
            name: listTemplate.name,
            description: listTemplate.description,
            revealStart: listTemplate.revealStart,
            gridWidth: gridWidth,
            gridHeight: gridHeight,
            userId: currentUser.id,
            public: listTemplate.public,
            finished: listTemplate.finished
        }

         //add this to promisearray
         TemplateData.lists.create(templateObject).then((templateObject) => {
            const promiseArray = [];
            listItems.forEach(item => {
                const itemObject = {
                    listTemplateId: templateObject.id,
                    text: item.text,
                    startRevealed: item.startRevealed,
                    internalTempId: item.internalTempId
                };

                if (itemObject.text === "") {
                    hasEmptyListItem = true;
                }

                if (itemObject.startRevealed) {
                    hasOneRevealed = true;
                }

                promiseArray.push(TemplateData.squares.create(itemObject));
            });
             
            //resolve promise then go to list edit
            return Promise.all(promiseArray).then(() => {
                //unmark the template as finished
                if ((templateObject.finished && hasEmptyListItem) || (templateObject.finished && !hasOneRevealed)) {
                    const copy = templateObject;
                    copy.finished = false;
                    if (hasEmptyListItem) {
                        window.alert("Fill out all list items before saving as complete") //replace with modal
                    } else {
                        window.alert("Make sure you have at least one item start revealed!")
                    }
                    TemplateData.lists.update(templateObject, templateObject.id).then((tempObject) => {
                        updateTemplate(tempObject);
                        history.push(`/ListCreate/${tempObject.id}`);
                    })
                } else {
                    history.push(`/ListCreate/${templateObject.id}`);
                }
            });
        })
    }

    return (
        <>
        <section className="listCreate">
            <h1>Create A New Board</h1>
            <div className="title">
                <input type="text" onChange={handleUserInput} id="name" className="form-control" value={listTemplate.name} placeholder="Board Title" required autoFocus />
                <label htmlFor="name" className="form-label">Board Title</label>
            </div>

            <div className="description">
                <input type="textfield" onChange={handleUserInput} id="description" className="form-control" value={listTemplate.description} placeholder="Awesome Board Details" required />
                <label htmlFor="description" className="form-label">Board Description</label>
            </div>

            <div className="gridDimensions">
                <label htmlFor="gridWidth" className="gridDimensionLabel">
                    <div className="dimensionName">Grid Width</div>
                    <select onChange={handleUserInput} value={gridWidth} name="gridWidth" id="gridWidth">
                        <option value="0">Set Grid Width</option>
                        {gridOptionsArray.map(x => (
                            <option key={x} value={x}  >{x}</option>
                        ))}
                    </select>
                </label>
                <label htmlFor="gridHeight" className="gridDimensionLabel">
                    <div className="dimensionName">Grid Height</div>
                    <select onChange={handleUserInput} value={gridHeight} name="gridHeight" id="gridHeight">
                        <option value="0">Set Grid Height</option>
                        {gridOptionsArray.map(x => (
                            <option key={x} value={x} selected={gridHeight === x ? "selected" : null}>{x}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="templateCheckboxes">
                <label htmlFor="finished" className="switch">
                    <input type="checkbox" onChange={handleUserInput} name="finished" id="finished" checked={listTemplate.finished} />
                    <span className="slider round"></span>
                    <div className="toggleLabel" >Complete</div>
                </label>
                <label htmlFor="public" className="switch">
                    <input type="checkbox" onChange={handleUserInput} name="public" id="public" checked={listTemplate.public} />
                    <span className="slider round"></span>
                    <div className="toggleLabel" >Public</div>
                </label>
            </div>

            <div className="saveButton">
                <button className="btn saveBtn" onClick={templateId ? putTemplate : createTemplate}>Save</button>
            </div>

            <ItemInputList listItems={listItems} setListItems={setListItems} />
        </section>    
        </>
    )
}   
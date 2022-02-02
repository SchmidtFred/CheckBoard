import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useSimpleAuth from "../../hooks/useSimpleAuth";
import { ItemInputList } from "./ItemInputList";
import TemplateData from "../../data/TemplateData";

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
    const [ startingTotal, setStartingTotal ] = useState(0); // to track how many list items we start with so we can determine what needs to be put, posted, or deleted on an update
    //keep track of all of our listItems in an array of objects
    // {text: "", startRevealed: false} listTemplateId gets set when we create the template
    const [ startingListItems, setStartingList ] = useState([]); //to access the ids of existing items that may not exist at the end
    const [ listItems, setListItems ] = useState([]);
    const [ currentUser, setUser ] = useState({});
    const gridOptionsArray = [1,2,3,4,5,6,7,8,9,10];
    const { getCurrentUser } = useSimpleAuth();
    const history = useHistory();
    const [ checked, setChecked ] = useState(true);
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
                    const tempId = templateId;
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
            const diff = listItemTotal - startingTotal;
            let endConditional = startingTotal;

            if (diff < 0) {
                //if we have less list items now, delete the extra
                for (let i = startingTotal -1; i > listItemTotal - 1; i--) {
                    promiseArray.push(TemplateData.squares.delete(startingListItems[i].id));
                }
                //update the end conditional so we aren't putting into ids that don't exist
                endConditional = listItemTotal;
            } 

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
                promiseArray.push(TemplateData.squares.update(itemObject, startingListItems[i].id));
            };

            //create any new listitems that have been made
            if (diff > 0) {
                //we have more items now, so create them
                for (let i = startingTotal; i < listItemTotal; i++) {
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

                    promiseArray.push(TemplateData.squares.create(itemObject));
                }
            }


            //resolve promise then go to list edit
            return Promise.all(promiseArray).then(() => {
                //unmark the template as finished
                if (templateObject.finished && hasEmptyListItem) {
                    const copy = templateObject;
                    copy.finished = false;
                    window.alert("Fill out all list items before saving as complete") //replace with modal
                    TemplateData.lists.update(templateObject, templateId).then((tempObject) => {
                        updateTemplate(tempObject);
                        history.push(`/ListCreate/${tempObject.id}`);
                    })
                } else {
                    history.push(`/ListCreate/${templateObject.id}`);
                }
            });
        })
    }


     //create the template and all of the boardSquareTemplates
    const createTemplate = () => {
        //this variable will track if there any empty list items when someone clicks finish
        let hasEmptyListItem = false;

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

                promiseArray.push(TemplateData.squares.create(itemObject));
            });
             
            //resolve promise then go to list edit
            return Promise.all(promiseArray).then(() => {
                //unmark the template as finished
                if (templateObject.finished && hasEmptyListItem) {
                    const copy = templateObject;
                    copy.finished = false;
                    window.alert("Fill out all list items before saving as complete") //replace with modal
                    TemplateData.lists.update(templateObject, templateId).then((tempObject) => {
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
            <h1>Create A New Board</h1>
            <div className="title">
                <label htmlFor="name">Board Title</label>
                <input type="text" onChange={handleUserInput} id="name" className="form-control" defaultValue={listTemplate.name} placeholder="Cool Board Name" required autoFocus ></input>
            </div>
            <div className="description">
                <label htmlFor="description">Board Description</label>
                <input type="textfield" onChange={handleUserInput} id="description" className="form-control" defaultValue={listTemplate.description} placeholder="Awesome Board Details" required />
            </div>
            <div className="gridDimensions">
                <label htmlFor="gridWidth">Grid Width</label>
                <select onChange={handleUserInput} defaultValue="" name="gridWidth" id="gridWidth">
                    <option value="0">Set Grid Width</option>
                    {gridOptionsArray.map(x => (
                        <option key={x} value={x} selected={gridWidth === x ? "selected" : null} >{x}</option>
                    ))}
                </select>
                <label htmlFor="gridHeight">Grid Height</label>
                <select onChange={handleUserInput} defaultValue="" name="gridHeight" id="gridHeight">
                    <option value="0">Set Grid Height</option>
                    {gridOptionsArray.map(x => (
                        <option key={x} value={x} selected={gridHeight === x ? "selected" : null}>{x}</option>
                    ))}
                </select>
            </div>
            <div className="templateCheckboxes">
                <label htmlFor="finished">Complete</label>
                <input type="checkbox" onChange={handleUserInput} name="finished" id="finished" checked={listTemplate.finished} />
                <label htmlFor="public">Public</label>
                <input type="checkbox" onChange={handleUserInput} name="public" id="public" checked={listTemplate.public} />
            </div>
            <div className="saveButton">
                <button onClick={templateId ? putTemplate : createTemplate}>Save</button>
            </div>
            <ItemInputList listItems={listItems} setListItems={setListItems} />
        </>
    )
}   
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
    //keep track of all of our listItems in an array of objects
    // {text: "", startRevealed: false} listTemplateId gets set when we create the template
    const [ listItems, setListItems ] = useState([]);
    const [ currentUser, setUser ] = useState({});
    const gridOptionsArray = [1,2,3,4,5,6,7,8,9,10];
    const { getCurrentUser } = useSimpleAuth();
    const history = useHistory();


    //set our user
    useEffect(() => {
        getCurrentUser().then((user) => setUser(user))
    }, [])

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
                for (let i = 0; i < diff; i++) {
                    copy.push({text: "", startRevealed: false, tempId: copy.length + 1});
                }
            } else {
                //remove the last ones from the array
                for (let i = 0; i > diff; i++) {
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

    //create the template and all of the boardSquareTemplates
    const createTemplate = () => {
        

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
                    startRevealed: item.startRevealed
                };

                promiseArray.push(TemplateData.squares.create(itemObject));
            });

            //resolve promise then go to list edit
            return Promise.all(promiseArray).then(() => history.push(`/ListEdit/${templateObject.id}`));
        })
    }

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
            <div className="saveButton">
                <button onClick={createTemplate}>Save</button>
            </div>
            <ItemInputList listItems={listItems} setListItems={setListItems} />
        </>
    )
}
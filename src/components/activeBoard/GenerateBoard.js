import TemplateData from "../../data/TemplateData";
import ActiveListData from "../../data/ActiveListData";

async export default GenerateBoard = (templateId, currentUser) => {
    //grab our template
    const template = await TemplateData.lists.getExpanded(templateId);
    //randomize our list items using the Fisher Yates Method
    const boardSquares = template.boardSquareTemplates;
    for (let i = boardSquares.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = boardSquares[i];
        boardSquares[i] = boardSquares[j];
        boardSquares[j] = temp;
    }

    //create our activelist in the database
    const activeListObject = {
        userId      :    currentUser.id,
        myTemplateId:   template.id,
        name        :   template.name,
        description :   template.description,
        revealStart :   template.revealStart,
        gridWidth   :   template.gridWidth,
        gridHeight  :   template.gridHeight,
        creatorId   :   template.userId,
    }

    const activeList = await ActiveListData.lists.create(activeListObject);

    //Create the board square objects now and put them into the database
    const promiseArray = [];
    let index = 0;

    for (let y = 1; y <= activeList.gridHeight; y++) {
        for (let x = 1; x <= activeList.gridWidth; x++) {
            const square = {
                myTemplateId:   template.id,
                activeListId:   activeList.id,
                completed   :   false,
                revealed    :   boardSquares[index].startRevealed,
                xPos        :   x,
                yPos        :   y,
                text        :   boardSquares[index].text
            }

            //tick up our index counter
            index++;

            //put our object into the promise array
            promiseArray.push(ActiveListData.squares.create(square));
        }
    }

    return Promise.all(promiseArray);
}
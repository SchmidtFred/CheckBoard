//Module for access to any data pertaining to an activeList, including boardSquares
import Settings from "./Settings";
import { fetchIt } from "./Fetch";

export default {
    lists : {
        async get(id) {
            return await fetchIt(`${Settings.remoteURL}/activeLists/${id}`);
        },
        async create(listObject) {
            return await fetchIt(`${Settings.remoteURL}/activeLists`, "POST", JSON.stringify(listObject));
        },
        async getByUser(userId) {
            return await fetchIt(`${Settings.remoteURL}/activeLists?userId=${userId}`);
        },
        async getExpanded(listId) {
            return await fetchIt(`${Settings.remoteURL}/activeLists/${listId}?_embed=boardSquares`)
        }
    },

    squares : {
        async get(id) {
            return await fetchIt(`${Settings.remoteURL}/boardSquares/${id}`);
        },
        async create(squareObject) {
            return await fetchIt(`${Settings.remoteURL}/boardSqures`, "POST", JSON.stringify(squareObject));
        },
        async getAllByList(listId) {
            return await fetchIt(`${Settings.remoteURL}/boardSquareTemplates/?activeListId=${listId}`)
        }
    }
}
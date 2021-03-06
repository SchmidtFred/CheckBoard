//Module for access to any data related to a listTemplate, including boadSquareTemplates and revealedPositions
import Settings from "./Settings";
import { fetchIt } from "./Fetch";

export default {
    lists: {
        async get(id) {
            return await fetchIt(`${Settings.remoteURL}/listTemplates/${id}`);
        },
        async getExpanded(id) {
            return await fetchIt(`${Settings.remoteURL}/listTemplates/${id}?_embed=boardSquareTemplates&_embed=revealedPositions&_expand=user`)
        },
        async create(templateObject) {
            return await fetchIt(`${Settings.remoteURL}/listTemplates`, "POST", JSON.stringify(templateObject));
        },
        async findByName(name) {
            return await fetchIt(`${Settings.remoteURL}/listTeamplates?name_like=${name}`)
        },
        async getAllByUser(userId) {
            return await fetchIt(`${Settings.remoteURL}/listTemplates?userId=${userId}`);
        },
        async getAllPublicAndFinished() {
            return await fetchIt(`${Settings.remoteURL}/listTemplates?public=true&finished=true&_expand=user`);
        },
        async update(templateObject, templateId) {
            return await fetchIt(`${Settings.remoteURL}/listTemplates/${templateId}`, "PUT", JSON.stringify(templateObject));
        },
        async delete(id) {
            return await fetchIt(`${Settings.remoteURL}/listTemplates/${id}`, "DELETE");
        }

        //may add search functions to find by size here 
    },

    squares: {
        async get(id) {
            return await fetchIt(`${Settings.remoteURL}/boardSquareTemplates/${id}`)
        },
        async create(squareObject) {
            return await fetchIt(`${Settings.remoteURL}/boardSquareTemplates`, "POST", JSON.stringify(squareObject));
        },
        async getAllByTemplate(templateId) {
            return await fetchIt(`${Settings.remoteURL}/boardSquareTemplates/?listTemplateId=${templateId}`)
        },
        async update(squareObject, squareId) {
            return await fetchIt(`${Settings.remoteURL}/boardSquareTemplates/${squareId}`, "PUT", JSON.stringify(squareObject));
        }, 
        async delete(id) {
            return await fetchIt(`${Settings.remoteURL}/boardSquareTemplates/${id}`, "DELETE");
        }
    }
}
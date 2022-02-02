//Module for the access to any data that pertains to users and likes
import Settings from"./Settings";
import { fetchIt } from "./Fetch";

export default {
    users : {
        async get(id){
            return await fetchIt(`${Settings.remoteURL}/users/${id}`);
        },
        async create(userObject) {
            return await fetchIt(`${Settings.remoteURL}/users`, "POST", JSON.stringify(userObject));
        },
        async update(userObject, id) {
            return await fetchIt(`${Settings.remoteURL}/users/${id}`, "PUT", JSON.stringify(userObject));
        },
        async find(email, pwd) {
            return await fetchIt(`${Settings.remoteURL}/users?email=${email}&password=${pwd}`);
        },
        async delete(id) {
            return await fetchIt(`${Settings.remoteURL}/users/${id}`, "DELETE");
        },
        async getAll() {
            return await fetchIt(`${Settings.remoteURL}/users`);
        }
    },

    likes: {
        async get(id) {
            return await fetchIt(`${Settings.remoteURL}/likes/${id}`);
        },
        async create(likeObject) {
            return await fetchIt(`${Settings.remoteURL}/likes`, "POST", JSON.stringify(likeObject));
        },
        async findByUser(userId) {
            return await fetchIt(`${Settings.remoteURL}/likes?userId=${userId}`);
        },
        async findByTemplate(templateId) {
            return await fetchIt(`${Settings.remoteURL}/likes?listTemplateId=${templateId}`);
        },
        async getAll() {
            return await fetchIt(`${Settings.remoteURL}/likes`);
        },
        async delete(id) {
            return await fetchIt(`${Settings.remoteURL}/likes/${id}`, "DELETE");
        }
    }
}
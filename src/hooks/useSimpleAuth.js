import UserData from "../data/UserData"

const useSimpleAuth = () => {

    const isAuthenticated = () => localStorage.getItem("check_token") !== null
        || sessionStorage.getItem("check_token") !== null

    const register = (user) => {
        return UserData.users.create(user)
            .then(response => {
                if ("id" in response) {
                    const baseUserObject = response
                    let userId = parseInt(baseUserObject.id);
                    localStorage.setItem("check_token", userId)
                }
            })
    }

    const login = (email, password, remember) => {
        return UserData.users.find(email, password)
            .then(matchingUsers => {
                if (matchingUsers.length > 0) {
                    const baseUserObject = matchingUsers[0]
                    let userId = baseUserObject.id;
                    remember.setItem("check_token", userId)
                    return true
                }
                return false
            })
    }

    const logout = () => {
        console.log("*** Toggling auth state and removing credentials ***")
        localStorage.removeItem("check_token")
        sessionStorage.removeItem("check_token")
    }

    const getCurrentUser = () => {
        let userId = parseInt(localStorage.getItem("check_token"));
        if (!userId) {
            userId = parseInt(sessionStorage.getItem("check_token"));
        }
        return UserData.users.get(userId);
    }

    return { isAuthenticated, logout, login, register, getCurrentUser }
}

export default useSimpleAuth
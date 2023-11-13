import {
    POST_USERS,
    POST_USERS_SUCCESS,
    POST_USERS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
    error: "",
    message: "",
    loading: false,
}

const azureAddUsers = (state = INIT_STATE, action) => {
    switch (action.type) {
        case POST_USERS:
            state = {
                ...state,
                loading: true,
            };
            break;
        case POST_USERS_SUCCESS:
            state = {
                ...state,
                message: action.payload,
                loading: false,
            };
            break;
        case POST_USERS_FAIL:
            state = {
                ...state,
                error: action.payload,
                loading: false,
            }
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
}

export default azureAddUsers;
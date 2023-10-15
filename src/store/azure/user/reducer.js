import {
    GET_CURRENT_USER,
    GET_CURRENT_USER_SUCCESS,
    GET_CURRENT_USER_FAIL,
} from "./actionTypes";

const INIT_STATE = {
    user: {},
    error: "",
    loading: false,
}

const azureCurrentUser = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_CURRENT_USER:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_CURRENT_USER_SUCCESS:
            state = {
                ...state,
                user: action.payload,
                loading: false,
            };
            break;
        case GET_CURRENT_USER_FAIL:
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

export default azureCurrentUser;
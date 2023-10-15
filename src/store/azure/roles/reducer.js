import {
    GET_CURRENT_ROLE,
    GET_CURRENT_ROLE_SUCCESS,
    GET_CURRENT_ROLE_FAIL
} from "./actionTypes";

const INIT_STATE = {
    role: "",
    error: "",
    loading: false,
}

const azureCurrentRole = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_CURRENT_ROLE:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_CURRENT_ROLE_SUCCESS:
            state = {
                ...state,
                role: action.payload,
                loading: false,
            };
            break;
        case GET_CURRENT_ROLE_FAIL:
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

export default azureCurrentRole;
import { 
    GET_INVESTIGATIONS,
    GET_INVESTIGATIONS_SUCCESS,
    GET_INVESTIGATIONS_FAIL,
  } from "./actionTypes";

const INIT_STATE = {
    investigation: {},
    error: "",
    loading: true,
}

const alienInvestigations = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_INVESTIGATIONS:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_INVESTIGATIONS_SUCCESS:
            state = {
                ...state,
                investigation: action.payload,
                loading: false,
            };
            break;
        case GET_INVESTIGATIONS_FAIL:
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

export default alienInvestigations;
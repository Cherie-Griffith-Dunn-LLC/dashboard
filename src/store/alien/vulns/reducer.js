import { 
    GET_VULNS,
    GET_VULNS_SUCCESS,
    GET_VULNS_FAIL,
  } from "./actionTypes";

const INIT_STATE = {
    vulns: [],
    error: "",
    loading: true,
}

const alienVulns = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_VULNS:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_VULNS_SUCCESS:
            state = {
                ...state,
                vulns: action.payload,
                loading: false,
            };
            break;
        case GET_VULNS_FAIL:
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

export default alienVulns;
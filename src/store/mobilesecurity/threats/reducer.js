import { 
    GET_THREATS,
    GET_THREATS_SUCCESS,
    GET_THREATS_FAIL,
  } from "./actionTypes";

const INIT_STATE = {
    threats: [],
    error: "",
    loading: true,
}

const lookoutThreats = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_THREATS:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_THREATS_SUCCESS:
            state = {
                ...state,
                threats: action.payload,
                loading: false,
            };
            break;
        case GET_THREATS_FAIL:
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

export default lookoutThreats;
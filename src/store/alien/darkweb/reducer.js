import { 
    GET_ALL_DWM,
    GET_ALL_DWM_SUCCESS,
    GET_ALL_DWM_FAIL,
  } from "./actionTypes";

const INIT_STATE = {
    alarms: [],
    error: "",
    loading: true,
}

const alienDWM = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_ALL_DWM:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_ALL_DWM_SUCCESS:
            state = {
                ...state,
                alarms: action.payload,
                loading: false,
            };
            break;
        case GET_ALL_DWM_FAIL:
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

export default alienDWM;
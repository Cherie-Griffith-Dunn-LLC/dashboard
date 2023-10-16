import { 
    GET_ALARMS,
    GET_ALARMS_SUCCESS,
    GET_ALARMS_FAIL,
  } from "./actionTypes";

const INIT_STATE = {
    alarms: "",
    error: "",
    loading: true,
}

const alienAlarms = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_ALARMS:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_ALARMS_SUCCESS:
            state = {
                ...state,
                alarms: action.payload,
                loading: false,
            };
            break;
        case GET_ALARMS_FAIL:
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

export default alienAlarms;
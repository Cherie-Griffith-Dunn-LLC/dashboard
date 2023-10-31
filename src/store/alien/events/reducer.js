import { 
    GET_SYS_EVENTS,
    GET_SYS_EVENTS_SUCCESS,
    GET_SYS_EVENTS_FAIL,
  } from "./actionTypes";

const INIT_STATE = {
    events: [],
    error: "",
    loading: true,
}

const alienEvents = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_SYS_EVENTS:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_SYS_EVENTS_SUCCESS:
            state = {
                ...state,
                events: action.payload,
                loading: false,
            };
            break;
        case GET_SYS_EVENTS_FAIL:
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

export default alienEvents;
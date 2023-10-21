import { 
    GET_DICTIONARIES,
    GET_DICTIONARIES_SUCCESS,
    GET_DICTIONARIES_FAIL,
  } from "./actionTypes";

const INIT_STATE = {
    dictionary: {},
    error: "",
    loading: true,
}

const alienDictionary = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_DICTIONARIES:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_DICTIONARIES_SUCCESS:
            state = {
                ...state,
                dictionary: action.payload,
                loading: false,
            };
            break;
        case GET_DICTIONARIES_FAIL:
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

export default alienDictionary;
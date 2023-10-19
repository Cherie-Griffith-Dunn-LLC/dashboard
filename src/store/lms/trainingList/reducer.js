import {
    GET_TRAINING_LIST,
    GET_TRAINING_LIST_SUCCESS,
    GET_TRAINING_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
    employees: {},
    error: "",
    loading: true,
};

const lmsTrainingList = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_TRAINING_LIST:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_TRAINING_LIST_SUCCESS:
            state = {
                ...state,
                employees: action.payload,
                loading: false,
            };
            break;
        case GET_TRAINING_LIST_FAIL:
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

export default lmsTrainingList;
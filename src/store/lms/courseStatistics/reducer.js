import {
    GET_COURSE_STATISTICS,
    GET_COURSE_STATISTICS_SUCCESS,
    GET_COURSE_STATISTICS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
    statistics: {},
    error: "",
    loading: true,
};

const courseStatistics = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_COURSE_STATISTICS:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_COURSE_STATISTICS_SUCCESS:
            state = {
                ...state,
                statistics: action.payload,
                loading: false,
            };
            break;
        case GET_COURSE_STATISTICS_FAIL:
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

export default courseStatistics;
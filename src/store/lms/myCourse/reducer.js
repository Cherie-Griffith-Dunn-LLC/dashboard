import {
    GET_COURSE_URL,
    GET_COURSE_URL_SUCCESS,
    GET_COURSE_URL_FAIL,
} from "./actionTypes";

const INIT_STATE = {
    error: "",
    url: "",
    loading: true,
}

const lmsViewCourse = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_COURSE_URL:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_COURSE_URL_SUCCESS:
            state = {
                ...state,
                url: action.payload,
                loading: false,
            };
            break;
        case GET_COURSE_URL_FAIL:
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

export default lmsViewCourse;
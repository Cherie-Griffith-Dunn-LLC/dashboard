import {
    GET_REQUIRED_COURSES,
    GET_REQUIRED_COURSES_SUCCESS,
    GET_REQUIRED_COURSES_FAIL,
} from "./actionTypes";

const INIT_STATE = {
    error: "",
    courses: [],
    loading: true,
}

const lmsAssignedCourses = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_REQUIRED_COURSES:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_REQUIRED_COURSES_SUCCESS:
            state = {
                ...state,
                courses: action.payload,
                loading: false,
            };
            break;
        case GET_REQUIRED_COURSES_FAIL:
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

export default lmsAssignedCourses;
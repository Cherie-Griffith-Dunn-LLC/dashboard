import {
    GET_EMPLOYEE_COURSES,
    GET_EMPLOYEE_COURSES_SUCCESS,
    GET_EMPLOYEE_COURSES_FAIL,
} from "./actionTypes";

const INIT_STATE = {
    error: "",
    courses: [],
    loading: true,
}

const lmsEmployeeCourses = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_EMPLOYEE_COURSES:
            state = {
                ...state,
                loading: true,
            };
            break;
        case GET_EMPLOYEE_COURSES_SUCCESS:
            state = {
                ...state,
                courses: action.payload,
                loading: false,
            };
            break;
        case GET_EMPLOYEE_COURSES_FAIL:
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

export default lmsEmployeeCourses;
import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_EMPLOYEE_COURSES } from "./actionTypes";

import { getEmployeeCoursesFail, getEmployeeCoursesSuccess } from "./actions";

import { getAllCoursesAssignments } from "../../../helpers/lms_helper";
import { setAuthorization } from "../../../helpers/api_helper";


function* getEmployeeCourses() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getAllCoursesAssignments);
        if (response.error) {
            throw new Error(response.error);
        }
        // save the current user in local storage
        yield put(getEmployeeCoursesSuccess(response));
    } catch (error) {
        yield put(getEmployeeCoursesFail(error));
    }
}

function* employeeCoursesSaga() {
    yield takeEvery(GET_EMPLOYEE_COURSES, getEmployeeCourses);
}

export default employeeCoursesSaga;
import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_REQUIRED_COURSES } from "./actionTypes";

import { getRequiredCoursesSuccess, getRequiredCoursesFail } from "./actions";

import { getAssignedCourses } from "../../../helpers/lms_helper";
import { setAuthorization } from "../../../helpers/api_helper";


function* getMyCourses() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getAssignedCourses);
        console.log(response);
        if (response.error) {
            throw new Error(response.error);
        }
        // save the current user in local storage
        yield put(getRequiredCoursesSuccess(response));
    } catch (error) {
        yield put(getRequiredCoursesFail(error));
    }
}

function* myCoursesSaga() {
    yield takeEvery(GET_REQUIRED_COURSES, getMyCourses);
}

export default myCoursesSaga;
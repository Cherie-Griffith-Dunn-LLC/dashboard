import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_COURSE_URL } from "./actionTypes";

import { viewCourseSuccess, viewCourseFail } from "./actions";

import { getCourseUrl } from "../../../helpers/lms_helper";
import { setAuthorization } from "../../../helpers/api_helper";


function* viewMyCourse({ payload: { courseId }}) {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getCourseUrl, courseId);
        console.log(response);
        if (response.error) {
            throw new Error(response.error);
        }
        // save the current user in local storage
        yield put(viewCourseSuccess(response));
    } catch (error) {
        yield put(viewCourseFail(error));
    }
}

function* myCourseSaga() {
    yield takeEvery(GET_COURSE_URL, viewMyCourse);
}

export default myCourseSaga;
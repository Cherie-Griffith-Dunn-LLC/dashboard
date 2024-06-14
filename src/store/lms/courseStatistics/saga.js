import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_COURSE_STATISTICS } from "./actionTypes";

import { getCourseStatsFail, getCourseStatsSuccess } from "./actions";

import { getCourseStatistics } from "../../../helpers/lms_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchStatistics() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // get the platform
        const platform = localStorage.getItem("platform");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getCourseStatistics, platform);
        if (response.error) {
            throw new Error(response.error);
        }
        yield put(getCourseStatsSuccess(response));
    } catch (error) {
        yield put(getCourseStatsFail(error));
    }
}

function* courseStatsSaga() {
    yield takeEvery(GET_COURSE_STATISTICS, fetchStatistics);
}

export default courseStatsSaga;
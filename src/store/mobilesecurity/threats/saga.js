import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_THREATS } from "./actionTypes";

import { getThreatsSuccess, getThreatsFail } from "./actions";

import { getThreats } from "../../../helpers/lookout_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchLookoutThreats() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // get the platform
        const platform = localStorage.getItem("platform");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getThreats, 20, platform);
        if (response.error) {
            throw new Error(response.error);
        }
        yield put(getThreatsSuccess(response));
    } catch (error) {
        yield put(getThreatsFail(error));
    }
}

function* lookoutThreatsSaga() {
    yield takeEvery(GET_THREATS, fetchLookoutThreats);
}

export default lookoutThreatsSaga;
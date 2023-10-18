import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_ALL_DWM } from "./actionTypes";

import { getAllDWMFail, getAllDWMSuccess } from "./actions";

import { getAllDWM } from "../../../helpers/alien_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchAlarms() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getAllDWM);
        if (response.error) {
            throw new Error(response.error);
        }
        yield put(getAllDWMSuccess(response));
    } catch (error) {
        yield put(getAllDWMFail(error));
    }
}

function* darkwebSaga() {
    yield takeEvery(GET_ALL_DWM, fetchAlarms);
}

export default darkwebSaga;
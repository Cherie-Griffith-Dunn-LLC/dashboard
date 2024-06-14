import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_SYS_EVENTS } from "./actionTypes";

import { getSysEventsFail, getSysEventsSuccess } from "./actions";

import { getEvents } from "../../../helpers/alien_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchEvents() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // get the platform
        const platform = localStorage.getItem("platform");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getEvents, 20, platform);
        if (response.error) {
            throw new Error(response.error);
        }
        yield put(getSysEventsSuccess(response));
    } catch (error) {
        yield put(getSysEventsFail(error));
    }
}

function* eventSaga() {
    yield takeEvery(GET_SYS_EVENTS, fetchEvents);
}

export default eventSaga;
import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_ALARMS } from "./actionTypes";

import { getAlarmsFail, getAlarmsSuccess } from "./actions";

import { getAlarms } from "../../../helpers/alien_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchAlarms() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getAlarms);
        if (response.error) {
            throw new Error(response.error);
        }
        yield put(getAlarmsSuccess(response.message));
    } catch (error) {
        yield put(getAlarmsFail(error));
    }
}

function* alarmSaga() {
    yield takeEvery(GET_ALARMS, fetchAlarms);
}

export default alarmSaga;
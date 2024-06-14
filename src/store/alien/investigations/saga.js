import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_INVESTIGATIONS } from "./actionTypes";

import { getInvestigationsFail, getInvestigationsSuccess } from "./actions";

import { getInvestigations } from "../../../helpers/alien_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchInvestigations() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // get the platform
        const platform = localStorage.getItem("platform");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getInvestigations, 20, platform);
        if (response.error) {
            throw new Error(response.error);
        }
        yield put(getInvestigationsSuccess(response));
    } catch (error) {
        yield put(getInvestigationsFail(error));
    }
}

function* investigationsSaga() {
    yield takeEvery(GET_INVESTIGATIONS, fetchInvestigations);
}

export default investigationsSaga;
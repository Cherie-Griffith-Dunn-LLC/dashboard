import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_VULNS } from "./actionTypes";

import { getVulnsFail, getVulnsSuccess } from "./actions";

import { getVulnerbilities } from "../../../helpers/alien_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchVulns() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // get the platform
        const platform = localStorage.getItem("platform");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getVulnerbilities, 20, platform);
        if (response.error) {
            throw new Error(response.error);
        }
        yield put(getVulnsSuccess(response));
    } catch (error) {
        yield put(getVulnsFail(error));
    }
}

function* vulnsSaga() {
    yield takeEvery(GET_VULNS, fetchVulns);
}

export default vulnsSaga;
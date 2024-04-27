import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_PACKAGES } from "./actionTypes";

import { getPackagesFail, getPackagesSuccess } from "./actions";

import { getPackages } from "../../../helpers/alien_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchPackages() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getPackages);
        if (response.error) {
            throw new Error(response.error);
        }
        yield put(getPackagesSuccess(response));
    } catch (error) {
        yield put(getPackagesFail(error));
    }
}

function* packagesSaga() {
    yield takeEvery(GET_PACKAGES, fetchPackages);
}

export default packagesSaga;
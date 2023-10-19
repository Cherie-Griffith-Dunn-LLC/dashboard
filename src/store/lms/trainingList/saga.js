import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_TRAINING_LIST } from "./actionTypes";

import { getTrainingListFail, getTrainingListSuccess } from "./actions";

import { getTrainingList } from "../../../helpers/lms_helper";
import { setAuthorization } from "../../../helpers/api_helper";

function* fetchTrainingList() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getTrainingList);
        if (response.error) {
            throw new Error(response.error);
        }
        yield put(getTrainingListSuccess(response));
    } catch (error) {
        yield put(getTrainingListFail(error));
    }
}

function* trainingListSaga() {
    yield takeEvery(GET_TRAINING_LIST, fetchTrainingList);
}

export default trainingListSaga;
import { call, put, takeEvery } from "redux-saga/effects";

// Redux States
import { GET_TRAINING_LIST } from "./actionTypes";

import { getTrainingListFail, getTrainingListSuccess } from "./actions";

import { getTrainingList } from "../../../helpers/lms_helper";
import { setAuthorization } from "../../../helpers/api_helper";

import { postUsers } from "../../../helpers/azure_helper";


function* fetchTrainingList() {
    try {
        // get the auth token
        const token = localStorage.getItem("accessToken");
        // get the platform
        const platform = localStorage.getItem("platform");
        // set the authorization header
        setAuthorization(token);
        const response = yield call(getTrainingList, platform);
        if (response.error) {
            throw new Error(response.error);
        }
        // if no users found, import them
        if (response.length === 0) {
            console.log("No users found. Importing users in settings.")
            const usersResponse = yield call(postUsers, platform);
            if (usersResponse.error) {
                throw new Error(usersResponse.error);
            }

            // get the training list again
            const updatedResponse = yield call(getTrainingList, platform);
            if (updatedResponse.error) {
                throw new Error(updatedResponse.error);
            }
            yield put(getTrainingListSuccess(updatedResponse));

        } else {
            yield put(getTrainingListSuccess(response));
        }
        
    } catch (error) {
        yield put(getTrainingListFail(error));
    }
}

function* trainingListSaga() {
    yield takeEvery(GET_TRAINING_LIST, fetchTrainingList);
}

export default trainingListSaga;
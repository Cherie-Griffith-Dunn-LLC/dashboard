import { all, fork } from "redux-saga/effects";

import LayoutSaga from "./layout/saga";
import calendarSaga from "./calendar/saga";
import accountSaga from "./auth/register/saga";
import ProfileSaga from "./auth/profile/saga";
import authSaga from "./auth/login/saga";
import forgetPasswordSaga from "./auth/forgetpwd/saga"

import azureSaga from "./azure/tenant/saga";
import userSaga from "./azure/user/saga";
import roleSaga from "./azure/roles/saga";
import usersSaga from "./azure/users/saga";

import alarmSaga from "./alien/alarms/saga";
import darkwebSaga from "./alien/darkweb/saga";
import eventsSaga from "./alien/events/saga";
import dictionarySaga from "./alien/dictionary/saga";
import investigationsSaga from "./alien/investigations/saga";

import trainingListSaga from "./lms/trainingList/saga";
import courseStatsSaga from "./lms/courseStatistics/saga";
import myCoursesSaga  from "./lms/requiredCourses/saga";
import employeeCoursesSaga from "./lms/employeeCourses/saga";
import myCourseSaga from "./lms/myCourse/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(LayoutSaga),
    fork(calendarSaga),
    fork(accountSaga),
    fork(ProfileSaga),
    fork(authSaga),
    fork(forgetPasswordSaga),
    fork(azureSaga),
    fork(userSaga),
    fork(roleSaga),
    fork(alarmSaga),
    fork(darkwebSaga),
    fork(eventsSaga),
    fork(trainingListSaga),
    fork(courseStatsSaga),
    fork(dictionarySaga),
    fork(investigationsSaga),
    fork(usersSaga),
    fork(myCoursesSaga),
    fork(employeeCoursesSaga),
    fork(myCourseSaga),
  ]);
}

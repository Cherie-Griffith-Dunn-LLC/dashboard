import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Calendar
import calendar from "./calendar/reducer";

// Authentication
import forgetPassword from "./auth/forgetpwd/reducer";
import login from "./auth/login/reducer";
import profile from "./auth/profile/reducer";
import account from "./auth/register/reducer";

// Azure
import azure from "./azure/tenant/reducer";
import getCurrentUser from "./azure/user/reducer";
import getCurrentRole from "./azure/roles/reducer";
import azureAddUsers from "./azure/users/reducer";

// AlienVault
import alienAlarms from "./alien/alarms/reducer";
import alienDWM from "./alien/darkweb/reducer";
import alienEvents from "./alien/events/reducer";
import alienDictionary from "./alien/dictionary/reducer";
import alienInvestigations from "./alien/investigations/reducer";
import alienVulns from "./alien/vulns/reducer";
import alienPackages from "./alien/packages/reducer";

// LMS
import lmsTrainingList from "./lms/trainingList/reducer";
import courseStatistics from "./lms/courseStatistics/reducer";
import lmsAssignedCourses from "./lms/requiredCourses/reducer";
import lmsEmployeeCourses from "./lms/employeeCourses/reducer";
import lmsMyCourses from "./lms/myCourse/reducer";

// Lookout
import lookoutThreats from "./mobilesecurity/threats/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  calendar,
  forgetPassword,
  login,
  profile,
  account,
  azure,
  getCurrentUser,
  getCurrentRole,
  alienAlarms,
  alienDWM,
  alienEvents,
  alienVulns,
  lmsTrainingList,
  courseStatistics,
  alienDictionary,
  alienInvestigations,
  azureAddUsers,
  lmsAssignedCourses,
  lmsEmployeeCourses,
  lmsMyCourses,
  lookoutThreats,
  alienPackages,
});

export default rootReducer;

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

// AlienVault
import alienAlarms from "./alien/alarms/reducer";
import alienDWM from "./alien/darkweb/reducer";

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
});

export default rootReducer;

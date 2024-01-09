import React from "react";
import UsePanel from "./UserPanel";
import TrainingStats from "./TrainingStats";
import RecentThreats from "./RecentThreats";
import ThreatsByPriority from "./ThreatsByPriority";
import OverView from "./OverView";
//import RevenueByLocation from "./RevenueByLocation";
import TrainingList from "./TrainingList";
import { useDispatch, useSelector } from "react-redux";

import { Row, Container } from "reactstrap";

// import api functions
import { getAlarms, getSysEvents, getAllDWM, getCourseStats, getInvestigations } from "../../store/actions";
import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import * as Sentry from "@sentry/react";

const Dashboard = () => {
  document.title = "Dashboard | CYPROTECK - Security Solutions Dashboard";


  const dispatch = useDispatch();

  // get role from local storage
  const role = localStorage.getItem("role");




  React.useEffect(() => {
    if (role === "admin") {
      dispatch(getAlarms(20));
      dispatch(getSysEvents(20));
      dispatch(getAllDWM(20));
      dispatch(getCourseStats());
    } else {
      dispatch(getInvestigations(20));
    }
  }, [dispatch, role]);

  const alarmsData  = useSelector(state => state.alienAlarms);
  const eventsData  = useSelector(state => state.alienEvents);
  const dwmData     = useSelector(state => state.alienDWM);
  const courseStats = useSelector(state => state.courseStatistics);
  const investigations = useSelector(state => state.alienInvestigations);

  


  if (alarmsData.error || eventsData.error || dwmData.error || courseStats.error || investigations.error) {
    console.error(alarmsData.error, eventsData.error, dwmData.error, courseStats.error, investigations.error);
    Sentry.captureException(alarmsData.error ? alarmsData.error :
      eventsData.error ? eventsData.error :
      dwmData.error ? dwmData.error :
      courseStats.error ? courseStats.error : investigations.error);
  }



  // admin dashboard
  if (role === "admin") {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title="CYPROTECK" breadcrumbItem="Dashboard" />
            {alarmsData.error || eventsData.error || dwmData.error || courseStats.error || investigations.error ? <div className="alert alert-danger mb-4" role="alert">An error occured. Please try again.</div> : null}
            {/* User Panel Charts */}
            <UsePanel courseStats={courseStats} role={role} alarms={alarmsData} events={eventsData} dwm={dwmData} />
  
            <Row>
              {/* Overview Chart */}
              <OverView role={role} alarms={alarmsData} events={eventsData} dwm={dwmData} courseStats={courseStats} />
              {/* Threats Pie Chart */}
              <ThreatsByPriority alarms={alarmsData} />
            </Row>
  
            <Row>
              {/* Order Stats */}
              <TrainingStats courseStats={courseStats} />
              {/* Notifications */}
              <RecentThreats role={role} alarms={alarmsData} />
            </Row>
  
            {/* Latest Transaction Table */}
            <TrainingList />
          </Container>
        </div>
      </React.Fragment>
    );
  }
  // user dashboard
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="CYPROTECK" breadcrumbItem="Dashboard" />
          {/* User Panel Charts */}
          <UsePanel role={role} alarms={investigations} events={eventsData} dwm={dwmData} />

          <Row>
            {/* Overview Chart */}
            <OverView role={role} alarms={investigations} events={eventsData} dwm={dwmData} courseStats={courseStats} />
            {/* Threats Pie Chart */}
            <RecentThreats role={role} alarms={investigations} />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Dashboard);

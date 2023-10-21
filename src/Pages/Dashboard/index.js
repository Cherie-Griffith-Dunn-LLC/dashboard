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
import { getAlarms, getSysEvents, getAllDWM, getCourseStats } from "../../store/actions";
import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { use } from "i18next";

const Dashboard = () => {
  document.title = "Dashboard | CYPROTECK - Security Solutions Dashboard";


  const dispatch = useDispatch();





  React.useEffect(() => {
    dispatch(getAlarms(20));
    dispatch(getSysEvents(20));
    dispatch(getAllDWM(20));
    dispatch(getCourseStats());
  }, [dispatch]);

  const alarmsData  = useSelector(state => state.alienAlarms);
  const eventsData  = useSelector(state => state.alienEvents);
  const dwmData     = useSelector(state => state.alienDWM);
  const courseStats = useSelector(state => state.courseStatistics);
  


  if (alarmsData.error || eventsData.error || dwmData.error || courseStats.error) {
    console.log(alarmsData.error, eventsData.error, dwmData.error, courseStats.error);
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <p>An error occured. Please try again.</p>
          </Container>
        </div>
      </React.Fragment>
    )
  }



  // show dashboard
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="CYPROTECK" breadcrumbItem="Dashboard" />
          {/* User Panel Charts */}
          <UsePanel alarms={alarmsData} events={eventsData} dwm={dwmData} />

          <Row>
            {/* Overview Chart */}
            <OverView alarms={alarmsData} events={eventsData} dwm={dwmData} courseStats={courseStats} />
            {/* Threats Pie Chart */}
            <ThreatsByPriority alarms={alarmsData} />
          </Row>

          <Row>
            {/* Order Stats */}
            <TrainingStats courseStats={courseStats} />
            {/* Notifications */}
            <RecentThreats alarms={alarmsData} />
          </Row>

          {/* Latest Transaction Table */}
          <TrainingList />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Dashboard);

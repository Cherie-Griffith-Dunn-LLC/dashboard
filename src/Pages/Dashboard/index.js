import React from "react";
import UsePanel from "./UserPanel";
import OrderStatus from "./OrderStatus";
import Notifications from "./Notifications";
import SocialSource from "./SocialSource";
import OverView from "./OverView";
//import RevenueByLocation from "./RevenueByLocation";
import TrainingList from "./TrainingList";
import { useDispatch, useSelector } from "react-redux";

import { Row, Container } from "reactstrap";

// import api functions
import { getCurrentUser, getAlarms, getSysEvents, getAllDWM } from "../../store/actions";
import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const Dashboard = () => {
  document.title = "Dashboard | CYPROTECK - Security Solutions Dashboard";

  const [userProfile, setUserProfile] = React.useState({});

  const dispatch = useDispatch();


  React.useEffect(() => {
    // Get the current user
    const currentUser = dispatch(getCurrentUser());
    setUserProfile(currentUser);
  }, [dispatch]);

  console.log(userProfile);

  React.useEffect(() => {
    dispatch(getAlarms(20));
    dispatch(getSysEvents(20));
    dispatch(getAllDWM(20));
  }, [dispatch]);

  const alarmsData  = useSelector(state => state.alienAlarms);
  const eventsData  = useSelector(state => state.alienEvents);
  const dwmData     = useSelector(state => state.alienDWM);


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
            <OverView />
            {/* Threats Pie Chart */}
            <SocialSource alarms={alarmsData} />
          </Row>

          <Row>
            {/* Order Stats */}
            <OrderStatus />
            {/* Notifications */}
            <Notifications />
          </Row>

          {/* Latest Transaction Table */}
          <TrainingList />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Dashboard);

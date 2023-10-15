import React from "react";
import UsePanel from "./UserPanel";
import OrderStatus from "./OrderStatus";
import Notifications from "./Notifications";
import SocialSource from "./SocialSource";
import OverView from "./OverView";
import RevenueByLocation from "./RevenueByLocation";
import LatestTransation from "./LatestTransation";
import { useDispatch } from "react-redux";

import { Row, Container } from "reactstrap";

// import api functions
import { getCurrentUser } from "../../store/actions";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const Dashboard = () => {
  document.title = "Dashboard | CYPROTECK - Security Solutions Dashboard";

  const [userProfile, setUserProfile] = React.useState({});

  const dispatch = useDispatch();


  React.useEffect(() => {
    // Get the current user
    const currentUser = dispatch(getCurrentUser());
    console.log("Getting the current user in dashboard");
    setUserProfile(currentUser);
    console.log(userProfile);
  }, []);
    
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="CYPROTECK" breadcrumbItem="Dashboard" />
          {/* User Panel Charts */}
          <UsePanel />

          <Row>
            {/* Overview Chart */}
            <OverView />
            {/* Social Source Chart */}
            <SocialSource />
          </Row>

          <Row>
            {/* Order Stats */}
            <OrderStatus />
            {/* Notifications */}
            <Notifications />
          </Row>

          {/* Latest Transaction Table */}
          <LatestTransation />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;

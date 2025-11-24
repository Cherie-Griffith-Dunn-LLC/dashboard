import React, { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Progress,
  Table,
  Badge,
  Button,
} from "reactstrap";

const Dashboard = () => {
  // Set the page title
  useEffect(() => {
    document.title = "Dashboard | CYPROTECK - Security Solutions";
  }, []);

  // Static sample values – wire to real data later
  const vulnerabilityScore = 72;
  const threatAttempts = 15;
  const trainingCompletion = 80;

  const employees = [
    { name: "Claire Holt", risk: "High", training: "Completed" },
    { name: "Juan Wong", risk: "Low", training: "Completed" },
    { name: "Olivia Carter", risk: "Medium", training: "In Progress" },
    { name: "Casey Abbott", risk: "Medium", training: "Not Started" },
    { name: "Peter Shin", risk: "Medium", training: "In Progress" },
  ];

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case "High":
        return "danger";
      case "Low":
        return "success";
      case "Medium":
      default:
        return "warning";
    }
  };

  const getTrainingBadgeColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "In Progress":
        return "info";
      case "Not Started":
      default:
        return "secondary";
    }
  };

  return (
    <div className="page-content">
      {/* Top header */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-1">Welcome back, Security Leader</h4>
          <p className="text-muted mb-0">
            Here’s a quick view of your organization’s security posture today.
          </p>
        </Col>
        <Col className="text-end" md="3">
          <Button color="primary">Switch Tenant</Button>
        </Col>
      </Row>

      {/* KPI cards */}
      <Row>
        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5" className="mb-3">
                Vulnerability Score
              </CardTitle>
              <h2 className="fw-bold mb-1">{vulnerabilityScore}</h2>
              <p className="text-muted mb-0">
                Overall security risk index across your tenants.
              </p>
            </CardBody>
          </Card>
        </Col>

        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5" className="mb-3">
                Threat Attempts
              </CardTitle>
              <h2 className="fw-bold mb-1">{threatAttempts}</h2>
              <p className="text-muted mb-0">
                Blocked in the last 30 days (Defender + Sentinel).
              </p>
            </CardBody>
          </Card>
        </Col>

        <Col md="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5" className="mb-3">
                Training Completion
              </CardTitle>
              <div className="d-flex align-items-center">
                <div style={{ flex: 1, marginRight: 16 }}>
                  <Progress
                    value={trainingCompletion}
                    color="success"
                    className="progress-md"
                  />
                </div>
                <div>
                  <h2 className="fw-bold mb-0">{trainingCompletion}%</h2>
                  <p className="text-muted mb-0">Employees completed</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Employees / risk table + training summary */}
      <Row className="mt-4">
        <Col lg="8">
          <Card>
            <CardBody>
              <CardTitle tag="h5" className="mb-3">
                Employees
              </CardTitle>
              <Table responsive className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Risk Level</th>
                    <th>Training Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.name}>
                      <td>{emp.name}</td>
                      <td>
                        <Badge color={getRiskBadgeColor(emp.risk)}>
                          {emp.risk}
                        </Badge>
                      </td>
                      <td>
                        <Badge color={getTrainingBadgeColor(emp.training)}>
                          {emp.training}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>

        <Col lg="4">
          <Card>
            <CardBody>
              <CardTitle tag="h5" className="mb-3">
                Training & Awareness
              </CardTitle>
              <p className="text-muted">
                Keep your team ahead of emerging threats with ongoing training,
                phishing simulations, and just-in-time micro-learning.
              </p>
              <ul className="list-unstyled mb-3">
                <li className="mb-1">• Security awareness campaigns</li>
                <li className="mb-1">• Phishing simulations</li>
                <li className="mb-1">• Role-based training paths</li>
              </ul>
              <Button color="primary" block>
                View Courses
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Bottom cards */}
      <Row className="mt-4">
        <Col md="6">
          <Card>
            <CardBody>
              <CardTitle tag="h5" className="mb-2">
                Device Security
              </CardTitle>
              <p className="text-muted mb-3">
                Ensure endpoints across all tenants are protected and compliant.
              </p>
              <Button color="secondary" size="sm">
                View Devices
              </Button>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
          <Card>
            <CardBody>
              <CardTitle tag="h5" className="mb-2">
                Mobile Security
              </CardTitle>
              <p className="text-muted mb-3">
                Extend protection to employee mobiles with policy-based access.
              </p>
              <Button color="primary" size="sm">
                Download Mobile App
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;

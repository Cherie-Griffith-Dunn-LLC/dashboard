import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

//Import images
import att from '../../../assets/images/brands/att.png'
import aws from '../../../assets/images/brands/aws-partner.png'
import comcast from '../../../assets/images/brands/comcast.png'
import dell from '../../../assets/images/brands/dell.jpg'
import lenovo from '../../../assets/images/brands/lenovo.png'
import microsoft from '../../../assets/images/brands/microsoft.jpg'
import verizon from '../../../assets/images/brands/verizon.jpg'

//i18n
import { withTranslation } from "react-i18next";

const AppsDropdown = () => {
const [singlebtn, setSinglebtn] = useState(false);

  return(
    <React.Fragment>
        <Dropdown
          isOpen={singlebtn}
          toggle={() => setSinglebtn(!singlebtn)}
          className="dropdown d-inline-block ms-1"
          tag="li"
        >
          <DropdownToggle
            className="btn header-item noti-icon waves-effect"
            tag="button"
            id="page-header-notifications-dropdown"
          >
            <i className="ri-apps-2-line"></i>

          </DropdownToggle>

          <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end">

            <div className="px-lg-2">
              <SimpleBar >


                <Row className="g-0">
                  <Col>
                    <Link className="dropdown-icon-item" to="#">
                      <img src={att} alt="AT&T" />
                      <span>AT&T</span>
                    </Link>
                  </Col>
                  <Col>
                    <Link className="dropdown-icon-item" to="#">
                      <img src={aws} alt="AWS" />
                      <span>AWS</span>
                    </Link>
                  </Col>
                  <Col>
                    <Link className="dropdown-icon-item" to="#">
                      <img src={comcast} alt="Comcast Business" />
                      <span>Comcast Business</span>
                    </Link>
                  </Col>
                </Row>
                <Row className="g-0">
                  <Col>
                    <Link className="dropdown-icon-item" to="#">
                      <img src={dell} alt="Dell" />
                      <span>Dell</span>
                    </Link>
                  </Col>
                  <Col>
                    <Link className="dropdown-icon-item" to="#">
                      <img src={lenovo} alt="Lenovo" />
                      <span>Lenovo</span>
                    </Link>
                  </Col>
                  <Col>
                    <Link className="dropdown-icon-item" to="#">
                      <img src={microsoft} alt="Microsoft" />
                      <span>Microsoft</span>
                    </Link>
                  </Col>
                </Row>
                <Row className="g-0">
                  <Col>
                    <Link className="dropdown-icon-item" to="#">
                      <img src={verizon} alt="Verizon" />
                      <span>Verizon</span>
                    </Link>
                  </Col>
                </Row>
              </SimpleBar>
            </div>
          </DropdownMenu>
        </Dropdown>
      </React.Fragment>
  )
}

export default withTranslation()(AppsDropdown);
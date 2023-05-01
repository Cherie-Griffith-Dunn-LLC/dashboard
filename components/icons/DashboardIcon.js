import * as React from "react";
const SvgDashboardIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={'100%'}
    height={'100%'}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || '#809FB8'}
      d="M12 20a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7Zm1-2h5v-5h-5v5ZM1 20a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H1Zm1-2h5v-5H2v5Zm10-9a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-7Zm1-2h5V2h-5v5ZM1 9a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H1Zm1-2h5V2H2v5Z"
    />
  </svg>
);
export default SvgDashboardIcon;

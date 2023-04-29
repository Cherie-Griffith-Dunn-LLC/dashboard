import * as React from "react";
const SvgBellIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={'100'}
    height={'95%'}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || '#809FB8'}
      d="M17.3 13V8A6.082 6.082 0 0 0 5.138 8v5a3.941 3.941 0 0 1-.542 2h13.247a3.94 3.94 0 0 1-.543-2Zm4.054 4H1.084a1 1 0 0 1 0-2 2.014 2.014 0 0 0 2.027-2V8a8.109 8.109 0 0 1 16.216 0v5a2.014 2.014 0 0 0 2.027 2 1 1 0 1 1 0 2Zm-7.505 3.5a3.061 3.061 0 0 1-5.26 0 1 1 0 0 1 .877-1.5h3.507a1 1 0 0 1 .876 1.5Z"
    />
  </svg>
);
export default SvgBellIcon;

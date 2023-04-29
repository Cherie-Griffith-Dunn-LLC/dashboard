import * as React from "react";
const SvgAlarmIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={'100%'}
    height={'100%'}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || '#809FB8'}
      d="M0 11a11 11 0 1 1 22 0 11 11 0 0 1-22 0Zm2 0a9 9 0 1 0 18 0 9 9 0 0 0-18 0Zm8 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm0-4V7a1 1 0 0 1 2 0v4a1 1 0 0 1-2 0Z"
    />
  </svg>
);
export default SvgAlarmIcon;

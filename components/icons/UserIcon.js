import * as React from "react";
const SvgUserIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={'100%'}
    height={'100%'}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || '#809FB8'}
      d="M16 19v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2a1 1 0 1 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2a1 1 0 1 1-2 0ZM4 5a5 5 0 1 1 10 0A5 5 0 0 1 4 5Zm2 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"
    />
  </svg>
);
export default SvgUserIcon;

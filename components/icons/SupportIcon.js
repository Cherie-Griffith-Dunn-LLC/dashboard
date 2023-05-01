import * as React from "react";
const SvgSupportIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={'100%'}
    height={'83%'}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || '#809FB8'}
      d="M22 19v-2a3 3 0 0 0-2.25-2.9 1 1 0 1 1 .5-1.937A5 5 0 0 1 24 17v2a1 1 0 1 1-2 0Zm-6 0v-2a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v2a1 1 0 1 1-2 0v-2a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v2a1 1 0 1 1-2 0ZM4 5a5 5 0 1 1 10 0A5 5 0 0 1 4 5Zm2 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm9.031 4.127a1 1 0 0 1 .721-1.216 3 3 0 0 0 0-5.813 1 1 0 0 1 .5-1.938 5 5 0 0 1 0 9.688 1 1 0 0 1-1.217-.721h-.004Z"
    />
  </svg>
);
export default SvgSupportIcon;

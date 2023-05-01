import * as React from "react";
const SvgEventsIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={'100%'}
    height={'84%'}
    fill="none"
    {...props}
  >
    <path
      fill={props.fill || '#809FB8'}
      d="M3 21a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h19a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H3Zm19-2a1 1 0 0 0 1-1v-6.2h-3.28L17.272 19H22ZM2 3v15a1 1 0 0 0 1 1h11.727L10 5.1l-2.051 6.029a1 1 0 0 1-.949.67H3A.98.98 0 1 1 3 9.84h3.279L8.948 2H3a1 1 0 0 0-1 1Zm14 13.542 2.051-6.029a1 1 0 0 1 .949-.67h4V3a1 1 0 0 0-1-1H11.052L16 16.542Z"
    />
  </svg>
);
export default SvgEventsIcon;

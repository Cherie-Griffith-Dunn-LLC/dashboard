import React from "react";
import { useParams } from "react-router-dom";

const OAuth = () => {
  const { tenantId } = useParams();

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>OAuth Callback</h2>
      <p>Tenant ID detected:</p>
      <pre>{tenantId}</pre>
      <p>If you can see this, routing is working and the component is rendering.</p>
    </div>
  );
};

export default OAuth;

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const { tenantId } = useParams();

  useEffect(() => {
    // Optional: store tenant ID for multi-tenant context
    if (tenantId) {
      localStorage.setItem("currentTenantId", tenantId);
    }

    // After OAuth completes, go straight to dashboard
    navigate("/dashboard", { replace: true });
  }, [tenantId, navigate]);

  return (
    <div className="page-content d-flex justify-content-center align-items-center">
      <p>Signing you in… redirecting to your dashboard.</p>
    </div>
  );
};

export default OAuth;

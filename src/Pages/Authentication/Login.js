import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const { tenantId } = useParams();

  useEffect(() => {
    // Optionally store the tenant ID for later (multi-tenant handling)
    if (tenantId) {
      localStorage.setItem("currentTenantId", tenantId);
    }

    // After handling tenant, redirect to dashboard
    navigate("/dashboard", { replace: true });
  }, [tenantId, navigate]);

  return (
    <div className="page-content d-flex justify-content-center align-items-center">
      <p>Signing you in… redirecting to your dashboard.</p>
    </div>
  );
};

export default OAuth;

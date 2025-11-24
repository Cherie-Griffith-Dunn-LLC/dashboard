import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function OAuth() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function finishLogin() {
      try {
        // Call your backend to exchange the AAD auth code for a JWT and user info.
        // Adjust this path to match your API (e.g. `${process.env.REACT_APP_BACKEND_URL}/auth/callback`).
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/auth/callback?tenantId=${tenantId}`,
          { credentials: "include" }
        );

        if (!response.ok) throw new Error(`Auth failed: ${response.status}`);
        const data = await response.json();

        // Save token and expiry – adjust property names to match your backend
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("expireTime", data.expires);
        localStorage.setItem("authUser", JSON.stringify(data.user));
        // optional: save tenantId for multi‑tenant context
        if (tenantId) localStorage.setItem("currentTenantId", tenantId);

        navigate("/dashboard", { replace: true });
      } catch (ex) {
        console.error(ex);
        setError("We couldn’t sign you in. Please try again.");
      }
    }

    finishLogin();
  }, [tenantId, navigate]);

  if (error) {
    return (
      <div className="page-content d-flex justify-content-center align-items-center">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate("/login", { replace: true })}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="page-content d-flex justify-content-center align-items-center">
      <p>Signing you in… redirecting to your dashboard.</p>
    </div>
  );
}

      

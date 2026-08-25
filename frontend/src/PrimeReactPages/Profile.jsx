import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router-dom";
import api from "../API";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await api.get("/me/");
      setUserData(res.data);
    } catch (e) {
      console.error("Authentication failed or session expired", e);
      navigate("/login/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Compute initials for the avatar
  const getInitials = () => {
    if (!userData) return "U";
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase();
    }
    if (userData.first_name) {
      return userData.first_name.substring(0, 2).toUpperCase();
    }
    if (userData.username) {
      return userData.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const displayName =
    userData?.first_name && userData?.last_name
      ? `${userData.first_name} ${userData.last_name}`
      : userData?.first_name || userData?.username || "Account User";

  return (
    <div
      style={{
        padding: "0.75rem 1.5rem 2.5rem",
        backgroundColor: "#f8fafc",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <style>{`
        .p-card .p-card-body {
          padding: 1.25rem !important;
        }
        .p-card .p-card-content {
          padding: 0 !important;
        }
      `}</style>

      {/* Centered Content Container */}
      <div style={{ width: "100%", maxWidth: "800px", marginTop: "0.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "1.25rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            User Profile
          </h1>
          <p style={{ margin: "0.2rem 0 0", color: "#64748b", fontSize: "0.875rem" }}>
            View and manage your account credentials and system privileges.
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
            <ProgressSpinner style={{ width: "36px", height: "36px" }} />
          </div>
        ) : !userData ? (
          <Card style={{ textAlign: "center", padding: "3rem 1.5rem", color: "#64748b", borderRadius: "12px" }}>
            <i className="pi pi-user-minus" style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#94a3b8" }} />
            <p style={{ margin: 0, fontSize: "0.875rem" }}>Unable to load user profile.</p>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Main Hero Card */}
            <Card
              style={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  flexWrap: "wrap",
                }}
              >
                {/* Avatar Box */}
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "12px",
                    backgroundColor: "#0f172a",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "1.35rem",
                    flexShrink: 0,
                    boxShadow: "0 2px 4px rgba(15,23,42,0.15)",
                  }}
                >
                  {getInitials()}
                </div>

                {/* Title & Role Info */}
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: "700", color: "#0f172a" }}>
                      {displayName}
                    </h2>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: "700",
                        padding: "0.15rem 0.5rem",
                        borderRadius: "4px",
                        backgroundColor: "#f1f5f9",
                        color: "#0f172a",
                        border: "1px solid #cbd5e1",
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {userData.role || "User"}
                    </span>
                  </div>

                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.825rem", color: "#64748b" }}>
                    {userData.email || "No email linked"}
                  </p>
                </div>

                {/* ID Tag */}
                <div
                  style={{
                    backgroundColor: "#f8fafc",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.775rem",
                    color: "#475569",
                    fontWeight: "500",
                  }}
                >
                  System ID: <strong style={{ color: "#0f172a" }}>#{userData.userId || userData.id || "N/A"}</strong>
                </div>
              </div>
            </Card>

            {/* Detailed Account Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "1rem",
              }}
            >
              {/* Account Info Box */}
              <Card
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                  backgroundColor: "#ffffff",
                }}
              >
                <h3 style={{ margin: "0 0 0.85rem 0", fontSize: "0.875rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Account Information
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.825rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>First Name:</span>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>
                      {userData.first_name || "—"}
                    </span>
                  </div>

                  <div style={{ borderTop: "1px solid #f1f5f9" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Email Address:</span>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>
                      {userData.email || "—"}
                    </span>
                  </div>

                  <div style={{ borderTop: "1px solid #f1f5f9" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Username:</span>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>
                      {userData.username || "—"}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Access & Security Box */}
              <Card
                style={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                  backgroundColor: "#ffffff",
                }}
              >
                <h3 style={{ margin: "0 0 0.85rem 0", fontSize: "0.875rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Permissions & Security
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.825rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Assigned Role:</span>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>
                      {userData.role || "Standard User"}
                    </span>
                  </div>

                  <div style={{ borderTop: "1px solid #f1f5f9" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>Account Status:</span>
                    <span
                      style={{
                        fontWeight: "600",
                        color: "#166534",
                        backgroundColor: "#f0fdf4",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                        border: "1px solid #dcfce7",
                        fontSize: "0.75rem",
                      }}
                    >
                      Active
                    </span>
                  </div>

                  <div style={{ borderTop: "1px solid #f1f5f9" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748b" }}>User ID:</span>
                    <span style={{ fontWeight: "600", color: "#0f172a" }}>
                      #{userData.userId || userData.id || "N/A"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
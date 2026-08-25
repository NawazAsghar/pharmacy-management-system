import React, { useEffect, useState, useMemo } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router-dom";
import api from "../API";

export default function Pharmacist() {
  const [pharmacists, setPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const getPharmacists = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pharmacist_viewset/");
      setPharmacists(res.data || []);
    } catch (e) {
      console.error("Failed to fetch pharmacists", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPharmacists();
  }, []);

  const handleAddPharmacist = () => {
    navigate("/signup/");
  };

  const filteredPharmacists = useMemo(() => {
    if (!searchQuery.trim()) return pharmacists;
    const q = searchQuery.toLowerCase().trim();

    return pharmacists.filter((p) => {
      const name = `${p.first_name || ""} ${p.last_name || ""}`.trim() || p.username || "";
      const email = p.email || "";
      const phone = p.phone || p.phone_number || "";

      return (
        name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        phone.toLowerCase().includes(q)
      );
    });
  }, [pharmacists, searchQuery]);

  const getInitials = (person) => {
    if (person.first_name && person.last_name) {
      return `${person.first_name[0]}${person.last_name[0]}`.toUpperCase();
    }
    const name = person.first_name || person.username || person.name || "P";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ padding: "1.25rem 1.5rem", backgroundColor: "#f8fafc", minHeight: "80vh" }}>
      <style>{`
        .p-card .p-card-body {
          padding: 1rem !important;
        }
        .p-card .p-card-content {
          padding: 0 !important;
        }
        .add-btn:hover {
          background-color: #1e293b !important;
        }
      `}</style>

      {/* Header & Right-Aligned Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.25rem",
          width: "100%",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.35rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Pharmacist Directory
          </h1>
          <p style={{ margin: "0.2rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
            Manage registered pharmacy staff, system privileges, and staff contact records.
          </p>
        </div>

        <button
          className="add-btn"
          onClick={handleAddPharmacist}
          style={{
            marginLeft: "auto",
            backgroundColor: "#0f172a",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "0.55rem 1rem",
            fontSize: "0.825rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            whiteSpace: "nowrap",
            transition: "background-color 0.15s ease",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <i className="pi pi-user-plus" style={{ fontSize: "0.85rem" }} />
          Add Pharmacist
        </button>
      </div>

      {/* Metric Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.85rem",
          marginBottom: "1.25rem",
        }}
      >
        <Card style={{ borderLeft: "3px solid #64748b", borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
          <div style={{ color: "#64748b", fontSize: "0.725rem", fontWeight: "600", textTransform: "uppercase" }}>
            Total Staff
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a", marginTop: "0.2rem" }}>
            {pharmacists.length}
          </div>
        </Card>

        <Card style={{ borderLeft: "3px solid #16a34a", borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
          <div style={{ color: "#64748b", fontSize: "0.725rem", fontWeight: "600", textTransform: "uppercase" }}>
            Active Pharmacists
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a", marginTop: "0.2rem" }}>
            {pharmacists.length}{" "}
            <span style={{ fontSize: "0.8rem", fontWeight: "500", color: "#64748b" }}>registered</span>
          </div>
        </Card>
      </div>

      {/* Search Bar Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <span className="p-input-icon-left" style={{ width: "100%", maxWidth: "340px" }}>
          <i className="pi pi-search" style={{ color: "#94a3b8" }} />
          <InputText
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or username..."
            style={{
              width: "100%",
              borderRadius: "6px",
              padding: "0.4rem 0.4rem 0.4rem 2.2rem",
              fontSize: "0.85rem",
              borderColor: "#cbd5e1",
            }}
          />
        </span>
        <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
          Showing <strong>{filteredPharmacists.length}</strong> of <strong>{pharmacists.length}</strong> staff
        </span>
      </div>

      {/* Grid Content Area */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <ProgressSpinner style={{ width: "36px", height: "36px" }} />
        </div>
      ) : filteredPharmacists.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "3rem 1.5rem", color: "#64748b", borderRadius: "8px" }}>
          <i className="pi pi-users" style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#94a3b8" }} />
          <p style={{ margin: 0, fontSize: "0.875rem" }}>No pharmacists found.</p>
        </Card>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "0.9rem",
          }}
        >
          {filteredPharmacists.map((person) => {
            const fullName =
              `${person.first_name || ""} ${person.last_name || ""}`.trim() ||
              person.username ||
              "Pharmacist";

            return (
              <Card
                key={person.id}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  backgroundColor: "#ffffff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "8px",
                      backgroundColor: "#0f172a",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justify: "center",
                      fontWeight: "700",
                      fontSize: "0.9rem",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(person)}
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: "700",
                        color: "#0f172a",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {fullName}
                    </h3>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: "600",
                        color: "#0369a1",
                        backgroundColor: "#f0f9ff",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "4px",
                        border: "1px solid #e0f2fe",
                      }}
                    >
                      {person.role || "Pharmacist"}
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #f1f5f9", margin: "0.5rem 0 0.75rem 0" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
                    <i className="pi pi-envelope" style={{ fontSize: "0.8rem", color: "#94a3b8" }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {person.email || "No email provided"}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
                    <i className="pi pi-user" style={{ fontSize: "0.8rem", color: "#94a3b8" }} />
                    <span>Username: <strong>{person.username || "—"}</strong></span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
                    <i className="pi pi-id-card" style={{ fontSize: "0.8rem", color: "#94a3b8" }} />
                    <span>Staff ID: <strong>#{person.id}</strong></span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
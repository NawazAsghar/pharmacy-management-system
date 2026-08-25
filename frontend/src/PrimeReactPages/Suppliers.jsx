import React, { useEffect, useState, useMemo } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import api from "../API";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Order History
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [supplierOrders, setSupplierOrders] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const getSuppliers = async () => {
    try {
      setLoading(true);
      const req = await api.get("/suppliers/");
      setSuppliers(req.data || []);
    } catch (e) {
      console.error("Failed to fetch suppliers", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  // Fetch Order History for a specific supplier
  const handleOpenHistory = async (supplier) => {
    setSelectedSupplier(supplier);
    setHistoryModalVisible(true);
    setLoadingHistory(true);

    try {
      // Adjust endpoint if your order history API uses a different path (e.g. /inventory/?supplier=${supplier.id})
      const res = await api.get(`/stockOrder/?supplier=${supplier.id}`);

      // Filter locally in case backend returns all orders
      const filtered = Array.isArray(res.data)
        ? res.data.filter((order) => {
            const suppId = typeof order.supplier === "object" ? order.supplier?.id : order.supplier;
            return String(suppId) === String(supplier.id);
          })
        : [];

      setSupplierOrders(filtered);
    } catch (err) {
      console.error("Failed to fetch supplier order history", err);
      setSupplierOrders([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Dynamic search filter
  const filteredSuppliers = useMemo(() => {
    if (!searchQuery.trim()) return suppliers;
    const q = searchQuery.toLowerCase().trim();

    return suppliers.filter((supplier) => {
      const name =
        supplier.name ||
        supplier.company_name ||
        `${supplier.first_name || ""} ${supplier.last_name || ""}`.trim() ||
        supplier.username ||
        "";
      const email = supplier.email || "";
      const phone = supplier.phone || supplier.phone_number || "";

      return (
        name.toLowerCase().includes(q) ||
        email.toLowerCase().includes(q) ||
        phone.toLowerCase().includes(q)
      );
    });
  }, [suppliers, searchQuery]);

  const getInitials = (supplier) => {
    const name =
      supplier.name ||
      supplier.company_name ||
      supplier.username ||
      supplier.first_name ||
      "S";
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
        .history-btn:hover {
          background-color: #0f172a !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "1.35rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
          Supplier Directory
        </h1>
        <p style={{ margin: "0.2rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
          Manage pharmaceutical vendors, contact records, and order transaction logs.
        </p>
      </div>

      {/* Metric Cards */}
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
            Total Suppliers
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a", marginTop: "0.2rem" }}>
            {suppliers.length}
          </div>
        </Card>

        <Card style={{ borderLeft: "3px solid #475569", borderRadius: "6px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
          <div style={{ color: "#64748b", fontSize: "0.725rem", fontWeight: "600", textTransform: "uppercase" }}>
            Active Accounts
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: "700", color: "#0f172a", marginTop: "0.2rem" }}>
            {suppliers.length}{" "}
            <span style={{ fontSize: "0.8rem", fontWeight: "500", color: "#64748b" }}>registered</span>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          justify: "space-between",
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
            placeholder="Search by supplier or contact..."
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
          Showing <strong>{filteredSuppliers.length}</strong> of <strong>{suppliers.length}</strong> suppliers
        </span>
      </div>

      {/* Grid of Supplier Cards */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <ProgressSpinner style={{ width: "36px", height: "36px" }} />
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "3rem 1.5rem", color: "#64748b", borderRadius: "8px" }}>
          <i className="pi pi-users" style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#94a3b8" }} />
          <p style={{ margin: 0, fontSize: "0.875rem" }}>No suppliers found.</p>
        </Card>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "0.9rem",
          }}
        >
          {filteredSuppliers.map((supplier) => {
            const supplierName =
              supplier.name ||
              supplier.company_name ||
              `${supplier.first_name || ""} ${supplier.last_name || ""}`.trim() ||
              supplier.username ||
              "Supplier";

            return (
              <Card
                key={supplier.id}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  backgroundColor: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  justify: "space-between",
                }}
              >
                <div>
                  {/* Avatar & Header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "6px",
                        backgroundColor: "#0f172a",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justify: "center",
                        fontWeight: "700",
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(supplier)}
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
                        {supplierName}
                      </h3>
                      <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        Supplier ID: #{supplier.id}
                      </span>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #f1f5f9", margin: "0.5rem 0 0.75rem 0" }} />

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
                      <i className="pi pi-envelope" style={{ fontSize: "0.8rem", color: "#94a3b8" }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {supplier.email || "No email provided"}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#334155" }}>
                      <i className="pi pi-phone" style={{ fontSize: "0.8rem", color: "#94a3b8" }} />
                      <span>{supplier.phone || supplier.phone_number || "No phone record"}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="history-btn"
                    onClick={() => handleOpenHistory(supplier)}
                    style={{
                      width: "100%",
                      padding: "0.45rem 0.75rem",
                      backgroundColor: "#f1f5f9",
                      color: "#334155",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      fontSize: "0.775rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <i className="pi pi-history" style={{ fontSize: "0.75rem" }} />
                    Order History
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Order History Dialog Modal */}
      <Dialog
        header={
          selectedSupplier
            ? `Order History - ${
                selectedSupplier.name ||
                selectedSupplier.company_name ||
                selectedSupplier.username ||
                "Supplier"
              }`
            : "Order History"
        }
        visible={historyModalVisible}
        style={{ width: "90vw", maxWidth: "680px" }}
        onHide={() => setHistoryModalVisible(false)}
        draggable={false}
        resizable={false}
      >
        {loadingHistory ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2.5rem" }}>
            <ProgressSpinner style={{ width: "32px", height: "32px" }} />
          </div>
        ) : supplierOrders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 1rem", color: "#64748b" }}>
            <i className="pi pi-folder-open" style={{ fontSize: "2rem", color: "#cbd5e1", marginBottom: "0.5rem" }} />
            <p style={{ margin: 0, fontSize: "0.85rem" }}>No previous orders found for this supplier.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
            {supplierOrders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#ffffff",
                }}
              >
                {/* Order Top Summary */}
                <div
                  style={{
                    display: "flex",
                    justify: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    borderBottom: "1px solid #f1f5f9",
                    paddingBottom: "0.4rem",
                  }}
                >
                  <span style={{ fontWeight: "700", color: "#0f172a", fontSize: "0.85rem" }}>
                    Order #{order.id}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    Date: {order.created_at || "N/A"}
                  </span>
                </div>

                {/* Items in this order */}
                {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                    {order.items.map((it, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          justify: "space-between",
                          fontSize: "0.8rem",
                          color: "#334155",
                        }}
                      >
                        <span>
                          <strong>{typeof it.item === "object" ? it.item.name : it.item}</strong>
                          {it.strength ? ` (${it.strength} mg)` : ""}
                        </span>
                        <span style={{ fontWeight: "600", color: "#0f172a" }}>
                          {it.quantity} units
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontSize: "0.775rem", color: "#94a3b8" }}>No items listed in order batch</span>
                )}
              </div>
            ))}
          </div>
        )}
      </Dialog>
    </div>
  );
}
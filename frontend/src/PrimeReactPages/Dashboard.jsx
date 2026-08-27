import React, { useEffect, useState, useMemo } from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { useNavigate } from "react-router-dom";
import api from "../API";

export default function Dashboard() {
  const [todaySale, setTodaySale] = useState(0);
  const [ExpiryItems, setExpiryItems] = useState([]);
  const [todayOrders, settodayOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // API Call 1: Today's Sales
  const getTodaySale = async () => {
    try {
      const res = await api.get("/todayBills/");
      let data = res.data || [];
      let totalAmount = 0;
      data.forEach((item) => {
        totalAmount += Number(item.totalBill_amount || 0);
      });
      setTodaySale(totalAmount);
    } catch (e) {
      console.error("Failed to fetch sales data", e);
    }
  };

  // API Call 2: Near Expiry Items
  const getItmeWithNearExpiry = async () => {
    try {
      const res = await api.get("/batch/");
      setExpiryItems(res.data || []);
    } catch (e) {
      console.error("Failed to fetch expiry items", e);
    }
  };

  // API Call 3: Today's Stock Orders
  const getTodayOrders = async () => {
    try {
      const res = await api.get("/todayOrders/");
      settodayOrders(res.data || []);
    } catch (e) {
      console.error("Failed to fetch today's orders", e);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await Promise.all([getTodaySale(), getItmeWithNearExpiry(), getTodayOrders()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Formatters
  const formatCurrency = (val) => `RS ${Number(val || 0).toLocaleString()}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Flatten expiring items for calculation
  const expiringCount = useMemo(() => {
    return ExpiryItems.reduce(
      (acc, batch) => acc + (batch.item_set ? batch.item_set.length : 0),
      0
    );
  }, [ExpiryItems]);

  // Shortcut Navigation Menu Items
  const navigationItems = [
    {
      title: "Inventory",
      subtitle: "Manage stock & items",
      icon: "pi pi-box",
      color: "#2563eb",
      bgColor: "#eff6ff",
      route: "/inventory/",
    },
    {
      title: "Counter Bills",
      subtitle: "View POS transactions",
      icon: "pi pi-receipt",
      color: "#059669",
      bgColor: "#ecfdf5",
      route: "/counterBill/",
    },
    {
      title: "Stock Orders",
      subtitle: "Track supplier orders",
      icon: "pi pi-shopping-cart",
      color: "#7c3aed",
      bgColor: "#f5f3ff",
      route: "/orderStockList/",
    },
    {
      title: "Suppliers",
      subtitle: "Vendor directory",
      icon: "pi pi-truck",
      color: "#d97706",
      bgColor: "#fffbeb",
      route: "/suppliers/",
    },
    {
      title: "Pharmacists",
      subtitle: "Staff & user accounts",
      icon: "pi pi-users",
      color: "#0891b2",
      bgColor: "#ecfeff",
      route: "/pharmacists/",
    },
  ];

  return (
    <div style={{ padding: "1.25rem 1.5rem", backgroundColor: "#f8fafc", minHeight: "80vh" }}>
      {/* PrimeReact Style Tightening Overrides */}
      <style>{`
        .p-card .p-card-body {
          padding: 0.85rem !important;
        }
        .p-card .p-card-content {
          padding: 0 !important;
        }
      `}</style>

      {/* Top Header Bar */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
          Pharmacy Dashboard Overview
        </h1>
        <p style={{ margin: "0.2rem 0 0", color: "#64748b", fontSize: "0.875rem" }}>
          Real-time daily metrics, inventory warnings, and quick management links.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Daily Sales Card */}
        <Card
          style={{
            borderLeft: "4px solid #10b981",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase" }}>
                Today's Revenue
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginTop: "0.25rem" }}>
                {formatCurrency(todaySale)}
              </div>
            </div>
            <div style={{ padding: "0.6rem", borderRadius: "50%", backgroundColor: "#ecfdf5", color: "#10b981" }}>
              <i className="pi pi-wallet" style={{ fontSize: "1.25rem" }} />
            </div>
          </div>
        </Card>

        {/* Expiring Items Alert Card */}
        <Card
          style={{
            borderLeft: "4px solid #ef4444",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase" }}>
                Near Expiry Items
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginTop: "0.25rem" }}>
                {expiringCount} <span style={{ fontSize: "0.85rem", fontWeight: "500", color: "#ef4444" }}>Items</span>
              </div>
            </div>
            <div style={{ padding: "0.6rem", borderRadius: "50%", backgroundColor: "#fef2f2", color: "#ef4444" }}>
              <i className="pi pi-exclamation-triangle" style={{ fontSize: "1.25rem" }} />
            </div>
          </div>
        </Card>

        {/* Today's Stock Orders Card */}
        <Card
          style={{
            borderLeft: "4px solid #6366f1",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase" }}>
                Today's Orders
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#0f172a", marginTop: "0.25rem" }}>
                {todayOrders.length} <span style={{ fontSize: "0.85rem", fontWeight: "500", color: "#6366f1" }}>Orders</span>
              </div>
            </div>
            <div style={{ padding: "0.6rem", borderRadius: "50%", backgroundColor: "#f5f3ff", color: "#6366f1" }}>
              <i className="pi pi-truck" style={{ fontSize: "1.25rem" }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Navigation Action Grid */}
      <h3 style={{ fontSize: "1.05rem", fontWeight: "700", color: "#334155", marginBottom: "0.75rem" }}>
        System Navigation
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
          gap: "0.85rem",
          marginBottom: "1.5rem",
        }}
      >
        {navigationItems.map((item, idx) => (
          <Card
            key={idx}
            onClick={() => navigate(item.route)}
            style={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            className="hover:shadow-md"
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  padding: "0.5rem",
                  borderRadius: "8px",
                  backgroundColor: item.bgColor,
                  color: item.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <i className={item.icon} style={{ fontSize: "1.1rem" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.title}
                </div>
                <div style={{ fontSize: "0.725rem", color: "#64748b" }}>{item.subtitle}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Layout (2 Columns) */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <ProgressSpinner style={{ width: "40px", height: "40px" }} />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {/* Panel 1: Near Expiry Items Watchlist */}
          <Card
            style={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <i className="pi pi-exclamation-circle" style={{ color: "#ef4444", fontSize: "1.1rem" }} />
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f172a" }}>Expiring Items</h3>
              </div>
              <Badge value={expiringCount} severity="danger" />
            </div>

            <Divider style={{ margin: "0.5rem 0 0.85rem" }} />

            {expiringCount === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#64748b", fontSize: "0.875rem" }}>
                <i className="pi pi-check-circle" style={{ fontSize: "1.8rem", color: "#10b981", marginBottom: "0.5rem" }} />
                <p style={{ margin: 0 }}>No items near expiration date.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "360px", overflowY: "auto", paddingRight: "0.25rem" }}>
                {ExpiryItems.map((batch, bIdx) =>
                  batch.item_set?.map((item) => (
                    <div
                      key={item.id || `${bIdx}-${item.name}`}
                      style={{
                        display: "flex",
                        justify: "space-between",
                        alignItems: "center",
                        padding: "0.55rem 0.75rem",
                        backgroundColor: "#fef2f2",
                        borderRadius: "6px",
                        border: "1px solid #fee2e2",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "0.85rem", color: "#991b1b" }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: "0.725rem", color: "#b91c1c", marginTop: "0.1rem" }}>
                          Batch ID: {batch.id || "N/A"}
                        </div>
                      </div>
                      <Tag severity="danger" value={`Expires: ${formatDate(batch.expiry_date)}`} rounded style={{ fontSize: "0.7rem" }} />
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>

          {/* Panel 2: Today's Orders Activity */}
          <Card
            style={{
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <i className="pi pi-shopping-bag" style={{ color: "#2563eb", fontSize: "1.1rem" }} />
                <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f172a" }}>Today's Stock Orders</h3>
              </div>
              <Badge value={todayOrders.length} severity="info" />
            </div>

            <Divider style={{ margin: "0.5rem 0 0.85rem" }} />

            {todayOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "#64748b", fontSize: "0.875rem" }}>
                <i className="pi pi-inbox" style={{ fontSize: "1.8rem", color: "#cbd5e1", marginBottom: "0.5rem" }} />
                <p style={{ margin: 0 }}>No orders placed today.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "360px", overflowY: "auto", paddingRight: "0.25rem" }}>
                {todayOrders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      border: "1px solid #f1f5f9",
                      backgroundColor: "#f8fafc",
                      borderRadius: "6px",
                      padding: "0.65rem 0.85rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <span style={{ fontWeight: "700", fontSize: "0.85rem", color: "#0f172a" }}>
                        Order #{order.id}
                      </span>
                      <Tag
                        severity="info"
                        value={order.supplier?.username || order.supplier || "Supplier"}
                        icon="pi pi-truck"
                        style={{ fontSize: "0.7rem", padding: "0.15rem 0.45rem" }}
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                      {order.items?.map((item, iIdx) => (
                        <div
                          key={item.id || iIdx}
                          style={{
                            display: "flex",
                            justify: "space-between",
                            fontSize: "0.775rem",
                            color: "#475569",
                            backgroundColor: "#ffffff",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "4px",
                            border: "1px solid #f1f5f9",
                          }}
                        >
                          <span>{item.item || "Item"}</span>
                          <span style={{ fontWeight: "600", color: "#0f172a" }}>
                            Qty: {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState, useMemo } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { ProgressSpinner } from "primereact/progressspinner";
import api from "../API";
import { useNavigate } from "react-router-dom";

export default function TotalBills() {
  const navigate = useNavigate();
  const [totalBills, setTotalBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const getAllBills = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bill/");
      setTotalBills(res.data || []);
    } catch (e) {
      console.error("Failed to fetch bills", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBills();
  }, []);

  // Formatters
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (val) => {
    return `RS ${Number(val || 0).toLocaleString()}`;
  };

  const getPharmacistUsername = (pharmacist) => {
    if (!pharmacist) return "N/A";
    if (typeof pharmacist === "string") return pharmacist;
    return pharmacist.username || "N/A";
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalRevenue = totalBills.reduce(
      (acc, b) => acc + (Number(b.totalBill_amount) || 0),
      0
    );
    const totalCount = totalBills.length;
    const avgBill = totalCount ? totalRevenue / totalCount : 0;
    return { totalRevenue, totalCount, avgBill };
  }, [totalBills]);

  // Filtered bills
  const filteredBills = useMemo(() => {
    if (!searchQuery.trim()) return totalBills;
    const q = searchQuery.toLowerCase().trim();
    return totalBills.filter((bill) => {
      const username = getPharmacistUsername(bill.pharmacist_name).toLowerCase();
      const billId = String(bill.id || "");
      return username.includes(q) || billId.includes(q);
    });
  }, [totalBills, searchQuery]);

  const handleOpenReceipt = (e, bill) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setSelectedBill(bill);
    setIsReceiptOpen(true);
  };

  return (
    <div style={{ padding: "1.25rem 1.5rem", backgroundColor: "#f8fafc", minHeight: "80vh" }}>
      {/* CSS Overrides for Compact Card & Modal Padding */}
      <style>{`
        /* Tighten PrimeReact Card default padding */
        .p-card .p-card-body {
          padding: 0.85rem !important;
        }
        .p-card .p-card-content {
          padding: 0 !important;
        }

        /* Modal Overlay & Compact Container */
        .p-dialog-mask {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background-color: rgba(15, 23, 42, 0.6) !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          z-index: 9999 !important;
          backdrop-filter: blur(4px);
        }

        .p-dialog {
          background: #ffffff !important;
          border-radius: 12px !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          max-height: 90vh !important;
          overflow-y: auto !important;
          border: 1px solid #e2e8f0 !important;
          padding: 1rem !important;
        }

        .p-dialog-header {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding-bottom: 0.5rem !important;
          border-bottom: 1px solid #f1f5f9 !important;
          margin-bottom: 0.75rem !important;
        }

        .p-dialog-header .p-dialog-title {
          font-weight: 700 !important;
          color: #0f172a !important;
          font-size: 1.05rem !important;
        }

        .p-dialog-header-icon {
          background: #f1f5f9 !important;
          border: none !important;
          border-radius: 50% !important;
          width: 28px !important;
          height: 28px !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        /* Print Styles */
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-receipt, .printable-receipt * {
            visibility: visible;
          }
          .printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .p-dialog-header, .p-dialog-footer, .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Header Bar */}
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Pharmacy Sales & Invoices
          </h1>
          <p style={{ margin: "0.2rem 0 0", color: "#64748b", fontSize: "0.875rem" }}>
            Monitor transactions, pharmacist logs, and line-item details.
          </p>
        </div>

        {/* Buttons group */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Button
            label="Create Counter Bill"
            icon="pi pi-plus"
            onClick={() => navigate('/counterBill/')}
            style={{ borderRadius: "6px", padding: "0.45rem 0.85rem", fontSize: "0.85rem", backgroundColor: "#2563eb", borderColor: "#2563eb", color: "#ffffff" }}
          />
          <Button
            label="Refresh Data"
            icon="pi pi-refresh"
            className="p-button-outlined p-button-secondary"
            onClick={getAllBills}
            loading={loading}
            style={{ borderRadius: "6px", padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* KPI Stats Widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <Card style={{ borderLeft: "4px solid #3b82f6", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderRadius: "8px" }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Total Revenue
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f172a", marginTop: "0.25rem" }}>
              {formatCurrency(metrics.totalRevenue)}
            </div>
          </div>
        </Card>

        <Card style={{ borderLeft: "4px solid #10b981", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderRadius: "8px" }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Total Bills Issued
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f172a", marginTop: "0.25rem" }}>
              {metrics.totalCount}
            </div>
          </div>
        </Card>

        <Card style={{ borderLeft: "4px solid #6366f1", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", borderRadius: "8px" }}>
          <div>
            <div style={{ color: "#64748b", fontSize: "0.75rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Average Ticket Size
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "#0f172a", marginTop: "0.25rem" }}>
              {formatCurrency(metrics.avgBill)}
            </div>
          </div>
        </Card>
      </div>

      {/* Search Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <span className="p-input-icon-left" style={{ width: "100%", maxWidth: "340px" }}>
          <i className="pi pi-search" style={{ color: "#94a3b8" }} />
          <InputText
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Pharmacist or Bill ID..."
            style={{ width: "100%", borderRadius: "6px", paddingLeft: "2.3rem", padding: "0.45rem 0.45rem 0.45rem 2.3rem", fontSize: "0.875rem" }}
          />
        </span>
        <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
          Showing <strong>{filteredBills.length}</strong> of <strong>{totalBills.length}</strong> bills
        </span>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <ProgressSpinner style={{ width: "40px", height: "40px" }} />
        </div>
      ) : filteredBills.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "3rem 1.5rem", color: "#64748b", borderRadius: "8px" }}>
          <i className="pi pi-inbox" style={{ fontSize: "2.5rem", marginBottom: "0.75rem", color: "#cbd5e1" }} />
          <h3 style={{ color: "#334155", margin: 0, fontSize: "1.1rem" }}>No matching bills found</h3>
          <p style={{ fontSize: "0.875rem", margin: "0.25rem 0 0" }}>Try searching for a different pharmacist username or bill ID.</p>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1rem" }}>
          {filteredBills.map((bill) => (
            <Card
              key={bill.id}
              style={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.5px" }}>
                      Invoice
                    </span>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>#{bill.id}</h3>
                  </div>
                  <Tag severity="success" value="Paid" rounded style={{ padding: "0.15rem 0.5rem", fontSize: "0.75rem" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", fontSize: "0.825rem", color: "#475569", marginBottom: "0.6rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <i className="pi pi-calendar" style={{ color: "#94a3b8", fontSize: "0.85rem" }} />
                    <span>{formatDate(bill.created_at)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Avatar icon="pi pi-user" size="small" shape="circle" style={{ backgroundColor: "#e2e8f0", color: "#475569", width: "20px", height: "20px", fontSize: "0.7rem" }} />
                    <span>Pharmacist: <strong style={{ color: "#0f172a" }}>{getPharmacistUsername(bill.pharmacist_name)}</strong></span>
                  </div>
                </div>

                <Divider style={{ margin: "0.5rem 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    Items: <Badge value={bill.items?.length || 0} severity="info" style={{ fontSize: "0.7rem", height: "1.2rem", minWidth: "1.2rem", lineHeight: "1.2rem" }} />
                  </span>
                  <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#16a34a" }}>
                    {formatCurrency(bill.totalBill_amount)}
                  </span>
                </div>

                <Button
                  label="View Detailed Receipt"
                  icon="pi pi-receipt"
                  style={{
                    width: "100%",
                    borderRadius: "6px",
                    padding: "0.5rem",
                    backgroundColor: "#2563eb",
                    borderColor: "#2563eb",
                    color: "#ffffff",
                    fontWeight: "600",
                    fontSize: "0.825rem",
                    cursor: "pointer"
                  }}
                  onClick={(e) => handleOpenReceipt(e, bill)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Floating Centered Receipt Modal */}
      <Dialog
        header={`Digital Receipt — Invoice #${selectedBill?.id || ""}`}
        visible={isReceiptOpen}
        onHide={() => setIsReceiptOpen(false)}
        style={{ width: "90vw", maxWidth: "480px" }}
        modal
        dismissableMask
        blockScroll
      >
        {selectedBill && (
          <div className="printable-receipt" style={{ padding: "0" }}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div style={{ display: "inline-flex", padding: "0.6rem", borderRadius: "50%", backgroundColor: "#eff6ff", color: "#2563eb", marginBottom: "0.5rem" }}>
                <i className="pi pi-building" style={{ fontSize: "1.35rem" }} />
              </div>
              <h3 style={{ margin: 0, color: "#0f172a", fontSize: "1.1rem" }}>Pharmacy POS System</h3>
              <p style={{ margin: "0.2rem 0 0", color: "#64748b", fontSize: "0.8rem" }}>
                Issued on {formatDate(selectedBill.created_at)}
              </p>
            </div>

            <div style={{ backgroundColor: "#f8fafc", borderRadius: "6px", padding: "0.65rem 0.85rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.8rem", marginBottom: "1rem", border: "1px solid #f1f5f9" }}>
              <div>
                <span style={{ color: "#64748b" }}>Invoice ID:</span>
                <div style={{ fontWeight: "700", color: "#0f172a" }}>#{selectedBill.id}</div>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Pharmacist:</span>
                <div style={{ fontWeight: "700", color: "#0f172a" }}>{getPharmacistUsername(selectedBill.pharmacist_name)}</div>
              </div>
            </div>

            <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "#334155" }}>Purchased Items</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "0.85rem" }}>
              {selectedBill.items?.map((item, idx) => {
                const itemPrice = Number(item.item?.price ?? item.price ?? 0);
                const qty = Number(item.quantity || 1);
                const subtotal = itemPrice * qty;
                return (
                  <div
                    key={idx}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0", borderBottom: "1px solid #f1f5f9", fontSize: "0.825rem" }}
                  >
                    <div>
                      <div style={{ fontWeight: "600", color: "#1e293b" }}>{item.item?.name || item.name || "Medicine"}</div>
                      <div style={{ fontSize: "0.725rem", color: "#64748b" }}>
                        {formatCurrency(itemPrice)} × {qty}
                      </div>
                    </div>
                    <div style={{ fontWeight: "700", color: "#0f172a" }}>
                      {formatCurrency(subtotal)}
                    </div>
                  </div>
                );
              })}
            </div>

            <Divider style={{ margin: "0.5rem 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>Grand Total:</span>
              <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "#16a34a" }}>
                {formatCurrency(selectedBill.totalBill_amount)}
              </span>
            </div>

            <Button
              label="Print Receipt"
              icon="pi pi-print"
              className="no-print"
              style={{ width: "100%", marginTop: "1rem", borderRadius: "6px", padding: "0.6rem", backgroundColor: "#0f172a", borderColor: "#0f172a", color: "#ffffff", fontWeight: "600", fontSize: "0.85rem" }}
              onClick={() => window.print()}
            />
          </div>
        )}
      </Dialog>
    </div>
  );
}
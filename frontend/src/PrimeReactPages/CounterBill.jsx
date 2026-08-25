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

export default function TotalBills() {
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

  // Metrics calculation
  const metrics = useMemo(() => {
    const totalRevenue = totalBills.reduce((acc, b) => acc + (Number(b.totalBill_amount) || 0), 0);
    const totalCount = totalBills.length;
    const avgBill = totalCount ? totalRevenue / totalCount : 0;
    return { totalRevenue, totalCount, avgBill };
  }, [totalBills]);

  // Filtered bills based on search input
  const filteredBills = useMemo(() => {
    if (!searchQuery.trim()) return totalBills;
    const q = searchQuery.toLowerCase();
    return totalBills.filter((bill) => {
      const pharmacist = bill.pharmacist_name?.username?.toLowerCase() || "";
      const billId = String(bill.id);
      return pharmacist.includes(q) || billId.includes(q);
    });
  }, [totalBills, searchQuery]);

  const handleOpenReceipt = (bill) => {
    setSelectedBill(bill);
    setIsReceiptOpen(true);
  };

  return (
    <div style={{ padding: "1.5rem", backgroundColor: "#f8fafc", minHeight: "80vh" }}>
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Pharmacy Sales & Invoices
          </h1>
          <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.875rem" }}>
            Monitor transactions, pharmacist logs, and line-item details.
          </p>
        </div>
        <Button 
          label="Refresh Data" 
          icon="pi pi-refresh" 
          className="p-button-outlined p-button-secondary" 
          onClick={getAllBills} 
          loading={loading}
        />
      </div>

      {/* KPI Stats Widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <Card style={{ borderLeft: "4px solid #3b82f6", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase" }}>Total Revenue</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0f172a", marginTop: "0.5rem" }}>
            {formatCurrency(metrics.totalRevenue)}
          </div>
        </Card>

        <Card style={{ borderLeft: "4px solid #10b981", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase" }}>Total Bills Issued</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0f172a", marginTop: "0.5rem" }}>
            {metrics.totalCount}
          </div>
        </Card>

        <Card style={{ borderLeft: "4px solid #6366f1", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase" }}>Average Ticket Size</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0f172a", marginTop: "0.5rem" }}>
            {formatCurrency(metrics.avgBill)}
          </div>
        </Card>
      </div>

      {/* Toolbar & Search */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "1rem" }}>
        <span className="p-input-icon-left" style={{ width: "100%", maxWidth: "360px" }}>
          <i className="pi pi-search" />
          <InputText 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Search by Bill ID or Pharmacist..." 
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </span>
        <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
          Showing <strong>{filteredBills.length}</strong> of <strong>{totalBills.length}</strong> bills
        </span>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        </div>
      ) : filteredBills.length === 0 ? (
        /* Empty State */
        <Card style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          <i className="pi pi-inbox" style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#94a3b8" }} />
          <h3>No bills found</h3>
          <p>Try adjusting your search criteria or add new bills.</p>
        </Card>
      ) : (
        /* Bills Grid */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem" }}>
          {filteredBills.map((bill) => (
            <Card 
              key={bill.id} 
              className="p-card-hover"
              style={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}
            >
              {/* Card Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "#64748b", textTransform: "uppercase", fontWeight: "600" }}>Invoice</span>
                  <h3 style={{ margin: 0, fontSize: "1.125rem", color: "#0f172a" }}>#{bill.id}</h3>
                </div>
                <Tag severity="success" value="Paid" rounded />
              </div>

              {/* Card Metadata */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", color: "#475569", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <i className="pi pi-calendar" style={{ color: "#94a3b8" }} />
                  <span>{formatDate(bill.created_at)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Avatar icon="pi pi-user" size="small" shape="circle" style={{ backgroundColor: "#e2e8f0", color: "#475569" }} />
                  <span>Pharmacist: <strong>{bill.pharmacist_name?.username || "N/A"}</strong></span>
                </div>
              </div>

              <Divider style={{ margin: "0.75rem 0" }} />

              {/* Items Summary Brief */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Items: <Badge value={bill.items?.length || 0} severity="info" />
                </span>
                <span style={{ fontSize: "1.125rem", fontWeight: "700", color: "#16a34a" }}>
                  {formatCurrency(bill.totalBill_amount)}
                </span>
              </div>

              {/* Action Button */}
              <Button 
                label="View Detailed Receipt" 
                icon="pi pi-receipt" 
                className="p-button-outlined p-button-sm" 
                style={{ width: "100%", borderRadius: "6px" }}
                onClick={() => handleOpenReceipt(bill)}
              />
            </Card>
          ))}
        </div>
      )}

      {/* Digital Receipt Modal View */}
      <Dialog 
        header={`Digital Receipt — Invoice #${selectedBill?.id || ""}`} 
        visible={isReceiptOpen} 
        onHide={() => setIsReceiptOpen(false)}
        style={{ width: "90vw", maxWidth: "540px" }}
        modal
        dismissableMask
      >
        {selectedBill && (
          <div style={{ padding: "0.5rem 0" }}>
            {/* Pharmacy Receipt Header */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "inline-flex", padding: "0.75rem", borderRadius: "50%", backgroundColor: "#eff6ff", color: "#2563eb", marginBottom: "0.5rem" }}>
                <i className="pi pi-building" style={{ fontSize: "1.5rem" }} />
              </div>
              <h3 style={{ margin: 0, color: "#0f172a" }}>Pharmacy POS System</h3>
              <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                Issued on {formatDate(selectedBill.created_at)}
              </p>
            </div>

            {/* Metadata Grid */}
            <div style={{ backgroundColor: "#f8fafc", borderRadius: "8px", padding: "0.875rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              <div>
                <span style={{ color: "#64748b" }}>Invoice ID:</span>
                <div style={{ fontWeight: "600", color: "#0f172a" }}>#{selectedBill.id}</div>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Pharmacist:</span>
                <div style={{ fontWeight: "600", color: "#0f172a" }}>{selectedBill.pharmacist_name?.username || "N/A"}</div>
              </div>
            </div>

            {/* Line Items Table */}
            <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.95rem", color: "#334155" }}>Purchased Items</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {selectedBill.items?.map((item, idx) => {
                const itemPrice = Number(item.item?.price) || 0;
                const subtotal = itemPrice * (item.quantity || 1);
                return (
                  <div 
                    key={idx} 
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1fr solid #f1f5f9", fontSize: "0.875rem" }}
                  >
                    <div>
                      <div style={{ fontWeight: "600", color: "#1e293b" }}>{item.item?.name || "Unknown Medicine"}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        {formatCurrency(itemPrice)} × {item.quantity}
                      </div>
                    </div>
                    <div style={{ fontWeight: "600", color: "#0f172a" }}>
                      {formatCurrency(subtotal)}
                    </div>
                  </div>
                );
              })}
            </div>

            <Divider />

            {/* Total Calculation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
              <span style={{ fontSize: "1rem", fontWeight: "600", color: "#334155" }}>Grand Total:</span>
              <span style={{ fontSize: "1.35rem", fontWeight: "800", color: "#16a34a" }}>
                {formatCurrency(selectedBill.totalBill_amount)}
              </span>
            </div>

            {/* Print Action */}
            <Button 
              label="Print Receipt" 
              icon="pi pi-print" 
              className="p-button-primary" 
              style={{ width: "100%", marginTop: "1.5rem", borderRadius: "6px" }}
              onClick={() => window.print()}
            />
          </div>
        )}
      </Dialog>
    </div>
  );
}
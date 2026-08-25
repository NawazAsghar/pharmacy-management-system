import React, { useEffect, useState, useMemo } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import api from "../API";

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const getInventoryItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/inventory/");
      setInventoryItems(res.data);
    } catch (e) {
      console.error("Failed to fetch inventory items", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInventoryItems();
  }, []);

  // Process inventory directly from backend Inventory items
  const flattenedInventory = useMemo(() => {
    if (!Array.isArray(inventoryItems)) return [];

    return inventoryItems.map((inv) => {
      const itemName = inv.item?.name || "Medicine";
      const quantity = Number(inv.quantity || 0);
      const strength = inv.strength ? `${inv.strength} mg` : "—";
      const brand = inv.brand || inv.item?.brand || "N/A";

      return {
        uniqueId: inv.id,
        name: itemName,
        quantity: quantity,
        strength: strength,
        supplier: brand, // Displays brand since supplier is not on Inventory model
        createdAt: "—",
      };
    });
  }, [inventoryItems]);

  // Overall Calculated Metrics
  const metrics = useMemo(() => {
    const totalSKUs = flattenedInventory.length;
    const totalUnits = flattenedInventory.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    const totalBatches = Array.isArray(inventoryItems)
      ? inventoryItems.length
      : 0;

    return { totalSKUs, totalUnits, totalBatches };
  }, [flattenedInventory, inventoryItems]);

  // Filter items by medicine name, supplier/brand, or strength
  const filteredInventory = useMemo(() => {
    if (!searchQuery.trim()) return flattenedInventory;
    const q = searchQuery.toLowerCase().trim();

    return flattenedInventory.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.supplier.toLowerCase().includes(q) ||
        item.strength.toLowerCase().includes(q)
    );
  }, [flattenedInventory, searchQuery]);

  return (
    <div
      style={{
        padding: "1.25rem 1.5rem",
        backgroundColor: "#f8fafc",
        minHeight: "80vh",
      }}
    >
      <style>{`
        .inventory-table-row:hover {
          background-color: #f1f5f9 !important;
        }
        .p-card .p-card-body {
          padding: 0.9rem !important;
        }
        .p-card .p-card-content {
          padding: 0 !important;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h1
          style={{
            fontSize: "1.35rem",
            fontWeight: "700",
            color: "#0f172a",
            margin: 0,
          }}
        >
          Inventory Directory
        </h1>
        <p style={{ margin: "0.2rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
          Received stock quantities, dosage strengths, and supplier records.
        </p>
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
        <Card
          style={{
            borderLeft: "3px solid #64748b",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "0.725rem",
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            Total Items (SKUs)
          </div>
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              color: "#0f172a",
              marginTop: "0.2rem",
            }}
          >
            {metrics.totalSKUs}
          </div>
        </Card>

        <Card
          style={{
            borderLeft: "3px solid #475569",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "0.725rem",
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            Total Stock Quantity
          </div>
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              color: "#0f172a",
              marginTop: "0.2rem",
            }}
          >
            {metrics.totalUnits.toLocaleString()}{" "}
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: "500",
                color: "#64748b",
              }}
            >
              units
            </span>
          </div>
        </Card>

        <Card
          style={{
            borderLeft: "3px solid #334155",
            borderRadius: "6px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              color: "#64748b",
              fontSize: "0.725rem",
              fontWeight: "600",
              textTransform: "uppercase",
            }}
          >
            Received Batches
          </div>
          <div
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              color: "#0f172a",
              marginTop: "0.2rem",
            }}
          >
            {metrics.totalBatches}{" "}
            <span
              style={{
                fontSize: "0.8rem",
                fontWeight: "500",
                color: "#64748b",
              }}
            >
              entries
            </span>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
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
        <span
          className="p-input-icon-left"
          style={{ width: "100%", maxWidth: "340px" }}
        >
          <i className="pi pi-search" style={{ color: "#94a3b8" }} />
          <InputText
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine, strength, or brand..."
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
          Showing <strong>{filteredInventory.length}</strong> of{" "}
          <strong>{flattenedInventory.length}</strong> items
        </span>
      </div>

      {/* Main Inventory List */}
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "4rem",
          }}
        >
          <ProgressSpinner style={{ width: "36px", height: "36px" }} />
        </div>
      ) : filteredInventory.length === 0 ? (
        <Card
          style={{
            textAlign: "center",
            padding: "3rem 1.5rem",
            color: "#64748b",
            borderRadius: "8px",
          }}
        >
          <i
            className="pi pi-inbox"
            style={{
              fontSize: "2rem",
              marginBottom: "0.5rem",
              color: "#94a3b8",
            }}
          />
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            No matching inventory items found.
          </p>
        </Card>
      ) : (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
            overflow: "hidden",
          }}
        >
          {/* List Table Header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1.5fr 1fr",
              gap: "1rem",
              padding: "0.75rem 1.25rem",
              backgroundColor: "#f8fafc",
              borderBottom: "1px solid #e2e8f0",
              fontWeight: "600",
              fontSize: "0.75rem",
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            <div>Item Name</div>
            <div>Strength</div>
            <div>Quantity</div>
            <div>Brand</div>
            <div>Date</div>
          </div>

          {/* List Rows */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredInventory.map((item, index) => (
              <div
                key={item.uniqueId}
                className="inventory-table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1.5fr 1fr",
                  gap: "1rem",
                  padding: "0.85rem 1.25rem",
                  alignItems: "center",
                  borderBottom:
                    index === filteredInventory.length - 1
                      ? "none"
                      : "1px solid #f1f5f9",
                  fontSize: "0.85rem",
                  color: "#334155",
                  transition: "background-color 0.15s ease",
                }}
              >
                {/* Item Name */}
                <div style={{ fontWeight: "700", color: "#0f172a" }}>
                  {item.name}
                </div>

                {/* Strength */}
                <div>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#475569",
                    }}
                  >
                    {item.strength}
                  </span>
                </div>

                {/* Quantity */}
                <div>
                  <span
                    style={{
                      fontWeight: "600",
                      color: "#0f172a",
                      backgroundColor: "#f1f5f9",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      border: "1px solid #e2e8f0",
                      fontSize: "0.8rem",
                    }}
                  >
                    {item.quantity} units
                  </span>
                </div>

                {/* Brand */}
                <div>
                  <span
                    style={{
                      fontWeight: "500",
                      color: "#334155",
                      backgroundColor: "#f8fafc",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {item.supplier}
                  </span>
                </div>

                {/* Date */}
                <div style={{ color: "#64748b", fontSize: "0.8rem" }}>
                  {item.createdAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
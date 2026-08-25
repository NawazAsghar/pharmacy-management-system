import React from "react";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";

import logo from '../assets/logo/logo_icon.png';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'rgb(248 250 236 / 54%)',
        color: "#94a3b8",
        fontSize: "0.85rem",
        marginTop: "4rem",
        borderTop: "1px solid #1e293b",
      }}
    >
      {/* Footer Content Grid */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 1.5rem 1rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "2.5rem",
        }}
      >
        {/* Column 1: Brand & Social */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justify: "center",
                color: "#ffffff",
              }}
            >
              <img src={logo} alt="logo" srcSet="" />
            </div>
            <span style={{ fontSize: "1.15rem", fontWeight: "800", color: "#282c30" }}>
              PharmaCare
            </span>
          </div>

          <p style={{ lineHeight: "1.6", margin: "0 0 1.25rem 0", color: "#94a3b8" }}>
            Your trusted digital pharmacy partner. Providing verified medications, direct consultation, and express doorstep delivery.
          </p>

          {/* Social Icons — no links */}
          <div style={{ display: "flex", gap: "0.35rem" }}>
            <i className="pi pi-facebook" style={{ color: "#94a3b8", fontSize: "1.2rem", cursor: "default" }} />
            <i className="pi pi-twitter" style={{ color: "#94a3b8", fontSize: "1.2rem", cursor: "default" }} />
            <i className="pi pi-instagram" style={{ color: "#94a3b8", fontSize: "1.2rem", cursor: "default" }} />
            <i className="pi pi-linkedin" style={{ color: "#94a3b8", fontSize: "1.2rem", cursor: "default" }} />
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ color: "rgb(68 69 71);", fontSize: "0.9rem", fontWeight: "700", marginBottom: "0.75rem" }}>
            Quick Links
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {["Home Catalog", "Upload Prescription", "Our Pharmacists", "About Us", "Help & Support"].map((item) => (
              <span key={item} style={{ color: "#94a3b8", padding: "0.35rem 0", cursor: "default" }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h4 style={{ color: "rgb(68 69 71);", fontSize: "0.9rem", fontWeight: "700", marginBottom: "0.75rem" }}>
            Popular Categories
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {["Prescription Medicines", "Over-The-Counter (OTC)", "Vitamins & Supplements", "Personal Care & Hygiene", "First Aid & Devices"].map((item) => (
              <span key={item} style={{ color: "#94a3b8", padding: "0.35rem 0", cursor: "default" }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Column 4: Contact & Hours */}
        <div>
          <h4 style={{ color: "rgb(68 69 71);", fontSize: "0.9rem", fontWeight: "700", marginBottom: "1rem" }}>
            Contact & Hours
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <i className="pi pi-map-marker" style={{ color: "#38bdf8" }} />
              <span>123 Medical Center Blvd</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <i className="pi pi-phone" style={{ color: "#38bdf8" }} />
              <span>+1 (800) 555-PHARMA</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <i className="pi pi-envelope" style={{ color: "#38bdf8" }} />
              <span>support@pharmacare.com</span>
            </div>

            <div style={{ marginTop: "0.25rem" }}>
              <Tag
                severity="success"
                value="Mon - Sat: 8:00 AM - 10:00 PM"
                icon="pi pi-clock"
                style={{ fontSize: "0.75rem" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}>
        <Divider style={{ borderColor: "#1e293b", margin: "0.5rem 0" }} />
      </div>

      {/* Medical Disclaimer */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0.5rem 1.5rem 1rem 1.5rem",
          fontSize: "0.75rem",
          color: "#64748b",
          textAlign: "center",
          lineHeight: "1.5",
        }}
      >
        <i className="pi pi-shield" style={{ marginRight: "0.35rem", color: "#38bdf8" }} />
        <strong>Medical Disclaimer:</strong> Content provided on this site is for informational purposes only and is not intended to substitute professional medical advice, diagnosis, or prescription treatment.
      </div>

      {/* Bottom Copyright Bar */}
      <div
        style={{
          borderTop: "1px solid #1e293b",
          backgroundColor: "rgb(248 250 236 / 54%);",
          padding: "1rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.775rem",
            color: "#64748b",
          }}
        >
          <span>© {new Date().getFullYear()} PharmaCare System. All rights reserved.</span>

          <div style={{ display: "flex", gap: "1rem" }}>
            {["Privacy Policy", "Terms of Service", "Licensing"].map((item) => (
              <span key={item} style={{ color: "#64748b", fontSize: "0.775rem", cursor: "default" }}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
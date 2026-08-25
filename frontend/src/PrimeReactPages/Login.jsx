import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import api from "../API";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  });
  const {login, isAuthenticated} = useAuth();
  const navigate = useNavigate();

  const onSubmitFunc = async (data) => {
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await api.post("/token/", data);
      login(res.data)
      navigate("/");
    } catch (e) {
      console.error("Login Error:", e);
      setErrorMsg(
        e.response?.data?.detail || "Invalid credentials. Please check your username and password."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: "#f8fafc",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        .p-card .p-card-body {
          padding: 2rem !important;
        }
        .p-card .p-card-content {
          padding: 0 !important;
        }
        .p-password, .p-password input {
          width: 100%;
        }
        .p-inputtext:focus {
          border-color: #0f172a !important;
          box-shadow: 0 0 0 1px #0f172a !important;
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: "420px" }}>
        {/* Header Branding */}
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Welcome Back
          </h1>
          <p style={{ margin: "0.35rem 0 0", color: "#64748b", fontSize: "0.875rem" }}>
            Sign in with your credentials to access your account.
          </p>
        </div>

        {/* Form Card */}
        <Card
          style={{
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)",
            backgroundColor: "#ffffff",
          }}
        >
          {errorMsg && (
            <Message
              severity="error"
              text={errorMsg}
              style={{
                width: "100%",
                marginBottom: "1.25rem",
                borderRadius: "8px",
                justifyContent: "flex-start",
                fontSize: "0.825rem"
              }}
            />
          )}

          <form onSubmit={handleSubmit(onSubmitFunc)} style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
            {/* Username Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="username" style={{ fontSize: "0.825rem", fontWeight: "600", color: "#334155" }}>
                Username
              </label>
              <Controller
                name="username"
                control={control}
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                  <span className="p-input-icon-left" style={{ width: "100%" }}>
                    <i className="pi pi-user" style={{ color: "#94a3b8" }} />
                    <InputText
                      id="username"
                      {...field}
                      placeholder="Enter your username"
                      className={errors.username ? "p-invalid" : ""}
                      style={{ width: "100%", borderRadius: "8px", paddingLeft: "2.5rem" }}
                    />
                  </span>
                )}
              />
              {errors.username && (
                <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.username.message}</small>
              )}
            </div>

            {/* Password Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="password" style={{ fontSize: "0.825rem", fontWeight: "600", color: "#334155" }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: "0.775rem", color: "#0f172a", textDecoration: "none", fontWeight: "500" }}
                >
                  Forgot password?
                </Link>
              </div>
              <Controller
                name="password"
                control={control}
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <Password
                    id="password"
                    {...field}
                    placeholder="Enter your password"
                    toggleMask
                    feedback={false}
                    className={errors.password ? "p-invalid" : ""}
                    inputStyle={{ borderRadius: "8px" }}
                  />
                )}
              />
              {errors.password && (
                <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.password.message}</small>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              label={loading ? "Signing in..." : "Sign In"}
              icon={loading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
              disabled={loading}
              style={{
                marginTop: "0.5rem",
                backgroundColor: "#0f172a",
                borderColor: "#0f172a",
                borderRadius: "8px",
                padding: "0.75rem",
                fontWeight: "600",
                fontSize: "0.875rem",
                width: "100%",
                justifyContent: "center"
              }}
            />
          </form>

          {/* Card Footer Switch Link */}
          <div
            style={{
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop: "1px solid #f1f5f9",
              textAlign: "center",
              fontSize: "0.825rem",
              color: "#64748b",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{ color: "#0f172a", fontWeight: "700", textDecoration: "none" }}
            >
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
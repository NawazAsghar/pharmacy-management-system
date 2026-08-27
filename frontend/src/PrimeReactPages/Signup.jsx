import React, { useState, useEffect } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Dropdown } from "primereact/dropdown"; // <-- Import Dropdown
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import api from "../API";

export default function Signup() {
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]); // Store fetched roles

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      role: "",
      phone: "",
      password: "",
      password2: ""
    }
  });

  const navigate = useNavigate();
  // It tracks the live input value of the password field in real time as the user types.
  const password = watch("password");

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = () => {
      setRoleOptions([
        { label: "Pharmacist", value: "PHARMACIST" },
        { label: "Supplier", value: "SUPPLIER" }
      ]);
    };
    fetchRoles();
  }, []);

  const onSubmitFunc = async (data) => {
    setErrorMsg("");
    setLoading(true);
    try {
      await api.post("/signup/", data);
      navigate("/login");
    } catch (e) {
      console.error("Signup Error:", e);
      setErrorMsg(
        e.response?.data?.detail || "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem 1.5rem",
        backgroundColor: "#f8fafc",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        .p-card .p-card-body { padding: 2rem !important; }
        .p-card .p-card-content { padding: 0 !important; }
        .p-password, .p-password input, .p-dropdown { width: 100%; }
        .p-inputtext:focus, .p-dropdown:focus {
          border-color: #0f172a !important;
          box-shadow: 0 0 0 1px #0f172a !important;
        }
      `}</style>

      <div style={{ width: "100%", maxWidth: "560px" }}>
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Create an Account
          </h1>
          <p style={{ margin: "0.35rem 0 0", color: "#64748b", fontSize: "0.875rem" }}>
            Enter your details below to register your system profile.
          </p>
        </div>

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

          <form onSubmit={handleSubmit(onSubmitFunc)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Grid Row 1: First Name & Last Name */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label htmlFor="first_name" style={{ fontSize: "0.825rem", fontWeight: "600", color: "#334155" }}>
                  First Name
                </label>
                <Controller
                  name="first_name"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <InputText
                      id="first_name"
                      {...field}
                      placeholder="Your name"
                      className={errors.first_name ? "p-invalid" : ""}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label htmlFor="last_name" style={{ fontSize: "0.825rem", fontWeight: "600", color: "#334155" }}>
                  Last Name
                </label>
                <Controller
                  name="last_name"
                  control={control}
                  rules={{ required: "Required" }}
                  render={({ field }) => (
                    <InputText
                      id="last_name"
                      {...field}
                      placeholder="Your last name"
                      className={errors.last_name ? "p-invalid" : ""}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}
                />
              </div>
            </div>

            {/* Grid Row 2: Username & Email */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label htmlFor="username" style={{ fontSize: "0.825rem", fontWeight: "600", color: "#334155" }}>
                  Username
                </label>
                <Controller
                  name="username"
                  control={control}
                  rules={{ required: "Username is required" }}
                  render={({ field }) => (
                    <InputText
                      id="username"
                      {...field}
                      placeholder="Enter your username"
                      className={errors.username ? "p-invalid" : ""}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}
                />
                {errors.username && (
                  <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.username.message}</small>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label htmlFor="email" style={{ fontSize: "0.825rem", fontWeight: "600", color: "#334155" }}>
                  Email Address
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                  }}
                  render={({ field }) => (
                    <InputText
                      id="email"
                      type="email"
                      {...field}
                      placeholder="youremail@example.com"
                      className={errors.email ? "p-invalid" : ""}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}
                />
                {errors.email && (
                  <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.email.message}</small>
                )}
              </div>
            </div>

            {/* Grid Row 3: Role (Dropdown) & Phone */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label htmlFor="role" style={{ fontSize: "0.825rem", fontWeight: "600", color: "#334155" }}>
                  Select Role
                </label>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Dropdown
                      id="role"
                      value={field.value}
                      options={roleOptions}
                      onChange={(e) => field.onChange(e.value)}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Select a role"
                      className={errors.role ? "p-invalid" : ""}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}
                />
                {errors.role && (
                  <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.role.message}</small>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label htmlFor="phone" style={{ fontSize: "0.825rem", fontWeight: "600", color: "#334155" }}>
                  Phone Number
                </label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <InputText
                      id="phone"
                      type="number"
                      {...field}
                      placeholder="0311......"
                      className={errors.phone ? "p-invalid" : ""}
                      style={{ width: "100%", borderRadius: "8px" }}
                    />
                  )}
                />
                {errors.phone && (
                  <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.phone.message}</small>
                )}
              </div>
            </div>

            {/* Grid Row 4: Password & Confirm Password */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label htmlFor="password" style={{ fontSize: "0.825rem", fontWeight: "600", color: "#334155" }}>
                  Password
                </label>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: "Password is required", minLength: { value: 6, message: "Min 6 chars" } }}
                  render={({ field }) => (
                    <Password
                      id="password"
                      {...field}
                      placeholder="Create password"
                      toggleMask
                      className={errors.password ? "p-invalid" : ""}
                      inputStyle={{ borderRadius: "8px" }}
                    />
                  )}
                />
                {errors.password && (
                  <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.password.message}</small>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <label htmlFor="password2" style={{ fontSize: "0.825rem", fontWeight: "600", color: "#334155" }}>
                  Confirm Password
                </label>
                <Controller
                  name="password2"
                  control={control}
                  rules={{
                    required: "Confirm password",
                    validate: (val) => val === password || "Passwords do not match"
                  }}
                  render={({ field }) => (
                    <Password
                      id="password2"
                      {...field}
                      placeholder="Confirm password"
                      toggleMask
                      feedback={false}
                      className={errors.password2 ? "p-invalid" : ""}
                      inputStyle={{ borderRadius: "8px" }}
                    />
                  )}
                />
                {errors.password2 && (
                  <small style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.password2.message}</small>
                )}
              </div>
            </div>

            <Button
              type="submit"
              label={loading ? "Creating Account..." : "Sign Up"}
              icon={loading ? "pi pi-spin pi-spinner" : "pi pi-user-plus"}
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
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "#0f172a", fontWeight: "700", textDecoration: "none" }}
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
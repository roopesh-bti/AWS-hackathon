import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Logo from "../components/Logo";
import { signUpUser } from "../services/auth";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Basic client-side validation
  function validate() {
    const errors = {};
    if (!name.trim()) errors.name = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address.";
    if (password.length < 8) errors.password = "Password must be at least 8 characters.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validate()) return;

    setLoading(true);
    try {
      await signUpUser(name.trim(), email, password);
      setSuccess("Account created successfully! Redirecting to sign in...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message || "Could not create account.");
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="card-logo">
        <Logo />
      </div>
      <h1>Create Account</h1>
      <p className="card-subtitle">Register to start using BMW ServiceCare.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Your full name"
            className={fieldErrors.name ? "input-error" : ""}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            className={fieldErrors.email ? "input-error" : ""}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 8 characters"
            className={fieldErrors.password ? "input-error" : ""}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="switch-text">
        Already have an account? <Link to="/">Back to Sign In</Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;

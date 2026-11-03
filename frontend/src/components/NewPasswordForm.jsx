import { useState } from "react";
import { Link } from "react-router-dom";

const LABELS = { name: "Full Name" };

// Change-password form for Cognito's NEW_PASSWORD_REQUIRED challenge
function NewPasswordForm({ requiredAttributes, loading, onSubmit, onCancel }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [attributes, setAttributes] = useState({});
  const [errors, setErrors] = useState({});

  function validate() {
    const next = {};
    if (!newPassword) next.newPassword = "New password is required.";
    if (!confirm) next.confirm = "Please confirm your new password.";
    else if (newPassword && confirm !== newPassword) next.confirm = "Passwords do not match.";
    requiredAttributes.forEach((attr) => {
      if (!attributes[attr]?.trim()) next[attr] = `${LABELS[attr] || attr} is required.`;
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (validate()) onSubmit(newPassword, attributes);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {requiredAttributes.map((attr) => (
        <div className="field" key={attr}>
          <label htmlFor={`attr-${attr}`}>{LABELS[attr] || attr}</label>
          <input
            id={`attr-${attr}`}
            type="text"
            className={errors[attr] ? "input-error" : ""}
            value={attributes[attr] || ""}
            onChange={(e) => setAttributes({ ...attributes, [attr]: e.target.value })}
          />
          {errors[attr] && <span className="field-error">{errors[attr]}</span>}
        </div>
      ))}

      <div className="field">
        <label htmlFor="new-password">New Password</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          className={errors.newPassword ? "input-error" : ""}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {errors.newPassword && <span className="field-error">{errors.newPassword}</span>}
      </div>

      <div className="field">
        <label htmlFor="confirm-password">Confirm New Password</label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          className={errors.confirm ? "input-error" : ""}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {errors.confirm && <span className="field-error">{errors.confirm}</span>}
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Set New Password"}
      </button>

      <p className="switch-text">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            onCancel();
          }}
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export default NewPasswordForm;

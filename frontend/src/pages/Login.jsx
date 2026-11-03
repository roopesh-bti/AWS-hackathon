import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import Logo from "../components/Logo";
import NewPasswordForm from "../components/NewPasswordForm";
import { loginUser, completeNewPassword, getHomeRoute } from "../services/auth";

// Sign-in failures
function signInErrorMessage(err) {
  switch (err?.code) {
    case "NotAuthorizedException":
    case "UserNotFoundException":
      return "Invalid email or password. Please try again.";
    case "UserNotConfirmedException":
      return "Your account is not confirmed yet. Please contact support.";
    case "PasswordResetRequiredException":
      return "A password reset is required for this account.";
    case "TooManyRequestsException":
    case "LimitExceededException":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "We couldn't sign you in right now. Please try again.";
  }
}

// Password-change failures, kept separate from sign-in errors
function passwordChangeErrorMessage(err) {
  switch (err?.code) {
    case "InvalidPasswordException":
    case "InvalidParameterException":
      return err.message || "That password does not meet the requirements.";
    case "TooManyRequestsException":
    case "LimitExceededException":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "We couldn't update your password. Please try again.";
  }
}

// The challenge session only lasts a few minutes
const isChallengeExpired = (err) =>
  err?.code === "NotAuthorizedException" && /session/i.test(err.message || "");

function Login() {
  const navigate = useNavigate();

  // Pre-fill the email if the user ticked "Remember me" last time
  const savedEmail = localStorage.getItem("rememberedEmail") || "";
  const [email, setEmail] = useState(savedEmail);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(Boolean(savedEmail));
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [challenge, setChallenge] = useState(null); // set when Cognito asks for a new password
  const [passwordError, setPasswordError] = useState("");

  // Basic client-side validation
  function validate() {
    const errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function saveRememberedEmail() {
    if (remember) localStorage.setItem("rememberedEmail", email);
    else localStorage.removeItem("rememberedEmail");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await loginUser(email, password); // saves the JWT on success
      if (result.status === "NEW_PASSWORD_REQUIRED") {
        setChallenge(result);
        return;
      }
      saveRememberedEmail();
      navigate(await getHomeRoute());
    } catch (err) {
      setError(signInErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordChange(newPassword, attributes) {
    setPasswordError("");
    setLoading(true);
    try {
      await completeNewPassword(challenge.user, newPassword, attributes);
      saveRememberedEmail();
      navigate(await getHomeRoute());
    } catch (err) {
      if (isChallengeExpired(err)) {
        setChallenge(null);
        setPassword("");
        setError("Your sign-in session expired. Please sign in again.");
      } else {
        setPasswordError(passwordChangeErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  }

  if (challenge) {
    return (
      <AuthLayout>
        <div className="card-logo">
          <Logo />
        </div>
        <h1>Set a New Password</h1>
        <p className="card-subtitle">
          Your account uses a temporary password. Choose a new one to continue.
        </p>

        {passwordError && <div className="alert alert-error">{passwordError}</div>}

        <NewPasswordForm
          requiredAttributes={challenge.requiredAttributes}
          loading={loading}
          onSubmit={handlePasswordChange}
          onCancel={() => {
            setChallenge(null);
            setPasswordError("");
            setPassword("");
          }}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="card-logo">
        <Logo />
      </div>
      <h1>Welcome Back</h1>
      <p className="card-subtitle">Sign in to access your service dashboard.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
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
            placeholder="Enter your password"
            className={fieldErrors.password ? "input-error" : ""}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
        </div>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me
        </label>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="switch-text">
        New to ServiceCare? <Link to="/signup">Create an account</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;

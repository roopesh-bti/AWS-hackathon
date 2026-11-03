import Logo from "./Logo";

// Split-screen layout shared by Login and Signup:
// branding on the left, the form (children) on the right
function AuthLayout({ children }) {
  return (
    <div className="auth">
      <aside className="auth-hero">
        <div className="hero-content">
          <Logo light />
          <div>
            <h2>Welcome to BMW ServiceCare</h2>
            <p className="tagline">Intelligent Vehicle Service Assistance</p>
          </div>
          <p className="hero-footer">BMW Group &middot; Service Portal</p>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-card">{children}</div>
      </main>
    </div>
  );
}

export default AuthLayout;

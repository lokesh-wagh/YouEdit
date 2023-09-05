
function LandingPage() {
  return (
    <div className="landing-page">
      <h1>Welcome to Our Website</h1>
      <p>Explore our amazing content and features.</p>

      <div className="button-container">
        <a href="/creator" className="button">
          <button>Creator</button>
        </a>

        <a href="/editor" className="button">
          <button>Editor</button>
        </a>
      </div>
    </div>
  );
}

export default LandingPage;
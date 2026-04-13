import { ArrowRight, Zap, BarChart3, Clock, Shield } from 'lucide-react';

export default function LandingPage({ onSignInClick, onDemoClick }) {
  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav
        style={{
          background: 'rgba(8,11,18,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-default)',
          padding: '0 32px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div className="flex items-center">
          <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-primary)', marginRight: '8px', boxShadow: '0 0 8px rgba(0,208,132,0.6)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>RewardHub</span>
        </div>
        <button
          onClick={onSignInClick}
          style={{
            background: 'var(--accent-primary)',
            color: '#000',
            fontFamily: 'var(--font-primary)',
            fontWeight: 600,
            fontSize: '13px',
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, margin: '0 0 24px' }}>
          Track All Your{' '}
          <span style={{ color: 'var(--accent-primary)', textShadow: '0 0 40px rgba(0,208,132,0.3)' }}>
            Cashback & Rewards
          </span>
        </h1>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 40px', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
          Stop juggling multiple payment apps. RewardHub connects your Gmail to show all cashback, coupons, and expiring rewards in one unified dashboard.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center" style={{ marginBottom: '16px' }}>
          <button
            onClick={onSignInClick}
            className="flex items-center justify-center gap-2"
            style={{
              background: 'var(--accent-primary)',
              color: '#000',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
              fontSize: '14px',
              padding: '14px 28px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.2s, transform 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Sign In with Google
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onDemoClick}
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
              fontSize: '14px',
              padding: '14px 28px',
              borderRadius: '10px',
              border: '1px solid var(--border-hover)',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
          >
            Try Demo
          </button>
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
          Gmail read-only &bull; Secure OAuth2 &bull; Your data stays yours
        </p>

        {/* Dashboard Preview */}
        <div style={{ marginTop: '72px', position: 'relative' }}>
          <div style={{ border: '1px solid var(--border-default)', borderRadius: '16px', padding: '2px', background: 'linear-gradient(180deg, rgba(0,208,132,0.06) 0%, transparent 50%)' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '14px', border: '1px solid var(--border-default)', padding: '28px 24px' }}>
              {/* Preview Header */}
              <div className="flex justify-between items-center" style={{ marginBottom: '20px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600 }}>Your Rewards Dashboard</span>
                <div className="flex gap-1.5">
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF4757', display: 'inline-block' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F0A500', display: 'inline-block' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D084', display: 'inline-block' }} />
                </div>
              </div>

              {/* Summary Cards Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: '20px' }}>
                {[
                  { label: 'Total Earned', value: '₹3,450', color: '#00D084' },
                  { label: 'Pending', value: '₹820', color: '#F0A500' },
                  { label: 'Expiring in 7 Days', value: '₹250', color: '#FF4757' },
                ].map((card, i) => (
                  <div key={i} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-default)', borderRadius: '10px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
                    <p style={{ fontFamily: 'var(--font-primary)', fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{card.label}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 600, color: card.color, letterSpacing: '-0.02em', margin: 0 }}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Rewards List Preview */}
              {[
                { app: 'Paytm', type: 'Cashback', amount: '₹100', date: 'Today', color: '#00BAF2' },
                { app: 'PhonePe', type: 'Coupon', amount: 'SAVE50', date: 'Yesterday', color: '#9B6FD4' },
                { app: 'Google Pay', type: 'Cashback', amount: '₹75', date: '2 days ago', color: '#4285F4' },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center" style={{ padding: '12px 0', borderBottom: idx < 2 ? '1px solid var(--border-default)' : 'none' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', fontWeight: 600, color: item.color }}>{item.app}</span>
                    <span style={{ fontFamily: 'var(--font-primary)', fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>{item.type}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--accent-primary)' }}>{item.amount}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginLeft: '10px' }}>{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Glow */}
          <div style={{ position: 'absolute', zIndex: -1, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'rgba(0,208,132,0.06)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        </div>
      </section>

      {/* Features Section */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, textAlign: 'center', letterSpacing: '-0.03em', marginBottom: '48px' }}>Why RewardHub?</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <BarChart3 size={24} />, title: 'Unified Dashboard', desc: 'See rewards from Paytm, PhonePe, Google Pay, Amazon, Swiggy, and Zomato in one place.' },
            { icon: <Clock size={24} />, title: 'Expiry Alerts', desc: 'Never miss a reward. Get notified of cashback and coupons expiring in the next 7 days.' },
            { icon: <Zap size={24} />, title: 'Instant Sync', desc: 'Connect your Gmail with OAuth2. Rewards are parsed and synced instantly.' },
            { icon: <Shield size={24} />, title: 'Privacy First', desc: 'Read-only Gmail access. Your emails and data stay secure.' },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: '14px',
                padding: '24px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--accent-glow)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, marginBottom: '8px', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 80px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px' }}>Ready to Get Started?</h2>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '28px' }}>Take control of your rewards in 30 seconds.</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onSignInClick}
            style={{
              background: 'var(--accent-primary)',
              color: '#000',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
              fontSize: '14px',
              padding: '14px 28px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sign In with Google
          </button>
          <button
            onClick={onDemoClick}
            style={{
              background: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-primary)',
              fontWeight: 600,
              fontSize: '14px',
              padding: '14px 28px',
              borderRadius: '10px',
              border: '1px solid var(--border-hover)',
              cursor: 'pointer',
            }}
          >
            Try Demo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-default)', padding: '24px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: '12px', color: 'var(--text-muted)' }}>
          &copy; 2025 RewardHub. A portfolio project showcasing Gmail API + React integration.
        </p>
      </footer>
    </div>
  );
}

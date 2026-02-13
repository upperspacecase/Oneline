import { useState } from 'react'

interface Props {
  onEnter: () => void
}

export default function Landing({ onEnter }: Props) {
  const [billingCycle, setBillingCycle] = useState<'year' | 'month'>('year')

  return (
    <div className="landing">
      <div className="landing-scroll">

        {/* Hero */}
        <section className="l-hero">
          <h1 className="l-title">Through Line.</h1>
          <div className="l-line" />
        </section>

        {/* The hook */}
        <section className="l-section">
          <p className="l-big">You don't need another journaling app.</p>
          <p className="l-big">You need consistency. One sentence a day, every day, for years.</p>
          <p className="l-big l-accent">You need a through line.</p>
        </section>

        {/* Visual demo */}
        <section className="l-section l-demo">
          <div className="l-demo-date">February 12</div>
          <div className="l-demo-entry l-demo-current">
            <span className="l-demo-year">2026</span>
            <div className="l-demo-blank">
              <span className="l-demo-cursor" />
            </div>
          </div>
          <div className="l-demo-entry">
            <span className="l-demo-year">2025</span>
            <span className="l-demo-text">Quit the job. No plan. First time I've felt awake in months.</span>
          </div>
          <div className="l-demo-entry">
            <span className="l-demo-year">2024</span>
            <span className="l-demo-text">Started running again. 2 miles felt like 20. But I went.</span>
          </div>
          <div className="l-demo-entry">
            <span className="l-demo-year">2023</span>
            <span className="l-demo-text">She said yes.</span>
          </div>
        </section>

        {/* Pricing */}
        <section className="l-section l-pricing-section">
          <div className="l-toggle">
            <button
              className={`l-toggle-btn${billingCycle === 'year' ? ' active' : ''}`}
              onClick={() => setBillingCycle('year')}
            >
              Yearly
            </button>
            <button
              className={`l-toggle-btn${billingCycle === 'month' ? ' active' : ''}`}
              onClick={() => setBillingCycle('month')}
            >
              Monthly
            </button>
          </div>

          <div className="l-price-card">
            <div className="l-price">
              <span className="l-price-dollar">$</span>
              <span className="l-price-amount">{billingCycle === 'year' ? '30' : '5'}</span>
              <span className="l-price-period">/{billingCycle === 'year' ? 'year' : 'mo'}</span>
            </div>
            {billingCycle === 'year' && (
              <p className="l-price-save">$2.50/mo &mdash; save $30</p>
            )}
            <ul className="l-features">
              <li>One sentence per day, 280 characters</li>
              <li>See past years on the same date</li>
              <li>Calendar view with streaks</li>
              <li>Export to PDF</li>
              <li>Photo attachment</li>
              <li>Passcode lock</li>
              <li>Works offline</li>
              <li>Your data stays on your device</li>
            </ul>
            <button className="l-cta" onClick={onEnter}>
              Start writing
            </button>
            <p className="l-cta-sub">No account needed. Start free, right now.</p>
          </div>
        </section>

        {/* Closer */}
        <section className="l-section l-closer">
          <p className="l-big">Through Line.</p>
          <p className="l-body l-dim">Every day. For the rest of your life.</p>
        </section>

        <footer className="l-footer">
          <div className="l-line" />
          <p>&copy; {new Date().getFullYear()} Through Line</p>
        </footer>
      </div>
    </div>
  )
}

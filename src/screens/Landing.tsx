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
          <h1 className="l-title">One Line.</h1>
          <div className="l-line" />
        </section>

        {/* The hook */}
        <section className="l-section">
          <p className="l-big">You don't need another journaling app.</p>
          <p className="l-big">You don't need prompts or streaks or AI telling you how you feel.</p>
          <p className="l-big l-accent">You need one line.</p>
        </section>

        <section className="l-section">
          <p className="l-body">One honest sentence. Every day. For five years.</p>
          <p className="l-body l-dim">That's it.</p>
        </section>

        {/* The magic */}
        <section className="l-section">
          <p className="l-body">On day one, it feels pointless.</p>
          <p className="l-body">On day 366, you see who you were a year ago.</p>
          <p className="l-body">On day 1,096, three versions of you are having a conversation you never planned.</p>
        </section>

        {/* The scene */}
        <section className="l-section l-scene">
          <p className="l-body-italic">
            The person who wrote that line in a hostel in Mexico is talking to the person who wrote it from their apartment in Portugal.
          </p>
          <p className="l-body-italic l-dim">
            Neither of them knew the other was coming.
          </p>
        </section>

        {/* The reframe */}
        <section className="l-section">
          <p className="l-body">This isn't productivity.</p>
          <p className="l-body l-accent">It's proof.</p>
          <p className="l-small">Proof that you showed up. Proof that you changed. Proof that the things that felt enormous eventually became small, and the things that felt small became your whole life.</p>
        </section>

        <section className="l-section">
          <div className="l-line" />
        </section>

        {/* The close */}
        <section className="l-section">
          <p className="l-big">One line won't change your day.</p>
          <p className="l-big l-accent">Five years of them will change how you see yourself.</p>
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
              <li>One line per day, 280 characters</li>
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
          <p className="l-big">One Line.</p>
          <p className="l-body l-dim">Every day. For the rest of your life.</p>
        </section>

        <footer className="l-footer">
          <div className="l-line" />
          <p>&copy; {new Date().getFullYear()} One Line</p>
        </footer>
      </div>
    </div>
  )
}

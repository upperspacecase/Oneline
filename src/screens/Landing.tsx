interface Props {
  onEnter: () => void
}

export default function Landing({ onEnter }: Props) {
  return (
    <div className="landing">
      <div className="landing-scroll">

        {/* Hero */}
        <section className="l-hero">
          <h1 className="l-hero-heading">Remember everything.<br />Write almost nothing.</h1>
          <p className="l-hero-body">
            Through Line is a one-sentence journal. 280 characters about today.
            Over years, those sentences become the story of your life.
          </p>
          <button className="l-cta" onClick={onEnter}>
            Write your first sentence
          </button>
          <p className="l-cta-sub">Free for 14 days. Then $2.50/mo, billed at $30/year.</p>
        </section>

        {/* Demo card — no label, just the card */}
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

        {/* Constraint section */}
        <section className="l-section">
          <h2 className="l-heading">No blank pages. No prompts. Just one sentence about today.</h2>
          <p className="l-body">
            Most journals give you infinite space. That's not freedom &mdash; that's why you stopped writing.
            Through Line gives you 280 characters. The constraint kills the pressure and turns journaling
            into something that takes less time than unlocking your phone.
          </p>
        </section>

        {/* Killer feature */}
        <section className="l-section">
          <h2 className="l-heading">This day, every year.</h2>
          <p className="l-body">
            Open Through Line on any date and read what you wrote &mdash; last year, two years ago,
            five years ago. Rediscover things you forgot. Notice patterns you couldn't see while
            living them. The entries you write today are for the person you'll be in a year.
          </p>
        </section>

        {/* Second demo card */}
        <section className="l-section l-demo">
          <div className="l-demo-date">October 3</div>
          <div className="l-demo-entry">
            <span className="l-demo-year">2026</span>
            <span className="l-demo-text">Moved into the new place. Boxes everywhere. It already feels like home.</span>
          </div>
          <div className="l-demo-entry">
            <span className="l-demo-year">2025</span>
            <span className="l-demo-text">Told her I want to leave the city. She said she's been thinking the same thing.</span>
          </div>
          <div className="l-demo-entry">
            <span className="l-demo-year">2024</span>
            <span className="l-demo-text">Can't sleep. The apartment feels too small for everything I'm carrying.</span>
          </div>
        </section>

        {/* Loss frame */}
        <section className="l-section l-loss-frame">
          <p className="l-loss-text">
            You won't remember what you had for lunch last Tuesday.
            You won't remember how you felt the day everything changed &mdash; unless you write it down.
          </p>
        </section>

        {/* Supporting features */}
        <section className="l-section">
          <h3 className="l-features-heading">Everything else.</h3>
          <ul className="l-features">
            <li>280 characters. One sentence. No blank-page anxiety.</li>
            <li>Streak calendar. Never break the chain.</li>
            <li>Attach a photo to any entry.</li>
            <li>Export your whole journal as a PDF.</li>
            <li>Passcode lock. Your words only.</li>
            <li>Works offline. Your data stays on your device.</li>
          </ul>
        </section>

        {/* Guarantee + Pricing + Final CTA */}
        <section className="l-section l-pricing-section">
          <h2 className="l-pricing-heading">8 cents a day to remember the rest of your life.</h2>
          <div className="l-price-card">
            <div className="l-price">
              <span className="l-price-dollar">$</span>
              <span className="l-price-amount">30</span>
              <span className="l-price-period">/year</span>
            </div>
            <p className="l-price-monthly">$2.50/mo</p>
            <p className="l-guarantee">
              Write for 30 days. If it's not for you, email us for a full refund.
            </p>
            <button className="l-cta" onClick={onEnter}>
              Write your first sentence
            </button>
            <p className="l-cta-sub">Free for 14 days. No account needed.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="l-footer">
          <div className="l-line" />
          <p className="l-footer-tagline">Through Line. Every day. For the rest of your life.</p>
          <p>&copy; {new Date().getFullYear()} Through Line</p>
        </footer>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import './terms.css'

const LAST_UPDATED = 'October 2, 2026'

const quickFacts = [
  { title: 'Personal use', text: 'Every course is licensed for your own learning.' },
  { title: '7-day refunds', text: 'If you have watched less than 20% of a course.' },
  { title: 'Fair play', text: 'No account sharing, no downloading videos.' },
]

const dos = [
  'Learn at your own pace on any of your devices',
  'Post honest reviews and questions',
  'Close your account whenever you like',
]

const donts = [
  'Share your login or resell course access',
  'Record, copy or redistribute videos',
  'Use bots or try to bypass our security',
]

const clauses = [
  {
    title: 'Your account',
    text: 'Use accurate details, keep your password private, and be 16 or older. You are responsible for activity on your account, so tell us quickly if something looks wrong.',
  },
  {
    title: 'Courses and access',
    text: 'Enrolling gives you a personal, non-transferable licence to watch a course. We may update or remove content to keep it current, and will offer a refund if a paid course is taken down before you finish.',
  },
  {
    title: 'Payments and refunds',
    text: 'Prices are shown at checkout and payments go through our secure payment partner. Request a refund within 7 days at support@classstream.com.',
  },
  {
    title: 'Content and ownership',
    text: 'Videos, notes and code samples belong to ClassStream or our instructors. Reviews you post stay yours, but you let us display them on the platform.',
  },
  {
    title: 'Ending access',
    text: 'You can delete your account at any time. We may suspend accounts that seriously or repeatedly break these terms.',
  },
  {
    title: 'Liability and law',
    text: 'ClassStream is provided as is, and we cannot guarantee job or salary outcomes. Our liability is limited to what you paid in the last 12 months. These terms follow Indian law, with disputes handled in Chennai.',
  },
]

const Terms = ({ onAccept }) => {
  const [agreed, setAgreed] = useState(false)
  const [done, setDone] = useState(false)

  const handleAccept = () => {
    if (!agreed) return
    try {
      localStorage.setItem('classstream_terms_accepted', new Date().toISOString())
    } catch (e) {
      /* storage unavailable, continue anyway */
    }
    setDone(true)
    if (onAccept) onAccept()
    else window.location.assign('/register')
  }

  return (
    <div className="tm-page">
      {/* Hero */}
      <header className="tm-hero">
        <div className="tm-hero-text">
         
          <h1 className="tm-title">Terms of Service</h1>
          <p className="tm-subtitle">
            The short version of how ClassStream works, so you know what to expect.
          </p>
        </div>

      </header>

      {/* Quick facts */}
      <section className="tm-facts" aria-label="Key points">
        {quickFacts.map((f) => (
          <div className="tm-fact" key={f.title}>
            <h2 className="tm-fact-title">{f.title}</h2>
            <p className="tm-fact-text">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Do and don't */}
      <section className="tm-rules" aria-label="House rules">
        <div className="tm-rule tm-rule-do">
          <h2 className="tm-rule-title">
            <span className="tm-rule-icon">✓</span> You can
          </h2>
          <ul>
            {dos.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="tm-rule tm-rule-dont">
          <h2 className="tm-rule-title">
            <span className="tm-rule-icon">✕</span> Please don't
          </h2>
          <ul>
            {donts.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Details */}
      <section className="tm-details" aria-label="Details">
        <h2 className="tm-section-title">The details</h2>
        <div className="tm-clauses">
          {clauses.map((c) => (
            <details className="tm-clause" key={c.title}>
              <summary>{c.title}</summary>
              <p>{c.text}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Accept box */}
      <section className="tm-accept" aria-label="Accept terms">
        <label className="tm-check">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="tm-check-box" aria-hidden="true">
            ✓
          </span>
          <span className="tm-check-label">
            I have read and agree to the Terms &amp; Conditions outlined above.
          </span>
        </label>

        <button
          type="button"
          className="tm-accept-btn"
          disabled={!agreed || done}
          onClick={handleAccept}
        >
          {done ? 'Accepted' : 'Accept & Continue'}
        </button>
      </section>
    </div>
  )
}

export default Terms
import React, { useEffect, useState } from 'react'
import './privacy.css'



const sections = [
  {
    id: 'collect',
    title: 'Information we collect',
    body: [
      'We collect only what we need to run your learning account and improve the platform.',
    ],
    list: [
      'Account details: your name, email address, password (stored encrypted) and profile photo.',
      'Learning activity: courses you enroll in, lessons watched, progress, quiz results and notes.',
      'Payment details: billing name, country and transaction status. Card numbers are handled by our payment partner and never stored on our servers.',
      'Device data: browser type, operating system, IP address and playback quality, used to keep video streaming smooth.',
    ],
  },
  {
    id: 'use',
    title: 'How we use your information',
    body: ['Your data is used to deliver the service you signed up for, including:'],
    list: [
      'Creating your account and unlocking the courses you have access to.',
      'Saving your progress so you can resume any lesson where you stopped.',
      'Processing payments, issuing receipts and certificates.',
      'Sending service emails such as password resets, purchase confirmations and course updates.',
      'Detecting fraud, abuse and account sharing, and fixing technical issues.',
    ],
  },
  {
    id: 'video',
    title: 'Video and learning data',
    body: [
      'We track playback events such as play, pause, speed and completion to calculate your progress and to improve lesson quality. Course videos are protected for the instructors who created them, and you may not download, record or redistribute them.',
      'Reviews you post, including your name and job title, are shown publicly only after you give permission.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies and local storage',
    body: [
      'We use cookies and browser storage to keep you signed in, remember your preferences and measure how the site performs. You can clear or block cookies in your browser settings, but parts of ClassStream, such as staying logged in, may stop working.',
    ],
  },
  {
    id: 'sharing',
    title: 'Who we share data with',
    body: [
      'We do not sell your personal information. We share limited data only with trusted providers that help us operate, such as payment processors, video hosting, email delivery and analytics tools. Each provider is bound to use your data only for the service they perform for us.',
      'We may also disclose information if required by law or to protect the rights and safety of our users.',
    ],
  },
  {
    id: 'retention',
    title: 'How long we keep your data',
    body: [
      'We keep your account and learning history while your account is active. If you delete your account, we remove your personal data within 30 days, except records we must keep for tax, accounting or legal reasons.',
    ],
  },
  {
    id: 'security',
    title: 'How we protect your data',
    body: [
      'All traffic is encrypted with HTTPS, passwords are hashed, and access to personal data is limited to authorised team members. No system is completely secure, so we also recommend using a strong, unique password.',
    ],
  },
  {
    id: 'rights',
    title: 'Your rights and choices',
    body: ['You are in control of your information. At any time you can:'],
    list: [
      'View and update your profile from account settings.',
      'Request a copy of the personal data we hold about you.',
      'Ask us to correct or delete your data.',
      'Unsubscribe from marketing emails using the link in any message.',
    ],
  },
  {
    id: 'children',
    title: "Children's privacy",
    body: [
      'ClassStream is built for professionals and students aged 16 and over. We do not knowingly collect data from children under 16. If you believe a child has given us personal data, contact us and we will delete it.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: [
      'We may update this policy as the platform grows. When we make significant changes, we will notify you by email or with a notice on the site, and update the date at the top of this page.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: [
      'Questions about your privacy? Email privacy@classstream.com and our team will reply within 5 business days.',
    ],
  },
]

const highlights = [
  { label: 'We never sell your data', icon: '✓' },
  { label: 'Payments handled securely', icon: '✓' },
  { label: 'Delete your account anytime', icon: '✓' },
]

const Privacy = () => {
  const [active, setActive] = useState(sections[0].id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-110px 0px -65% 0px', threshold: 0 }
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const goTo = (e, id) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActive(id)
  }

  return (
    <div className="pv-page">
      {/* Hero */}
      <header className="pv-hero">
        <span className="pv-badge">Your privacy matters</span>
        <h1 className="pv-title">Privacy Policy</h1>
        <p className="pv-subtitle">
          Here is what ClassStream collects when you learn with us, why we collect it,
          and the choices you have.
        </p>


        <div className="pv-highlights">
          {highlights.map((h) => (
            <span className="pv-pill" key={h.label}>
              <span className="pv-pill-icon">{h.icon}</span>
              {h.label}
            </span>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="pv-layout">
        <aside className="pv-toc" aria-label="Table of contents">
          <p className="pv-toc-title">On this page</p>
          <nav>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => goTo(e, s.id)}
                className={`pv-toc-link ${active === s.id ? 'is-active' : ''}`}
                aria-current={active === s.id ? 'true' : undefined}
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="pv-content">
          {sections.map((s) => (
            <section className="pv-card" id={s.id} key={s.id}>
              <h2 className="pv-card-title">{s.title}</h2>
              {s.body.map((p, i) => (
                <p className="pv-text" key={i}>
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="pv-list">
                  {s.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </main>

      {/* CTA */}
      <section className="pv-cta">
        <div className="pv-cta-inner">
          <h2 className="pv-cta-title">Learn with confidence</h2>
          <p className="pv-cta-text">
            Your data stays yours. Start streaming courses built for working developers.
          </p>
          <div className="pv-cta-actions">
            <a href="/register" className="pv-btn pv-btn-light">
              Create Free Account
            </a>
            <a href="/courses" className="pv-btn pv-btn-ghost">
              Browse Catalog <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Privacy
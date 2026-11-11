import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import portraitUrl from './assets/speaking-podium.jpg'
import {
  achievements,
  bentoStack,
  campus,
  education,
  experience,
  links,
  profile,
  projects,
  sideAssignment,
  skills,
  socials,
  updates,
} from './content.ts'

const nav = [
  { href: '#work', id: 'work', label: 'Work' },
  { href: '#about', id: 'about', label: 'About' },
  { href: '#experience', id: 'experience', label: 'Experience' },
  { href: '#notes', id: 'notes', label: 'Notes' },
  { href: '#contact', id: 'contact', label: 'Contact' },
]

function useIstClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function formatIst(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '00'
  const hour = Number(pick('hour'))
  const band =
    hour >= 5 && hour < 12
      ? 'Morning, IST'
      : hour >= 12 && hour < 17
        ? 'Afternoon, IST'
        : hour >= 17 && hour < 22
          ? 'Evening, IST'
          : 'Late, IST'
  return { hh: pick('hour'), mm: pick('minute'), ss: pick('second'), band }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])
  return reduced
}

function useCanTrackPointer() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)')
    const apply = () => setOk(!coarse.matches)
    apply()
    coarse.addEventListener('change', apply)
    return () => coarse.removeEventListener('change', apply)
  }, [])
  return ok
}

function HeroName() {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion()
  const canTrack = useCanTrackPointer()

  useEffect(() => {
    const root = ref.current
    if (!root || reduced || !canTrack) return
    const letters = [...root.querySelectorAll<HTMLElement>('[data-letter]')]
    let frame = 0
    const weights = new Map<HTMLElement, number>()
    const widths = new Map<HTMLElement, number>()

    const paint = (x: number, y: number) => {
      for (const el of letters) {
        const box = el.getBoundingClientRect()
        const dx = x - (box.left + box.width / 2)
        const dy = y - (box.top + box.height / 2)
        const influence = Math.max(0, 1 - Math.hypot(dx, dy) / 280)
        const targetW = 780 - influence * 540
        const targetD = 100 - influence * 32
        const prevW = weights.get(el) ?? 780
        const prevD = widths.get(el) ?? 100
        const nextW = prevW + (targetW - prevW) * 0.35
        const nextD = prevD + (targetD - prevD) * 0.35
        weights.set(el, nextW)
        widths.set(el, nextD)
        el.style.fontVariationSettings = `"wght" ${nextW.toFixed(1)}, "wdth" ${nextD.toFixed(1)}, "opsz" 144`
      }
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') return
      if (frame) cancelAnimationFrame(frame)
      const x = event.clientX
      const y = event.clientY
      frame = requestAnimationFrame(() => {
        frame = 0
        paint(x, y)
      })
    }

    const reset = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        frame = 0
        paint(-9999, -9999)
      })
    }

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('mouseleave', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', reset)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [reduced, canTrack])

  const renderWord = (word: string) => (
    <span className="hero-word" aria-hidden="true">
      {[...word].map((letter, index) => (
        <span className="hero-letter" data-letter="" key={`${word}-${index}`}>
          {letter}
        </span>
      ))}
    </span>
  )

  return (
    <h1 id="hero-name" className="hero-name" ref={ref} aria-label={profile.name}>
      {renderWord(profile.first)}
      {renderWord(profile.last)}
    </h1>
  )
}

function ClockFace({ large = false }: { large?: boolean }) {
  const now = useIstClock()
  const time = formatIst(now)
  const label = `${time.hh}:${time.mm}:${time.ss} India Standard Time`
  if (!large) {
    return <span className="footer-clock">{label}</span>
  }
  return (
    <div className="tile tile-clock">
      <p className="tile-kicker clock-row">
        <span className="dot" aria-hidden="true" />
        Local time · IST
      </p>
      <p className="clock-time" aria-label={label}>
        <span aria-hidden="true">
          {time.hh}:{time.mm}
          <span className="clock-sec">:{time.ss}</span>
        </span>
      </p>
      <p className="clock-place">
        {time.band}
        <br />
        {profile.locationShort}
      </p>
    </div>
  )
}

function AboutCopy() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    if (reduced) return
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setOn(true)
      },
      { threshold: 0.25 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reduced])

  const words = profile.about.split(' ')
  return (
    <p
      ref={ref}
      className={reduced ? 'about-copy' : `about-copy reveal${on ? ' is-on' : ''}`}
    >
      {words.map((word, index) => (
        <span className="word" style={{ ['--i' as string]: index }} key={`${word}-${index}`}>
          {word}
          {index < words.length - 1 ? '\u00a0' : ''}
        </span>
      ))}
    </p>
  )
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')
  const [openProject, setOpenProject] = useState<string>('finvault')
  const [tab, setTab] = useState<'internships' | 'campus' | 'education'>('internships')

  useEffect(() => {
    const nodes = nav
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node))
    const seen = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) seen.set(entry.target.id, entry.intersectionRatio)
          else seen.delete(entry.target.id)
        }
        const current = [...seen.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? ''
        setActive(current)
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('bk-theme', next)
  }

  const onMail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()
    const subject = name ? `Note from ${name}` : 'Note via the portfolio'
    const body = [message, email ? `Reply to: ${email}` : ''].filter(Boolean).join('\n\n')
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="hairline" />
      <header className="site-header">
        <div className="wrap nav">
          <a className="brand" href="#top">
            <span className="mark" aria-hidden="true">
              B
            </span>
            bhavesh.khaple
          </a>
          <nav id="primary-nav" className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.id}
                href={item.href}
                aria-current={active === item.id ? 'true' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <a className="btn btn-primary nav-email" href={links.email}>
              Email
            </a>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={menuOpen}
              aria-controls="primary-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero wrap" id="top" aria-labelledby="hero-name">
          <p className="eyebrow">
            <span>Portfolio · 2026</span>
            <span>AI & Data Science</span>
            <span>{profile.locationShort}</span>
          </p>
          <HeroName />
          <p className="hero-copy">{profile.tagline}</p>
          <p className="hero-meta-line">{profile.availability}</p>
          <a className="scroll-link" href="#now">
            Scroll to the live tiles
          </a>
        </section>

        <section className="section" id="now" aria-label="Now">
          <div className="wrap bento">
            <article className="tile tile-intro">
              <p className="tile-kicker">{profile.headline}</p>
              <h2>{profile.intro}</h2>
              <p>
                Most of my time goes into retrieval systems: parsing messy documents, tuning
                chunking and reranking, and writing the benchmark before I believe a number.
              </p>
              <div className="tile-actions">
                <a className="btn btn-primary" href="#work">
                  See the work
                </a>
                <a className="btn btn-ghost" href="#contact">
                  Say hello
                </a>
              </div>
            </article>

            <article className="tile tile-photo">
              <img
                src={portraitUrl}
                alt="Bhavesh Khaple speaking at a wooden podium, in a white shirt, with a microphone in front of him."
              />
              <div className="photo-cap">
                <strong>{profile.name}</strong>
                <span>Speaking at a podium</span>
              </div>
            </article>

            <ClockFace large />

            <article className="tile tile-win">
              <p className="tile-kicker">Feb 2025</p>
              <strong>MGM Glitch & Fix</strong>
              <p>Winner of the hackathon.</p>
            </article>

            <article className="tile tile-now">
              <p className="tile-kicker">What I'm building now</p>
              <h3>FinVault AI</h3>
              <p>
                Offline document-audit assistant for auditors. The first Report Shield caught 1
                of 13 planted errors on a real audit report, so v2 is being rebuilt against a
                ground-truth corpus. 116 tests are passing.
              </p>
            </article>

            <article className="tile tile-cgpa">
              <p className="tile-kicker">B.Tech AI & DS (Honors)</p>
              <span className="stat-num">8.87</span>
              <p>CGPA out of 10. Graduating March 2027.</p>
            </article>

            <article className="tile tile-upcoming">
              <p className="tile-kicker">Upcoming · remote</p>
              <h3>CRHDRI</h3>
              <p>
                AI/ML intern from Dec 2026. The exact start date is still being confirmed with
                HR.
              </p>
            </article>

            <article className="tile tile-links">
              <p className="tile-kicker">Elsewhere</p>
              <div className="link-row">
                {socials.map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                  </a>
                ))}
              </div>
            </article>

            <article className="tile tile-stack">
              <p className="tile-kicker">Often in the stack</p>
              <div className="chips">
                {bentoStack.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <a className="stack-more" href="#skills">
                Full skill list
              </a>
            </article>
          </div>
        </section>

        <section className="section" id="work" aria-labelledby="work-title">
          <div className="wrap">
            <div className="section-head">
              <h2 id="work-title">
                Selected work
                <span className="count">{projects.length}</span>
              </h2>
              <p>Final-year FinVault AI leads. The chest X-ray model stays in a smaller card below.</p>
            </div>
            <div>
              {projects.map((project, index) => {
                const open = openProject === project.id
                const panelId = `${project.id}-panel`
                return (
                  <article className="project" key={project.id}>
                    <button
                      type="button"
                      className="project-btn"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenProject(open ? '' : project.id)}
                    >
                      <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
                      <span>
                        <span className="project-name">{project.name}</span>
                        <span className="project-stack">{project.stack.join(' · ')}</span>
                      </span>
                      <span className={project.featured ? 'pill featured' : 'pill'}>
                        {project.featured ? 'Featured' : project.status}
                      </span>
                    </button>
                    {open ? (
                      <div className="project-panel" id={panelId}>
                        <p className="role">{project.role ? `${project.role} · ${project.status}` : project.status}</p>
                        <p>{project.summary}</p>
                        {project.highlights ? (
                          <ul>
                            {project.highlights.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        ) : null}
                        {project.caveat ? (
                          <div className="caveat">
                            <strong>How to read the numbers</strong>
                            <span>{project.caveat}</span>
                          </div>
                        ) : null}
                        <a className="repo-link" href={project.repo}>
                          View repository
                        </a>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>

            <article className="proof">
              <p className="tile-kicker">Proof of work · side assignment</p>
              <h3>{sideAssignment.name}</h3>
              <p>{sideAssignment.summary}</p>
              <div className="chips">
                {sideAssignment.stack.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="proof-links">
                <a href={sideAssignment.repo}>Repository</a>
                <a href={sideAssignment.demo}>Live demo</a>
              </div>
            </article>
            <a className="more-github" href={links.github}>
              More on GitHub
            </a>
          </div>
        </section>

        <section className="section" id="about" aria-labelledby="about-title">
          <div className="wrap about-grid">
            <div>
              <p className="tile-kicker">About</p>
              <h2 id="about-title">I measure a retrieval system before I trust it.</h2>
              <AboutCopy />
            </div>
            <dl className="facts">
              <div>
                <dt>Location</dt>
                <dd>{profile.location}. Remote.</dd>
              </div>
              <div>
                <dt>Education</dt>
                <dd>
                  {education.degree}
                  <br />
                  {education.school}
                  <br />
                  {education.dates} · CGPA {education.cgpa}
                </dd>
              </div>
              <div>
                <dt>Outside code</dt>
                <dd>Service Project Chair, Rotaract Club MIT CSN, 2026 to 27.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="section" id="skills" aria-labelledby="skills-title">
          <div className="wrap">
            <h2 id="skills-title">Skills</h2>
            <div className="cards">
              {skills.map((group) => (
                <article className="card" key={group.group}>
                  <p className="tile-kicker">{group.group}</p>
                  <div className="chips">
                    {group.items.map((item) => (
                      <span className="chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="experience" aria-labelledby="experience-title">
          <div className="wrap">
            <h2 id="experience-title">Experience</h2>
            <div className="tabs" role="tablist" aria-label="Experience type">
              {(
                [
                  ['internships', 'Internships', experience.length],
                  ['campus', 'Campus', campus.length],
                  ['education', 'Education', 1],
                ] as const
              ).map(([id, label, count]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`${id}-tab`}
                  aria-selected={tab === id}
                  aria-controls={`${id}-panel`}
                  onClick={() => setTab(id)}
                >
                  {label}
                  <span className="tab-count">{count}</span>
                </button>
              ))}
            </div>

            {tab === 'internships' ? (
              <div className="cards" role="tabpanel" id="internships-panel" aria-labelledby="internships-tab">
                {experience.map((job) => (
                  <article className="card" key={job.id}>
                    <div className="card-top">
                      <span>{job.mode}</span>
                      <span className={'upcoming' in job && job.upcoming ? 'upcoming-flag' : undefined}>{job.dates}</span>
                    </div>
                    <h3>{job.title}</h3>
                    <p className="org">{job.org}</p>
                    {'note' in job && job.note ? <p className="job-note">{job.note}</p> : null}
                    {'bullets' in job && job.bullets ? (
                      <ul>
                        {job.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : null}

            {tab === 'campus' ? (
              <div className="cards" role="tabpanel" id="campus-panel" aria-labelledby="campus-tab">
                {campus.map((role) => (
                  <article className="card" key={role.title}>
                    <div className="card-top">
                      <span>Campus</span>
                      <span>{role.dates}</span>
                    </div>
                    <h3>{role.title}</h3>
                  </article>
                ))}
              </div>
            ) : null}

            {tab === 'education' ? (
              <div className="cards" role="tabpanel" id="education-panel" aria-labelledby="education-tab">
                <article className="card">
                  <div className="card-top">
                    <span>Honors</span>
                    <span>{education.dates}</span>
                  </div>
                  <h3>{education.degree}</h3>
                  <p className="org">{education.school}</p>
                  <p className="note">CGPA {education.cgpa}</p>
                </article>
              </div>
            ) : null}

            <div className="record">
              <h3>On record</h3>
              <div className="record-grid">
                {achievements.map((item) => (
                  <article key={item.title}>
                    <strong>{item.title}</strong>
                    {item.date ? <span>{item.date}</span> : null}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="notes" aria-labelledby="notes-title">
          <div className="wrap">
            <div className="notes-head">
              <div>
                <h2 id="notes-title">Notes</h2>
                <p>A short log of the work above, newest first.</p>
              </div>
              <a href={links.medium}>Open Medium</a>
            </div>
            <div className="note-list">
              {updates.map((item) => {
                const inner = (
                  <>
                    <div>
                      <time>{item.date}</time>
                      <span className="kicker">{item.kicker}</span>
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </>
                )
                return item.href ? (
                  <a className="note" href={item.href} key={item.title}>
                    {inner}
                  </a>
                ) : (
                  <article className="note" key={item.title}>
                    {inner}
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section" id="contact" aria-labelledby="contact-title">
          <div className="wrap contact-grid">
            <div>
              <h2 id="contact-title">
                <a className="talk" href={links.email}>
                  Write to me.
                </a>
              </h2>
              <dl className="contact-facts">
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={links.email}>{profile.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Based in</dt>
                  <dd>{profile.location} · remote</dd>
                </div>
                <div>
                  <dt>Internships</dt>
                  <dd>{profile.availability}</dd>
                </div>
                <div>
                  <dt>Next role</dt>
                  <dd>{profile.upcoming}</dd>
                </div>
              </dl>
            </div>
            <form onSubmit={onMail}>
              <label>
                Name
                <input name="name" autoComplete="name" />
              </label>
              <label>
                Email
                <input name="email" type="email" autoComplete="email" />
              </label>
              <label>
                Message
                <textarea name="message" required />
              </label>
              <button className="btn btn-primary" type="submit">
                Open in email
              </button>
              <p className="form-note">
                This opens your email app with the note filled in. The page does not store it.
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-row">
          <span>© 2026 {profile.name}</span>
          <ClockFace />
          <nav aria-label="Social">
            {socials.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a href="#top">Back to top</a>
        </div>
      </footer>
    </>
  )
}

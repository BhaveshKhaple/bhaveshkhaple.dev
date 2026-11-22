import { useEffect, useRef, useState } from 'react'
import type { FormEvent, PointerEvent as ReactPointerEvent } from 'react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import portraitUrl from './assets/speaking-podium.jpg'
import {
  achievements,
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

const ease = [0.2, 0.8, 0.2, 1] as const
const tones = ['cover-accent', 'cover-inverse', 'cover-plain'] as const

const nav = [
  { href: '#projects', id: 'projects', label: 'Work' },
  { href: '#about', id: 'about', label: 'About' },
  { href: '#experience', id: 'experience', label: 'Journey' },
  { href: '#blogs', id: 'blogs', label: 'Writing' },
  { href: '#faq', id: 'faq', label: 'FAQ' },
  { href: '#contact', id: 'contact', label: 'Contact' },
]

type WorkItem = {
  id: string
  title: string
  stack: string[]
  cat: string
  featured?: boolean
  summary: string
  extra?: string[]
  repo: string
  demo?: string
  demoVideo?: {
    id: string
    title: string
    href: string
  }
}

const work: WorkItem[] = [
  ...projects.map((project) => ({
    id: project.id,
    title: project.name,
    stack: project.stack,
    cat: project.id === 'finvault' ? 'Audit' : project.id === 'saferide' ? 'IoT' : project.id === 'skills' ? 'Agents' : 'RAG',
    featured: project.featured,
    summary: project.summary,
    extra: [...(project.role ? [project.role] : []), ...(project.highlights ?? []), ...(project.caveat ? [project.caveat] : [])],
    repo: project.repo,
    demoVideo: project.demoVideo,
  })),
  {
    id: 'xray',
    title: sideAssignment.name,
    stack: [...sideAssignment.stack],
    cat: 'Side',
    summary: sideAssignment.summary,
    repo: sideAssignment.repo,
    demo: sideAssignment.demo,
  },
]

const stackChips = skills.flatMap((group) => group.items)

function useIst() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const pick = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? '00'
  return { hm: `${pick('hour')}:${pick('minute')}`, s: pick('second'), hour: Number(pick('hour')) }
}

function letterStyle(norm: number, t: number) {
  const influence = norm < 0 ? 0 : Math.max(0, 1 - Math.abs(norm - t) / 0.17)
  return {
    fontWeight: Math.round(800 - 600 * influence),
    fontStretch: `${Math.round(100 - 25 * influence)}%`,
  }
}

function Count({ value, digits = 0 }: { value: number; digits?: number }) {
  const [shown, setShown] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    let frame = 0
    let started = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return
        started = true
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setShown(value)
          return
        }
        const start = performance.now()
        const step = (time: number) => {
          const progress = Math.min(1, (time - start) / 1400)
          setShown(value * (1 - (1 - progress) ** 3))
          if (progress < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
      },
      { threshold: 0.5 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])
  return <span ref={ref}>{digits ? shown.toFixed(digits) : String(Math.round(shown))}</span>
}

function Cover({ index, tone, className = '' }: { index: number; tone: string; className?: string }) {
  return (
    <div className={`pcover ${tone} ${className}`.trim()}>
      <div className="pcover-gen">
        <div className="pcover-top">
          <span>{String(index).padStart(2, '0')}</span>
          <span>Work</span>
        </div>
        <div className="pcover-mono">{String(index).padStart(2, '0')}</div>
      </div>
    </div>
  )
}

function YouTubeFacade({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false)
  const frameRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (playing) frameRef.current?.focus()
  }, [playing])

  return (
    <figure className="ppanel-video" id="finvault-demo">
      <figcaption>{title}</figcaption>
      <div className="yt">
        {playing ? (
          <iframe
            ref={frameRef}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" className="yt-play" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
            <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="" width={480} height={360} decoding="async" />
            <span className="yt-play-btn" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path d="M8.5 6.8v10.4L18 12 8.5 6.8z" fill="currentColor" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </figure>
  )
}

function Plus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function Sun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function Moon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 3a8 8 0 1 0 5 14A8.5 8.5 0 0 1 16 3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const frame = useRef(0)
  const [norm, setNorm] = useState(-1)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-8%'])
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15])
  const words = [profile.first.toUpperCase(), profile.last.toUpperCase()]
  const total = words.join('').length
  let cursor = 0

  return (
    <section className="hero" id="hero" ref={sectionRef} aria-labelledby="hero-name">
      <div className="container">
        <div className="hero-meta eyebrow">
          <span>Portfolio · {new Date().getFullYear()}</span>
          <span>AI & Data Science</span>
          <span>{profile.locationShort}</span>
        </div>
        <motion.div
          className="hero-name-wrap"
          style={{ scale, y, opacity }}
          onPointerMove={(event) => {
            if (event.pointerType !== 'mouse') return
            const box = event.currentTarget.getBoundingClientRect()
            const next = (event.clientX - box.left) / box.width
            cancelAnimationFrame(frame.current)
            frame.current = requestAnimationFrame(() => setNorm(next))
          }}
          onPointerLeave={() => setNorm(-1)}
        >
          <h1 id="hero-name" className="hero-name" aria-label={profile.name}>
            {words.map((word, wordIndex) => (
              <span className="hero-word" aria-hidden="true" key={word}>
                {word.split('').map((letter) => {
                  const index = cursor
                  cursor += 1
                  return (
                    <motion.span
                      className="hero-letter"
                      key={`${word}-${index}`}
                      style={letterStyle(norm, (index + 0.5) / total)}
                      initial={{ opacity: 0, y: '0.35em', filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 0.9, delay: 0.08 + 0.055 * index, ease }}
                    >
                      {letter}
                    </motion.span>
                  )
                })}
                {wordIndex === words.length - 1 ? (
                  <motion.span
                    className="hero-letter hero-dot"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    .
                  </motion.span>
                ) : null}
              </span>
            ))}
          </h1>
        </motion.div>
        <div className="hero-foot">
          <p className="hero-tagline">
            {profile.tagline}
            <span className="hero-hint"> The letters follow the cursor.</span>
          </p>
          <a className="hero-cue eyebrow" href="#glance">
            Scroll
            <span className="hero-cue-line" aria-hidden="true">
              <span />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Bento() {
  const clock = useIst()
  const awake = clock.hour >= 8
  const bentoRef = useRef<HTMLDivElement>(null)
  const [allChips, setAllChips] = useState(false)
  const chips = allChips ? stackChips : stackChips.slice(0, 18)
  return (
    <section className="bento-section" id="glance" aria-label="At a glance">
      <div className="container">
        <motion.div
          ref={bentoRef}
          className="bento"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          onPointerMove={(event) => {
            bentoRef.current?.querySelectorAll<HTMLElement>('.tile').forEach((tile) => {
              const box = tile.getBoundingClientRect()
              tile.style.setProperty('--mx', `${event.clientX - box.left}px`)
              tile.style.setProperty('--my', `${event.clientY - box.top}px`)
            })
          }}
        >
          <motion.div className="tile s2 r2 tile-intro" variants={tileIn} custom={0}>
            <span className="pill">
              <span className="dot" />
              Final-year B.Tech · MIT Aurangabad
            </span>
            <div className="tile-intro-body">
              <h2>
                RAG pipelines, <em>honest evals</em>, and the MLOps glue that keeps them running.
              </h2>
              <p>
                Most of my time goes into retrieval systems: parsing messy documents, tuning chunking and reranking, and writing the benchmark before I believe a number.
              </p>
            </div>
            <div className="tile-actions">
              <a className="btn btn-primary" href="#projects">
                See the work <span aria-hidden="true">↓</span>
              </a>
              <a className="btn btn-secondary" href="#contact">
                Get in touch
              </a>
            </div>
          </motion.div>

          <motion.div className="tile r2 tile-photo" variants={tileIn} custom={1}>
            <img src={portraitUrl} alt="Bhavesh Khaple speaking at a wooden podium, in a white shirt, with a microphone in front of him." />
            <div className="tile-photo-cap">
              <strong>{profile.name}</strong>
              <span>MIT Aurangabad</span>
            </div>
          </motion.div>

          <motion.div className="tile tile-time" variants={tileIn} custom={2}>
            <span className="eyebrow">Local time · IST</span>
            <div className="tile-big tile-clock">
              {clock.hm}
              <span>:{clock.s}</span>
            </div>
            <span className="tile-mood">
              <span className="dot" style={awake ? undefined : { background: 'var(--muted)', animation: 'none' }} />
              {awake ? 'Usually at the desk' : 'Quiet hours in Aurangabad'}
            </span>
          </motion.div>

          <motion.div className="tile tile-stat" variants={tileIn} custom={3}>
            <span className="eyebrow">B.Tech AI & DS</span>
            <div className="tile-big">
              <Count value={8.87} digits={2} />
            </div>
            <span className="tile-stat-foot">
              CGPA out of 10, graduating March 2027
              <span className="bar" aria-hidden="true">
                <span style={{ width: '100%', transform: 'scaleX(0.887)' }} />
              </span>
            </span>
          </motion.div>

          <motion.div className="tile s2 tile-now" variants={tileIn} custom={4}>
            <div className="tile-row-head">
              <span className="eyebrow">Right now</span>
              <span className="eyebrow">1 active</span>
            </div>
            <div className="now-row">
              <span className="now-status lead">Building</span>
              <span className="now-text">
                <strong>FinVault AI</strong>
                <span>
                  Report Shield v2 is being rebuilt after catching 1 of 13 planted errors. 116 tests are passing.
                </span>
              </span>
            </div>
          </motion.div>

          <motion.div className="tile tile-grade" variants={tileIn} custom={5}>
            <div>
              <span className="tile-mid">
                <Count value={2} />
              </span>
              remote internships, SmaranAI and Suvidha
            </div>
            <div>
              <span className="tile-mid">
                <Count value={1} />
              </span>
              hackathon win, MGM Glitch & Fix, Feb 2025
            </div>
          </motion.div>

          <motion.div className="tile tile-social" variants={tileIn} custom={6}>
            <span className="eyebrow">Elsewhere</span>
            <div>
              {socials
                .filter((item) => item.label === 'GitHub' || item.label === 'LinkedIn' || item.label === 'Email')
                .map((item) => (
                  <a key={item.label} href={item.href}>
                    {item.label}
                    <Arrow />
                  </a>
                ))}
            </div>
          </motion.div>

          <motion.div className="tile s3 tile-stack" variants={tileIn} custom={7}>
            <div className="tile-row-head">
              <span className="eyebrow">Stack</span>
              <p className="tile-note">What the projects below were built with.</p>
            </div>
            <div className="tile-chips">
              {chips.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
              {stackChips.length > 18 ? (
                <button type="button" className="chip chip-more" onClick={() => setAllChips((open) => !open)}>
                  {allChips ? 'Show less' : `+${stackChips.length - 18} more`}
                </button>
              ) : null}
            </div>
          </motion.div>

          <motion.a className="tile tile-resume" href={links.email} variants={tileIn} custom={8}>
            <span className="tile-row-head">
              <span className="eyebrow">Email</span>
              <span className="tile-resume-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
            <span className="tile-resume-label">
              Write
              <br />
              to me
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

const tileIn = {
  hidden: { opacity: 0, y: 28 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.05 * index, ease },
  }),
}

function Projects() {
  const [open, setOpen] = useState<string | null>('finvault')
  const [more, setMore] = useState<string | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 260, damping: 28, mass: 0.6 })
  const y = useSpring(my, { stiffness: 260, damping: 28, mass: 0.6 })
  const velocity = useVelocity(x)
  const rotate = useTransform(velocity, [-1500, 0, 1500], [-10, 0, 10])
  const hovered = work.find((item) => item.id === hover)
  const hoverIndex = work.findIndex((item) => item.id === hover)

  return (
    <section className="projects" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-head">
          <motion.h2
            id="projects-title"
            className="display-title"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease }}
          >
            Selected work
            <sup>({work.length})</sup>
          </motion.h2>
        </div>
        <div
          className="plist"
          onPointerMove={(event) => {
            mx.set(event.clientX)
            my.set(event.clientY)
          }}
          onPointerLeave={() => setHover(null)}
        >
          {work.map((item, index) => {
            const isOpen = open === item.id
            const panelId = `project-panel-${item.id}`
            const expanded = more === item.id
            const tools = expanded ? item.stack : item.stack.slice(0, 12)
            return (
              <motion.article
                className={`prow ${isOpen ? 'is-open' : ''}`}
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.06 * Math.min(index, 5), ease }}
              >
                <button
                  type="button"
                  className="phead"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => {
                    setOpen(isOpen ? null : item.id)
                    setMore(null)
                  }}
                  onPointerEnter={(event) => {
                    if (event.pointerType === 'mouse') setHover(item.id)
                  }}
                >
                  <span className="pnum">{String(index + 1).padStart(2, '0')}</span>
                  <span className="pmain">
                    <span className="ptitle">{item.title}</span>
                    <span className="psub">{item.stack.slice(0, 4).join(' · ')}</span>
                  </span>
                  <span className="pcat">
                    {item.cat}
                    {item.featured ? <span className="pstar"> · Featured</span> : null}
                  </span>
                  <span className="pplus" aria-hidden="true">
                    <Plus />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      className="ppanel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease }}
                    >
                      <div className="ppanel-inner">
                        {item.demoVideo ? (
                          <YouTubeFacade videoId={item.demoVideo.id} title={item.demoVideo.title} />
                        ) : (
                          <Cover index={index + 1} tone={tones[index % tones.length]} className="ppanel-cover" />
                        )}
                        <div className="ppanel-body">
                          <p>{item.summary}</p>
                          {item.extra?.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                          <div className="ptech">
                            {tools.map((tool) => (
                              <span className="chip" key={tool}>
                                {tool}
                              </span>
                            ))}
                            {!expanded && item.stack.length > 12 ? (
                              <button type="button" className="chip chip-more" onClick={() => setMore(item.id)}>
                                +{item.stack.length - 12} more
                              </button>
                            ) : null}
                          </div>
                          <div className="plinks">
                            {item.demoVideo ? (
                              <a className="btn btn-solid" href={item.demoVideo.href} target="_blank" rel="noreferrer">
                                Watch demo
                              </a>
                            ) : null}
                            {item.demo ? (
                              <a className="btn btn-solid" href={item.demo} target="_blank" rel="noreferrer">
                                Open live site ↗
                              </a>
                            ) : null}
                            <a className="btn btn-secondary" href={item.repo} target="_blank" rel="noreferrer">
                              Read the code
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            )
          })}
        </div>
        <div className="projects-more">
          <a className="btn btn-secondary" href={links.github} target="_blank" rel="noreferrer">
            More on GitHub
          </a>
        </div>
      </div>
      <motion.div
        className="pfloat"
        aria-hidden="true"
        style={{ x, y, rotate }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
        transition={{ duration: 0.25 }}
      >
        {hovered && hoverIndex >= 0 ? <Cover index={hoverIndex + 1} tone={tones[hoverIndex % tones.length]} /> : null}
      </motion.div>
    </section>
  )
}

function About() {
  const words = profile.about.split(' ')
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-side">
          <div className="about-sticky">
            <span className="eyebrow ink">About</span>
            <h2 id="about-title">
              I measure a retrieval{'\n'}system before I trust it.
            </h2>
          </div>
        </div>
        <div className="about-main">
          <p className="about-copy">
            {words.map((word, index) => (
              <span key={`${word}-${index}`}>
                <span className="about-word">{word}</span>
                {index < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
          <dl className="about-facts">
            <div>
              <dt className="eyebrow">Location</dt>
              <dd>{profile.locationShort}</dd>
            </div>
            <div>
              <dt className="eyebrow">Education</dt>
              <dd>B.Tech AI & DS (Honors)</dd>
            </div>
            <div>
              <dt className="eyebrow">CGPA</dt>
              <dd>{education.cgpa}</dd>
            </div>
            <div>
              <dt className="eyebrow">Graduating</dt>
              <dd>March 2027</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}

function Journey() {
  const [tab, setTab] = useState<'internships' | 'campus' | 'education'>('internships')
  const tabs = [
    ['internships', 'Internships', experience.length],
    ['campus', 'Campus', campus.length],
    ['education', 'Education', 1],
  ] as const
  return (
    <section className="journey" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head">
          <h2 id="experience-title" className="display-title">
            Journey
          </h2>
          <div className="seg" role="tablist" aria-label="Experience type">
            {tabs.map(([id, label, count]) => (
              <button
                key={id}
                type="button"
                role="tab"
                className={`seg-btn journey-tab ${tab === id ? 'active' : ''}`}
                aria-selected={tab === id}
                onClick={() => setTab(id)}
              >
                {tab === id ? (
                  <motion.span
                    className="journey-pill"
                    layoutId="journey-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="journey-tab-label">
                  {label}
                  <span className="count">{count}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="tickets-list">
          {tab === 'internships'
            ? experience.map((job) => (
                <article className="ticket" key={job.id}>
                  <div className="ticket-stub">
                    <div className="ticket-stub-top">
                      <span className="ticket-logo ticket-logo-gen">{job.org.slice(0, 1)}</span>
                      <span className="eyebrow">{job.mode}</span>
                    </div>
                    <span className="ticket-period">{job.dates}</span>
                  </div>
                  <div className="ticket-main">
                    <h3>{job.title}</h3>
                    <p className="ticket-org">{job.org}</p>
                    {'note' in job && typeof job.note === 'string' ? (
                      <p className="ticket-desc">{job.note}</p>
                    ) : null}
                    {'bullets' in job && job.bullets ? (
                      <ul>
                        {job.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </article>
              ))
            : null}
          {tab === 'campus'
            ? campus.map((role) => (
                <article className="ticket" key={role.title}>
                  <div className="ticket-stub">
                    <div className="ticket-stub-top">
                      <span className="ticket-logo ticket-logo-gen">{role.title.slice(0, 1)}</span>
                      <span className="eyebrow">Campus</span>
                    </div>
                    <span className="ticket-period">{role.dates}</span>
                  </div>
                  <div className="ticket-main">
                    <h3>{role.title}</h3>
                  </div>
                </article>
              ))
            : null}
          {tab === 'education' ? (
            <article className="ticket">
              <div className="ticket-stub">
                <div className="ticket-stub-top">
                  <span className="ticket-logo ticket-logo-gen">M</span>
                  <span className="eyebrow">Honors</span>
                </div>
                <span className="ticket-period">{education.dates}</span>
              </div>
              <div className="ticket-main">
                <h3>{education.degree}</h3>
                <p className="ticket-org">{education.school}</p>
                <p className="ticket-desc">CGPA {education.cgpa}</p>
              </div>
            </article>
          ) : null}
        </div>
        <div className="record-row">
          {achievements.map((item) => (
            <p key={item.title}>
              <strong>{item.title}</strong>
              {item.date ? ` · ${item.date}` : ''}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

function Writing() {
  return (
    <section className="writing" id="blogs" aria-labelledby="blogs-title">
      <div className="container">
        <div className="section-head">
          <h2 id="blogs-title" className="display-title">
            Writing
          </h2>
          <p className="writing-note">A short log of the work above, newest first.</p>
        </div>
        <div className="wgrid is-preview">
          {updates.map((item, index) => {
            const card = (
              <>
                <div className="wcover">
                  <div className="wcover-gen">{item.kicker}</div>
                </div>
                <div className="wbody">
                  <div className="wtags">
                    <span>#{item.kicker}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <div className="wmeta">
                    <span>{item.date}</span>
                    <span className="warrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </div>
              </>
            )
            const className = `wcard ${index === 0 ? 'wbig' : ''}`
            return item.href ? (
              <a className={className} href={item.href} key={item.title} target="_blank" rel="noreferrer">
                {card}
              </a>
            ) : (
              <article className={className} key={item.title}>
                {card}
              </article>
            )
          })}
          <a className="wsub" href={links.medium} target="_blank" rel="noreferrer">
            <div>
              <p className="eyebrow">Medium</p>
              <p className="wsub-title">Longer notes sit on Medium.</p>
            </div>
            <span className="btn btn-primary">Open Medium</span>
          </a>
        </div>
      </div>
    </section>
  )
}

const faqs = [
  {
    q: 'Who are you?',
    a: profile.about,
  },
  {
    q: 'What kind of internship are you open to?',
    a: profile.availability,
  },
  {
    q: 'What is FinVault AI?',
    a: 'Offline, evidence-first document-audit assistant for auditors and assistant CAs. I lead it as the final-year major project. Recall@5 of 95.7% is on 23 queries over 10 synthetic English PDFs, with 100% refusal on out-of-scope questions. Real-world messy PDFs, OCR, and multilingual documents are not tested yet. The first Report Shield caught 1 of 13 planted errors on a real audit report. v2 is being rebuilt against a ground-truth corpus, with 116 tests passing.',
  },
  {
    q: 'Where are you based, and when do you graduate?',
    a: `${profile.location}. ${education.degree}, ${education.dates}, CGPA ${education.cgpa}. ${profile.upcoming}`,
  },
  {
    q: 'How do I reach you?',
    a: `Email ${profile.email}. GitHub, LinkedIn, X, and Medium are linked in the footer.`,
  },
]

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="container faq-grid">
        <div className="faq-side">
          <h2 id="faq-title" className="display-title">
            FAQ
          </h2>
          <p>Answers from the same notes as the rest of the page.</p>
        </div>
        <div className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = open === index
            return (
              <div className={`faq-item ${isOpen ? 'open' : ''}`} key={item.q}>
                <h3 className="faq-question-heading">
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                  >
                    {item.q}
                    <span className="faq-icon" aria-hidden="true">
                      <Plus />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      className="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 220, damping: 18 })
  const y = useSpring(my, { stiffness: 220, damping: 18 })
  const [status, setStatus] = useState('')

  const onMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const box = event.currentTarget.getBoundingClientRect()
    mx.set(0.3 * (event.clientX - box.left - box.width / 2))
    my.set(0.3 * (event.clientY - box.top - box.height / 2))
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const subject = String(data.get('subject') || '').trim() || (name ? `Note from ${name}` : 'Note via the portfolio')
    const message = String(data.get('message') || '').trim()
    const body = [message, email ? `Reply to: ${email}` : ''].filter(Boolean).join('\n\n')
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus('Opened in your email app. This page does not store the note.')
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <motion.a
          id="contact-title"
          className="talk"
          href={links.email}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease }}
        >
          Write to me<span className="talk-dot">.</span>
        </motion.a>
        <div className="contact-body">
          <div className="contact-side">
            <div
              className="magnet-zone"
              onPointerMove={onMove}
              onPointerLeave={() => {
                mx.set(0)
                my.set(0)
              }}
            >
              <motion.a className="magnet" href={links.email} style={{ x, y }}>
                Write to me
                <span>opens your mail app</span>
              </motion.a>
            </div>
            <dl className="contact-facts">
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={links.email}>{profile.email}</a>
                </dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt>Internships</dt>
                <dd>{profile.availability}</dd>
              </div>
            </dl>
          </div>
          <form className="contact-form" onSubmit={onSubmit}>
            <label>
              Name
              <input name="name" autoComplete="name" />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" />
            </label>
            <label className="full">
              Subject
              <input name="subject" />
            </label>
            <label className="full">
              Message
              <textarea name="message" required rows={5} />
            </label>
            <button className="btn btn-solid full" type="submit">
              Open in email
            </button>
            <p className={`form-status ${status ? 'success' : ''}`}>{status}</p>
          </form>
        </div>
      </div>
    </section>
  )
}

function Shell() {
  const clock = useIst()
  const [theme, setTheme] = useState<'dark' | 'light'>(() =>
    document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
  )
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('')
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })

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
        setActive([...seen.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '')
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.3] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const applyTheme = (next: 'dark' | 'light') => {
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#f3f2ec' : '#000000')
    setTheme(next)
  }

  const onTheme = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const next = theme === 'dark' ? 'light' : 'dark'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = document.startViewTransition?.bind(document)
    if (!start || reduced) {
      applyTheme(next)
      return
    }
    const box = event.currentTarget.getBoundingClientRect()
    document.documentElement.style.setProperty('--vt-x', `${box.left + box.width / 2}px`)
    document.documentElement.style.setProperty('--vt-y', `${box.top + box.height / 2}px`)
    start(() => applyTheme(next))
  }

  return (
    <>
      <a className="visually-hidden" href="#main">
        Skip to main content
      </a>
      <motion.div className="read-progress" style={{ scaleX }} />
      <div className="grain" aria-hidden="true" />
      <header className="nav">
        <div className="nav-inner">
          <a className="nav-logo" href="#hero">
            <span className="nav-logo-mark">B</span>
            bhavesh.khaple
          </a>
          <nav className="nav-links" aria-label="Primary">
            {nav.map((item) => (
              <a key={item.id} className={`nav-link ${active === item.id ? 'active' : ''}`} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              type="button"
              className="theme-toggle"
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              onClick={onTheme}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </button>
            <a className="btn btn-solid nav-resume" href={links.email}>
              Email
            </a>
            <button type="button" className="nav-burger" aria-expanded={menu} aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu((open) => !open)}>
              {menu ? '×' : '☰'}
            </button>
          </div>
        </div>
      </header>
      {menu ? (
        <nav className="nav-sheet" aria-label="Mobile">
          {nav.map((item) => (
            <a key={item.id} className={`nav-sheet-link ${active === item.id ? 'active' : ''}`} href={item.href} onClick={() => setMenu(false)}>
              {item.label}
            </a>
          ))}
          <a className="btn btn-solid nav-sheet-resume" href={links.email}>
            Email
          </a>
        </nav>
      ) : null}
      <main id="main">
        <Hero />
        <Bento />
        <Projects />
        <About />
        <Journey />
        <Writing />
        <Faq />
        <Contact />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>
            {profile.locationShort} · {clock.hm}:{clock.s} IST
          </span>
          <nav className="footer-links" aria-label="Social">
            {socials.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <a href="#hero">Back to top ↑</a>
        </div>
      </footer>
      <button type="button" className="scroll-to-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </button>
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Shell />
    </MotionConfig>
  )
}

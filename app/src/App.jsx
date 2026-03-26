import { useState, useEffect, useRef, useCallback } from 'react'
import { AlertTriangle, RefreshCw, Zap, Terminal, GitBranch, Activity, Skull, ChevronRight } from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const EXCUSES = [
  "A squirrel chewed through the fiber cable in AWS us-east-1",
  "The intern ran rm -rf / thinking it was a meme",
  "Mercury is in retrograde and it corrupted the Kubernetes pods",
  "A cosmic ray flipped a bit in production at 3:47am",
  "The senior dev's rubber duck achieved sentience and unplugged the server",
  "Someone deployed on a Friday. Again.",
  "The load balancer is going through an existential crisis",
  "A butterfly flapped its wings in Tokyo, cascaded to our Redis cluster",
  "The on-call engineer 'forgot' to add monitoring. Surprising no one.",
  "Docker said it works on my machine™ and technically it does. My machine is down.",
  "The database is emotionally unavailable right now",
  "Jenkins had a nightmare about unit tests and refused to wake up",
  "A rogue Terraform plan achieved self-awareness and deleted itself",
  "The cloud provider ran out of cloud. No, seriously.",
  "A senior engineer 'optimized' a critical query at 4:59pm on Friday",
  "The microservices started gossiping and caused a cascading divorce",
  "git force push to main. The commit message was 'trust me'",
  "The monitoring system is down so technically there are zero incidents",
  "An AI assistant confidently refactored the auth service into oblivion",
  "The SLA says 99.9% uptime. This is the 0.1%. You're welcome.",
  "We pivoted to blockchain. The blockchain pivoted away from us.",
  "The staging environment worked perfectly. Production disagreed.",
  "An intern clicked 'Delete All' thinking it was 'Select All'",
  "The Kubernetes cluster achieved nirvana and decided to not schedule pods anymore",
  "Someone pushed a .env file to GitHub. AWS emailed us before we noticed.",
  "The CI pipeline is sentient and it's on strike for better test coverage",
  "JIRA ticket status: 'In Progress' since 2019",
]

const TEAMS = [
  { name: 'Frontend', color: '#00ccff', accusation: 'blamed CSS for a backend timeout. Somehow correct.' },
  { name: 'Backend', color: '#ff6600', accusation: 'said "that\'s an API contract issue" for 3 hours. It was their API.' },
  { name: 'DevOps', color: '#00ff41', accusation: 'deployed a fix that fixed the fix that broke the fix' },
  { name: 'QA', color: '#ff00ff', accusation: 'approved the PR with "LGTM" while on vacation in Bali' },
  { name: 'Product', color: '#ffff00', accusation: 'added a last-minute requirement 10 minutes before launch' },
  { name: 'The Cloud™', color: '#ff4444', accusation: 'had scheduled maintenance. At peak traffic. On launch day.' },
]

const PIPELINE_STAGES = ['Build', 'Test', 'Lint', 'Security Scan', 'Deploy', 'Pray 🙏']

const PASS_LOGS = [
  '✓ npm install completed (only 847 warnings)',
  '✓ All 3 unit tests passed (coverage: 2.3%)',
  '✓ TypeScript compiled (with --strict disabled)',
  '✓ ESLint: 0 errors (rules disabled: 47)',
  '✓ Bundle size: 47MB (that\'s fine, right?)',
  '✓ Docker image built: my-app:latest-final-v2-REAL',
  '✓ Secrets not committed (this time)',
  '✓ Health check responded HTTP 200 from /healthz',
  '✓ Kubernetes pods: 3/3 Running (for now)',
  '✓ Zero critical CVEs (we ignore informational ones)',
]

const FAIL_LOGS = [
  '[ERROR] Coffee level too low in engineer. Aborting.',
  '[FATAL] git blame points to someone who left in 2018',
  '[ERROR] NullPointerException in module we don\'t own and can\'t touch',
  '[CRITICAL] The TODO comment from 2021 finally collapsed',
  '[FATAL] Cannot read properties of undefined (reading \'undefined\')',
  '[ERROR] Dependency "leftpad" yanked from npm. Again.',
  '[PANIC] Terraform state file corrupted. Praying to HashiCorp.',
  '[ERROR] SSL certificate expired 3 weeks ago. Nobody noticed.',
  '[FATAL] Production database and staging database have swapped',
  '[ERROR] The fix for the fix introduced a new bug in the original fix',
  '[CRITICAL] Stack overflow in the stack overflow handler',
  '[ERROR] rm -rf executed in wrong directory. See you in 2 weeks.',
  '[FATAL] Tried to hotfix in prod. Now on-call pager is on fire.',
  '[ERROR] CORS policy: rejected. Reason: always.',
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const randBool = (p = 0.5) => Math.random() < p

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, subtitle, color = 'green' }) {
  const colorMap = {
    green: 'text-[#00ff41] terminal-glow',
    amber: 'text-[#ffb000] amber-glow',
    red: 'text-[#ff4444] red-glow',
  }
  return (
    <div className="flex items-center gap-3 mb-4">
      <Icon size={20} className={colorMap[color]} />
      <div>
        <h2 className={`font-mono font-bold text-lg ${colorMap[color]}`}>{title}</h2>
        {subtitle && <p className="text-xs text-[#00ff4188] font-mono">{subtitle}</p>}
      </div>
    </div>
  )
}

// ─── FEATURE 1: INCIDENT EXCUSE GENERATOR ────────────────────────────────────

function ExcuseGenerator() {
  const [excuse, setExcuse] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [displayed, setDisplayed] = useState('')
  const [shake, setShake] = useState(false)

  const generate = () => {
    const next = rand(EXCUSES)
    setExcuse(next)
    setDisplayed('')
    setIsTyping(true)
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  useEffect(() => {
    if (!isTyping || !excuse) return
    let i = 0
    const iv = setInterval(() => {
      setDisplayed(excuse.slice(0, i + 1))
      i++
      if (i >= excuse.length) {
        clearInterval(iv)
        setIsTyping(false)
      }
    }, 22)
    return () => clearInterval(iv)
  }, [excuse, isTyping])

  return (
    <div className="panel-glow rounded-lg p-5 bg-[#0d1a0d] h-full flex flex-col">
      <SectionHeader icon={AlertTriangle} title="Incident Excuse Generator" subtitle="// blame_deflector.sh v6.6.6" color="red" />

      <button
        onClick={generate}
        className={`
          w-full py-4 px-6 rounded font-mono font-bold text-base mb-5 cursor-pointer
          bg-[#ff000022] border-2 border-[#ff4444] text-[#ff6666] red-glow
          hover:bg-[#ff000044] hover:border-[#ff6666] active:scale-95
          transition-all duration-150 select-none
          ${shake ? 'animate-[wiggle_0.5s_ease-in-out]' : ''}
        `}
        style={{
          boxShadow: '0 0 24px #ff000044, inset 0 0 24px #ff00001a',
          textShadow: '0 0 8px #ff4444, 0 0 16px #ff4444',
        }}
      >
        🔥 PRODUCTION IS DOWN! GENERATE EXCUSE
      </button>

      <div className="flex-1 bg-[#060f06] rounded border border-[#00ff4122] p-4 min-h-[100px] flex items-start">
        {excuse ? (
          <div className="font-mono text-sm text-[#00ff41] leading-relaxed">
            <span className="text-[#ffb000]">$</span>{' '}
            <span className="text-[#00ccff]">./generate-excuse.sh</span>
            <br />
            <span className="text-[#00ff4188]">──────────────────────────────────</span>
            <br />
            <span className="terminal-glow">
              {displayed}
              {isTyping && <span className="animate-[blink_0.7s_step-end_infinite]">█</span>}
            </span>
          </div>
        ) : (
          <p className="text-[#00ff4144] font-mono text-sm italic">
            {'>'} Awaiting catastrophic failure... <span className="animate-[blink_1s_step-end_infinite]">█</span>
          </p>
        )}
      </div>

      <div className="mt-3 text-xs text-[#00ff4155] font-mono">
        <span className="text-[#ffb000]">NOTE:</span> Using this excuse more than twice per incident may result in a PIP.
      </div>
    </div>
  )
}

// ─── FEATURE 2: BLAME-O-METER ─────────────────────────────────────────────────

function BlameMeter() {
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState(null)
  const [rotation, setRotation] = useState(0)
  const [bars, setBars] = useState(TEAMS.map(() => 0))
  const [animKey, setAnimKey] = useState(0)
  const totalRef = useRef(0)

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setWinner(null)

    const winnerIdx = randInt(0, TEAMS.length - 1)
    const extraSpins = randInt(5, 10)
    const segmentAngle = 360 / TEAMS.length
    const targetAngle = 360 * extraSpins + segmentAngle * winnerIdx + segmentAngle / 2
    totalRef.current += targetAngle
    setRotation(totalRef.current)

    // animate bars randomly, increasing winner at end
    const newBars = TEAMS.map((_, i) => (i === winnerIdx ? randInt(70, 95) : randInt(10, 60)))
    setBars(newBars)
    setAnimKey(k => k + 1)

    setTimeout(() => {
      setSpinning(false)
      setWinner(TEAMS[winnerIdx])
    }, 3200)
  }

  const segmentAngle = 360 / TEAMS.length

  return (
    <div className="panel-glow rounded-lg p-5 bg-[#0d1a0d] h-full flex flex-col">
      <SectionHeader icon={Activity} title="Team Blame-O-Meter" subtitle="// scapegoat_finder.py --mode=random" color="amber" />

      <div className="flex gap-4 flex-1">
        {/* Wheel */}
        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <div className="relative w-44 h-44 mb-3">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 text-[#ffb000] text-xl amber-glow">▼</div>
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning ? 'transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 1.0)' : 'none',
                filter: 'drop-shadow(0 0 12px #ffb00044)',
              }}
            >
              {TEAMS.map((team, i) => {
                const startAngle = i * segmentAngle - 90
                const endAngle = startAngle + segmentAngle
                const s = (a) => ({ x: 100 + 95 * Math.cos((a * Math.PI) / 180), y: 100 + 95 * Math.sin((a * Math.PI) / 180) })
                const start = s(startAngle)
                const end = s(endAngle)
                const mid = s(startAngle + segmentAngle / 2)
                const largeArc = segmentAngle > 180 ? 1 : 0
                return (
                  <g key={team.name}>
                    <path
                      d={`M 100 100 L ${start.x} ${start.y} A 95 95 0 ${largeArc} 1 ${end.x} ${end.y} Z`}
                      fill={team.color + '33'}
                      stroke={team.color}
                      strokeWidth="1.5"
                    />
                    <text
                      x={100 + 60 * Math.cos(((startAngle + segmentAngle / 2) * Math.PI) / 180)}
                      y={100 + 60 * Math.sin(((startAngle + segmentAngle / 2) * Math.PI) / 180)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={team.color}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {team.name}
                    </text>
                  </g>
                )
              })}
              <circle cx="100" cy="100" r="8" fill="#0a0a0a" stroke="#00ff41" strokeWidth="2" />
            </svg>
          </div>

          <button
            onClick={spin}
            disabled={spinning}
            className={`
              px-4 py-2 font-mono text-sm font-bold rounded border cursor-pointer select-none
              ${spinning
                ? 'border-[#ffb00044] text-[#ffb00044] bg-transparent cursor-not-allowed'
                : 'border-[#ffb000] text-[#ffb000] bg-[#ffb00011] hover:bg-[#ffb00022] active:scale-95'}
              transition-all duration-150
            `}
            style={{ boxShadow: spinning ? 'none' : '0 0 12px #ffb00033' }}
          >
            {spinning ? (
              <span className="flex items-center gap-2">
                <RefreshCw size={12} className="animate-spin" /> SPINNING...
              </span>
            ) : (
              '🎯 SPIN & FIND SCAPEGOAT'
            )}
          </button>
        </div>

        {/* Bar chart + winner */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1.5" key={animKey}>
            {TEAMS.map((team, i) => (
              <div key={team.name} className="flex items-center gap-2">
                <span className="text-xs font-mono w-20 truncate" style={{ color: team.color }}>{team.name}</span>
                <div className="flex-1 bg-[#060f06] rounded-full h-3 overflow-hidden border border-[#ffffff11]">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${bars[i]}%`,
                      backgroundColor: team.color,
                      boxShadow: `0 0 6px ${team.color}88`,
                      transitionDelay: `${i * 100}ms`,
                    }}
                  />
                </div>
                <span className="text-xs font-mono w-8 text-right" style={{ color: team.color }}>{bars[i]}%</span>
              </div>
            ))}
          </div>

          {winner && (
            <div
              className="mt-3 p-3 rounded border text-xs font-mono"
              style={{
                borderColor: winner.color + '88',
                backgroundColor: winner.color + '11',
                color: winner.color,
                boxShadow: `0 0 12px ${winner.color}33`,
              }}
            >
              <div className="font-bold text-sm mb-1">⚠ SCAPEGOAT IDENTIFIED</div>
              <span className="opacity-90 font-bold">{winner.name}</span>
              <span className="opacity-70"> {winner.accusation}</span>
            </div>
          )}

          {!winner && !spinning && (
            <div className="mt-3 p-3 rounded border border-[#00ff4122] text-xs font-mono text-[#00ff4155] italic">
              {'>'} Awaiting blame allocation...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── FEATURE 3: PIPELINE STATUS FAKER ────────────────────────────────────────

function PipelineFaker() {
  const [stages, setStages] = useState(null)
  const [logs, setLogs] = useState([])
  const [running, setRunning] = useState(false)
  const [runCount, setRunCount] = useState(0)
  const logsEndRef = useRef(null)

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [logs])

  const runPipeline = useCallback(() => {
    if (running) return
    setRunning(true)
    setLogs([])
    setRunCount(c => c + 1)

    // Decide stage statuses upfront; last stage always fails sometimes for drama
    const stageStatuses = PIPELINE_STAGES.map((_, i) => {
      if (i === PIPELINE_STAGES.length - 1) return randBool(0.35) ? 'fail' : 'pass'
      return randBool(0.78) ? 'pass' : 'fail'
    })
    // If a stage fails, all subsequent are 'skipped'
    let failed = false
    const finalStatuses = stageStatuses.map((s) => {
      if (failed) return 'skipped'
      if (s === 'fail') { failed = true; return 'fail' }
      return 'pass'
    })

    setStages(PIPELINE_STAGES.map((name, i) => ({ name, status: 'pending' })))

    let stageIdx = 0

    const runNextStage = () => {
      if (stageIdx >= PIPELINE_STAGES.length) {
        setRunning(false)
        return
      }

      const i = stageIdx
      const stageName = PIPELINE_STAGES[i]
      const status = finalStatuses[i]

      if (status === 'skipped') {
        setStages(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'skipped' } : s))
        setLogs(prev => [...prev, { type: 'warn', text: `[SKIP] ${stageName}: Not reached (upstream failure)` }])
        stageIdx++
        setTimeout(runNextStage, 200)
        return
      }

      setStages(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s))
      setLogs(prev => [...prev, { type: 'info', text: `[INFO] Starting stage: ${stageName}...` }])

      const duration = randInt(800, 2000)
      const logCount = randInt(2, 5)

      // Add drip logs during stage
      let logsFired = 0
      const logInterval = setInterval(() => {
        if (logsFired >= logCount) { clearInterval(logInterval); return }
        const pool = status === 'fail' ? FAIL_LOGS : PASS_LOGS
        setLogs(prev => [...prev, { type: status === 'fail' && logsFired === logCount - 1 ? 'error' : 'log', text: rand(pool) }])
        logsFired++
      }, duration / (logCount + 1))

      setTimeout(() => {
        clearInterval(logInterval)
        setStages(prev => prev.map((s, idx) => idx === i ? { ...s, status } : s))
        const resultMsg = status === 'pass'
          ? `[OK]   Stage "${stageName}" passed ✓`
          : `[FAIL] Stage "${stageName}" FAILED — see logs above`
        setLogs(prev => [...prev, { type: status === 'pass' ? 'success' : 'error', text: resultMsg }])
        stageIdx++
        setTimeout(runNextStage, 300)
      }, duration)
    }

    runNextStage()
  }, [running])

  const stageIcon = (status) => {
    if (status === 'pass') return <span className="text-[#00ff41]">✓</span>
    if (status === 'fail') return <span className="text-[#ff4444]">✗</span>
    if (status === 'running') return <RefreshCw size={12} className="animate-spin text-[#ffb000]" />
    if (status === 'skipped') return <span className="text-[#555]">—</span>
    return <span className="text-[#333]">○</span>
  }

  const stageColor = (status) => {
    if (status === 'pass') return 'border-[#00ff4166] bg-[#00ff4111] text-[#00ff41]'
    if (status === 'fail') return 'border-[#ff444466] bg-[#ff444411] text-[#ff6666]'
    if (status === 'running') return 'border-[#ffb00066] bg-[#ffb00011] text-[#ffb000]'
    if (status === 'skipped') return 'border-[#33333388] bg-[#11111111] text-[#555]'
    return 'border-[#00ff4122] bg-transparent text-[#00ff4144]'
  }

  const logColor = (type) => {
    if (type === 'error') return 'text-[#ff6666]'
    if (type === 'success') return 'text-[#00ff41]'
    if (type === 'warn') return 'text-[#ffb000]'
    if (type === 'info') return 'text-[#00ccff]'
    return 'text-[#00ff4199]'
  }

  return (
    <div className="panel-glow rounded-lg p-5 bg-[#0d1a0d] flex flex-col">
      <SectionHeader icon={GitBranch} title="Pipeline Status Faker" subtitle="// ci_cd_simulator.yml (totally real)" color="green" />

      {/* Pipeline stages */}
      <div className="flex items-center gap-1 mb-4 flex-wrap">
        {(stages || PIPELINE_STAGES.map(name => ({ name, status: 'pending' }))).map((stage, i) => (
          <div key={stage.name} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded border font-mono text-xs ${stageColor(stage.status)} transition-all duration-300`}>
              {stageIcon(stage.status)}
              <span>{stage.name}</span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <ChevronRight size={14} className="text-[#00ff4133] mx-0.5 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Run button + counter */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={runPipeline}
          disabled={running}
          className={`
            flex items-center gap-2 px-4 py-2 font-mono text-sm font-bold rounded border cursor-pointer select-none
            ${running
              ? 'border-[#00ff4144] text-[#00ff4144] bg-transparent cursor-not-allowed'
              : 'border-[#00ff41] text-[#00ff41] bg-[#00ff4111] hover:bg-[#00ff4122] active:scale-95'}
            transition-all duration-150
          `}
          style={{ boxShadow: running ? 'none' : '0 0 12px #00ff4133' }}
        >
          <Zap size={14} />
          {running ? 'RUNNING...' : '▶ RUN PIPELINE'}
        </button>
        <span className="text-xs font-mono text-[#00ff4155]">
          Build #{runCount > 0 ? String(1337 + runCount).padStart(4, '0') : '----'}
        </span>
        {stages && !running && (
          <span className={`text-xs font-mono font-bold ${stages.some(s => s.status === 'fail') ? 'text-[#ff4444] red-glow' : 'text-[#00ff41] terminal-glow'}`}>
            {stages.some(s => s.status === 'fail') ? '● FAILED' : '● SUCCESS'}
          </span>
        )}
      </div>

      {/* Logs */}
      <div className="flex-1 bg-[#060f06] rounded border border-[#00ff4122] p-3 h-44 overflow-y-auto log-scroll font-mono text-xs">
        {logs.length === 0 ? (
          <span className="text-[#00ff4144] italic">{'>'} Waiting for pipeline trigger...<span className="animate-[blink_1s_step-end_infinite]">█</span></span>
        ) : (
          logs.map((log, i) => (
            <div key={i} className={`leading-5 ${logColor(log.type)}`}>
              {log.text}
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}

// ─── STATUS BAR ───────────────────────────────────────────────────────────────

function StatusBar() {
  const [time, setTime] = useState(new Date())
  const [incidents, setIncidents] = useState(randInt(3, 12))
  const messages = [
    '⚡ PROD IS DOWN  ·  STAY CALM  ·  BLAME SOMEONE  ·  REPEAT',
    '🔥 SLA BREACHED  ·  CUSTOMER ANGRY  ·  MANAGEMENT WATCHING  ·  GOD HELP US',
    '☕ COFFEE CRITICAL  ·  ENGINEER UNSTABLE  ·  DEPLOY PAUSED  ·  STANDBY',
    '🚀 DEPLOYS FROZEN  ·  ROLLBACK FAILED  ·  README OUTDATED  ·  NORMAL TUESDAY',
  ]
  const [msgIdx, setMsgIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    const m = setInterval(() => setMsgIdx(i => (i + 1) % messages.length), 7000)
    const inc = setInterval(() => setIncidents(n => n + randInt(0, 1)), 8000)
    return () => { clearInterval(t); clearInterval(m); clearInterval(inc) }
  }, [])

  return (
    <div className="border-t border-[#00ff4122] bg-[#060f06] px-4 py-2 flex items-center justify-between text-xs font-mono">
      <div className="flex items-center gap-4">
        <span className="text-[#ff4444] red-glow animate-[blink_1s_step-end_infinite] font-bold">● LIVE</span>
        <span className="text-[#00ff4188]">INCIDENTS: <span className="text-[#ff4444] font-bold">{incidents}</span></span>
        <span className="text-[#00ff4166] hidden md:inline">UPTIME: <span className="text-[#00ff41]">69.4%</span></span>
      </div>
      <div className="overflow-hidden flex-1 mx-4 hidden sm:block">
        <span className="marquee-text text-[#ffb00099]">{messages[msgIdx]}</span>
      </div>
      <div className="flex items-center gap-3 text-[#00ff4177]">
        <span className="hidden md:inline">v{randInt(1, 9)}.{randInt(0, 9)}.{randInt(0, 99)}-hotfix</span>
        <span>{time.toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono flex flex-col crt-flicker">
      {/* Header */}
      <header className="border-b border-[#00ff4133] px-6 py-4 bg-[#060f06]"
        style={{ boxShadow: '0 2px 20px #00ff4111' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal size={24} className="terminal-glow" />
            <div>
              <h1
                className="text-xl font-bold terminal-glow glitch-text"
                data-text="DevOps Survivor Kit "
              >
                DevOps Survivor Cool Kit
              </h1>
              <p className="text-xs text-[#00ff4177]">// production_firefighting_tools.sh — root@chaos:~$</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#00ff4166]">
            <span className="flex items-center gap-1">
              <Skull size={12} className="text-[#ff4444]" />
              <span className="text-[#ff4444] font-bold">CRITICAL</span>
            </span>
            <span>ENV: <span className="text-[#ff4444]">production</span></span>
            <span className="hidden sm:inline">REGION: <span className="text-[#ffb000]">us-east-1 (cursed)</span></span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Top row: Excuse + Blame */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <ExcuseGenerator />
          <BlameMeter />
        </div>

        {/* Bottom: Pipeline */}
        <PipelineFaker />
      </main>

      {/* Status bar */}
      <StatusBar />
    </div>
  )
}

import { useState } from 'react'
import styles from './HelpWindow.module.css'

// Playtester feedback: there was no help/guide section anywhere visible.
// This window covers the most-asked questions a new operative actually has,
// in plain language. Available from the taskbar at any time.

type HelpTab = 'getting_started' | 'hacking_basics' | 'trace_relay' | 'money_factions' | 'characters_story' | 'multiplayer' | 'controls'

interface TabSpec { id: HelpTab; label: string }
const TABS: TabSpec[] = [
  { id: 'getting_started',  label: 'GETTING STARTED' },
  { id: 'hacking_basics',   label: 'HACKING BASICS' },
  { id: 'trace_relay',      label: 'TRACE & RELAY' },
  { id: 'money_factions',   label: 'MONEY & FACTIONS' },
  { id: 'characters_story', label: 'CHARACTERS & STORY' },
  { id: 'multiplayer',      label: 'MULTIPLAYER' },
  { id: 'controls',         label: 'CONTROLS & KEYS' },
]

export function HelpWindow() {
  const [tab, setTab] = useState<HelpTab>('getting_started')

  return (
    <div className={styles.root}>
      <div className={styles.sidebar}>
        {TABS.map((t) => (
          <div
            key={t.id}
            className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
            onClick={() => setTab(t.id)}
            role="button"
            tabIndex={0}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div className={styles.content}>
        {tab === 'getting_started' && <GettingStarted />}
        {tab === 'hacking_basics'  && <HackingBasics />}
        {tab === 'trace_relay'     && <TraceAndRelay />}
        {tab === 'money_factions'  && <MoneyAndFactions />}
        {tab === 'characters_story'&& <CharactersAndStory />}
        {tab === 'multiplayer'     && <Multiplayer />}
        {tab === 'controls'        && <Controls />}
      </div>
    </div>
  )
}

function GettingStarted() {
  return (
    <>
      <h1 className={styles.title}>GETTING STARTED</h1>
      <div className={styles.subtitle}>The first hour, in plain language.</div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>WHAT IS THIS GAME</div>
        <p className={styles.body}>
          Voidlink is a hacking simulator set in 2199. You play a contractor on a hidden network. Clients post contracts; you accept them; you breach systems; you get paid; you try not to get traced. Over time the choices you make form a quiet, accumulating identity that the game eventually <em>names you by</em>.
        </p>
        <p className={styles.body}>
          It is a deliberate game. Most of the work is reading, thinking, and choosing — not twitch reflexes.
        </p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>YOUR FIRST FIFTEEN MINUTES</div>
        <div className={styles.bullet}>Open your <strong>INBOX</strong> from the taskbar. Voidlink Dispatch has sent you a welcome. CIPHER will write to you within a couple of contracts.</div>
        <div className={styles.bullet}>Open the <strong>MISSION BOARD</strong>. Look for a low-difficulty FILE THEFT (1 or 2 dots) from a name you recognise. Accept it.</div>
        <div className={styles.bullet}>The <strong>NETWORK MAP</strong> and <strong>HACK TOOLS</strong> windows open automatically. From here you SCAN nodes, BREACH them, do your objective, then WIPE LOGS on every breached node before disconnecting.</div>
        <div className={styles.bullet}>SECURE DISCONNECT (green button) when the work is done and the logs are wiped. The dirty exit (LEAVE NETWORK) loses your payment and puts the breach on the news.</div>
      </div>

      <div className={styles.callout}>
        You can re-watch the operative intro and the tutorial at any time from <strong>SETTINGS</strong>. Look for REPLAY ON NEXT BOOT / REPLAY ON NEXT LOGIN.
      </div>
    </>
  )
}

function HackingBasics() {
  return (
    <>
      <h1 className={styles.title}>HACKING BASICS</h1>
      <div className={styles.subtitle}>Scan, breach, do the job, leave clean.</div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>THE FIVE THINGS YOU DO ON EVERY MISSION</div>
        <div className={styles.bullet}><strong>SCAN</strong> a node. Reveals services and may surface a vulnerability you can exploit.</div>
        <div className={styles.bullet}><strong>BREACH</strong> by CRACK (always available, slower) or EXPLOIT (faster, requires a found vulnerability).</div>
        <div className={styles.bullet}><strong>EXECUTE the objective</strong> — transfer a file, delete an account, corrupt a database, sabotage a router. Mission-specific.</div>
        <div className={styles.bullet}><strong>WIPE LOGS</strong> on every breached node. Skip this and you leave evidence behind that compounds over your career.</div>
        <div className={styles.bullet}><strong>SECURE DISCONNECT</strong>. Credits land, XP awards, trace resets, you go home.</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>NODE TYPES — WHAT THEY DO</div>
        <div className={styles.bullet}><strong>⊕ Entry Point</strong> — the gateway you connect through. Usually low-tier.</div>
        <div className={styles.bullet}><strong>◫ Firewall</strong> — gates traffic to the rest of the network. Hard-breaching a firewall without a Firewall Bypasser triggers an emergency trace spike.</div>
        <div className={styles.bullet}><strong>⇄ Router</strong> — pivots between subnets. Sniffer software auto-scans adjacent nodes when you breach one.</div>
        <div className={styles.bullet}><strong>▤ File Server / ▦ Database</strong> — holds the data you want.</div>
        <div className={styles.bullet}><strong>✉ Mail Server</strong> — credentials sometimes.</div>
        <div className={styles.bullet}><strong>⌘ Admin Console</strong> — dump creds here, bypass everything else on the network.</div>
        <div className={styles.bullet}><strong>◉ Intrusion Detector</strong> — bumps trace aggressively. Avoid if you can.</div>
        <div className={styles.bullet}><strong>◈ AI Core</strong> — high-tier. Needs a GPU. Worth the trouble when it shows up.</div>
      </div>
    </>
  )
}

function TraceAndRelay() {
  return (
    <>
      <h1 className={styles.title}>TRACE & RELAY CHAIN</h1>
      <div className={styles.subtitle}>The two things that determine whether you survive.</div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>THE TRACE BAR</div>
        <p className={styles.body}>
          Every action while connected raises your trace level. At <strong>75%</strong> the alarm intensifies. At <strong>90%</strong> it goes critical. At <strong>100%</strong> you are TRACED — mission fails, no payment, the JCB notices.
        </p>
        <p className={styles.body}>
          The bar is the most important piece of UI on the screen. If it climbs past 60% and the objective isn't done, disconnect. The reward is not worth your career. The Mission Result screen will show a forensic walk-back of what put trace over the line — read it.
        </p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>THE RELAY CHAIN</div>
        <p className={styles.body}>
          Open the <strong>WORLD MAP</strong> before you accept a contract. Click green bounce nodes to chain them — your traffic routes through each hop before reaching the target. If a hop is traced, only that hop is exposed, not you.
        </p>
        <div className={styles.bullet}>Max hops: 3 with the basic proxy, 5 with v2, 7 with v3. Upgrade in SHOP.</div>
        <div className={styles.bullet}>Dirty (logged) hops cannot be added. Clean them via HACK TOOLS first.</div>
        <div className={styles.bullet}>More hops slow the trace dramatically. Build the chain <em>before</em> the job, not after.</div>
      </div>
    </>
  )
}

function MoneyAndFactions() {
  return (
    <>
      <h1 className={styles.title}>MONEY & FACTIONS</h1>
      <div className={styles.subtitle}>How the world tracks who you've been working for.</div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>CREDITS, NOTORIETY, AND BANKS</div>
        <p className={styles.body}>
          Credits (Cr) come from contracts. Spend them in the SHOP on hardware and software. Save them in a BANK — public banks pay good APR but raise your <strong>notoriety</strong>; offshore banks pay less but lower it. High notoriety means every contract starts under heavier passive trace pressure.
        </p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>THE FIVE FACTIONS</div>
        <div className={styles.bullet}><strong>Voidlink International</strong> — the platform you signed the Bond with. You start aligned. They keep score quietly.</div>
        <div className={styles.bullet}><strong>Arunmor</strong> — biotech corporation. Owns REVELATION. Will pay handsomely for "research-aligned" work.</div>
        <div className={styles.bullet}><strong>Ares Division</strong> — security corp. The most direct opponents of the Underground. Antagonistic to Arunmor.</div>
        <div className={styles.bullet}><strong>The Underground</strong> — independent operatives. Cipher and NIGHTOWL_22 are aligned here.</div>
        <div className={styles.bullet}><strong>The Nameless</strong> — observed but not understood. They watch you back.</div>
      </div>

      <div className={styles.callout}>
        Mission cards on the board are now tinted by client faction — amber for corporate, red for government, green for underground, purple for independent, cyan for neutral. The trace bar tints to match the active mission's faction too. You can <em>see</em> who you're working for.
      </div>
    </>
  )
}

function CharactersAndStory() {
  return (
    <>
      <h1 className={styles.title}>CHARACTERS & STORY</h1>
      <div className={styles.subtitle}>Voices you will hear from, in the order you'll meet them.</div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>RECURRING NAMES</div>
        <div className={styles.bullet}><strong>VoidLink Dispatch</strong> — automated. Routes contracts and confirms billing.</div>
        <div className={styles.bullet}><strong>CIPHER</strong> — senior Underground operative. Writes to you in letters, not orders. Trust him slowly.</div>
        <div className={styles.bullet}><strong>NIGHTOWL_22</strong> — independent broker out of Lagos. Pays less than the listings. Asks more in return.</div>
        <div className={styles.bullet}><strong>sys.ops</strong> — automated system notices.</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>STORY ARCS</div>
        <p className={styles.body}>
          There are eight story arcs in the game. They unlock as you progress. Each arc resolves with a meaningful choice. The game watches what you choose and quietly remembers — your <em>Operative Signature</em> (visible in your PROFILE) and your <em>Operative Diary</em> are the game telling you who you have become.
        </p>
        <p className={styles.body}>
          You will <em>not</em> get every ending in one playthrough. That is intentional.
        </p>
      </div>
    </>
  )
}

function Multiplayer() {
  return (
    <>
      <h1 className={styles.title}>MULTIPLAYER</h1>
      <div className={styles.subtitle}>The honest answer.</div>

      <div className={styles.section}>
        <p className={styles.body}>
          <strong>Voidlink is a single-player game.</strong> There is no multiplayer in the current build. There are no other human players on the network you're connected to — the ninety thousand "other operatives" the intro mentions are part of the fiction, not other people you can interact with.
        </p>
        <p className={styles.body}>
          The factions you've seen mentioned (Underground, Arunmor, Ares, Voidlink, the Nameless) are <em>faction-standing systems</em> — they track how each in-fiction organisation feels about your choices. They are not multiplayer guilds. You cannot join one with friends.
        </p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>FUTURE PLANS</div>
        <p className={styles.body}>
          Multiplayer is on the very-long-term roadmap (post-2028, after the 1.0 PC release stabilises). It is deliberately the last major system because it requires a server-authoritative rewrite of large parts of the game. The 1.0 release will be single-player; multiplayer would be a later expansion if-and-only-if the game finds its audience.
        </p>
        <p className={styles.body}>
          We do not want to promise multiplayer and then disappoint people. The intro mentioning "ninety thousand operatives" is intentional in-fiction worldbuilding — sorry for the confusion that caused.
        </p>
      </div>

      <div className={styles.callout}>
        If multiplayer matters more to you than single-player narrative, this is honestly not the game for you yet. We'd rather you know that before you buy.
      </div>
    </>
  )
}

function Controls() {
  return (
    <>
      <h1 className={styles.title}>CONTROLS & KEYS</h1>
      <div className={styles.subtitle}>Everything you can do without the mouse.</div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>GLOBAL</div>
        <div className={styles.bullet}><span className={styles.kbd}>Ctrl</span> + <span className={styles.kbd}>Scroll</span> — Zoom the entire window layer (helpful on small screens).</div>
        <div className={styles.bullet}><span className={styles.kbd}>⊞</span> button on taskbar — Cascade all open windows into a tidy layout.</div>
        <div className={styles.bullet}><span className={styles.kbd}>⏻</span> button — Save and log out.</div>
        <div className={styles.bullet}><span className={styles.kbd}>⚙</span> button — Open SETTINGS.</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>OPERATIVE INTRO</div>
        <div className={styles.bullet}><span className={styles.kbd}>Space</span> or <span className={styles.kbd}>Enter</span> — skip typing / advance.</div>
        <div className={styles.bullet}><span className={styles.kbd}>←</span> or <span className={styles.kbd}>Backspace</span> — go back a chapter.</div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>WINDOWS</div>
        <div className={styles.bullet}>Drag the title bar to move. Drag any edge to resize.</div>
        <div className={styles.bullet}>Click the launcher in the taskbar to focus a minimised window, or to minimise the focused one.</div>
        <div className={styles.bullet}><span className={styles.kbd}>Esc</span> closes most modals.</div>
      </div>
    </>
  )
}

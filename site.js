// Marotta Arcade hub: carousel data + synthwave hero drive.
const GAMES = [
  {
    id: 'gridlock',
    kicker: '★ NEW ★',
    title: 'GRIDLOCK',
    tag: 'Top-down traffic racer. Whole track visible, 12 color-coded cars, items, vans in the way, forced pit stops.',
    chips: ['12 racers', '3 laps', 'items + traffic', 'live tune ~'],
    play: 'https://gridlock-racer.pages.dev',
    keys: '↑ gas · ↓ brake · ← → steer · Space item / pit · ~ admin',
    steps: [
      'Qualify nothing — grid up and wait for green.',
      'Grab item boxes. Odds favor the back of the pack.',
      'Watch your tire dot: green → yellow → red means box for the crew.',
      'Stop in your numbered slot, hit Space with the needle centered.',
      '3 laps, most positions settled by the flag. Bots fill the grid.',
    ],
    controls: [['↑ / ↓', 'gas / brake'], ['← →', 'steer'], ['Space', 'use item / pit timing'], ['~', 'live tune panel']],
    tips: [
      'Grass drags and wears tires — stay on the black stuff.',
      'Traffic vans never move over. Plan the pass early.',
      'Zap only hits cars ahead — leading is its own defense.',
    ],
  },
  {
    id: 'nitro',
    kicker: '★ DRAG ★',
    title: 'NITRO',
    tag: '80s drag showdown. Hold the revs, nail endless shifts, sabotage the leader — then hold on for ~60 seconds.',
    chips: ['2–12 players', '~60s heats', 'endless gears', 'best of 3/5'],
    play: 'https://nitro-drag.pages.dev',
    keys: '↑ rev · space shift · solo test mode included',
    steps: [
      'Stage: hold ↑ to sit in the 3400–5600 launch zone.',
      'Green! Too low bogs, too high wheelspins.',
      'Shift in the white window — it narrows, then holds, forever.',
      'Perfects give a speed boost and build a combo streak.',
      'First across 2200m (or furthest at the whistle) takes the heat.',
    ],
    controls: [['↑', 'hold to rev'], ['Space', 'shift up'], ['Mouse', 'REV / SHIFT touch buttons work too']],
    tips: [
      'Redline cooks heat — 100% means a 2s limp.',
      'Early shifts bog you down, late shifts cook the engine.',
      'Back markers get a wider hidden shift window.',
    ],
  },
  {
    id: 'death',
    kicker: '★ 20 RACERS ★',
    title: 'DEATH RACE',
    tag: 'Hidden-identity racing. Blend into the pack of 20, read the tells, spend your one bullet wisely.',
    chips: ['up to 20 players', 'social deduction', '3/5/7 rounds'],
    play: 'https://death-race-online.pages.dev',
    keys: '→ walk · space sprint · mouse aim + fire',
    steps: [
      'Everyone is secretly assigned a racer — including you.',
      'Walk, sprint and loiter with the NPC pack. Standing still is camouflage.',
      'Sprinting drains stamina and marks you as human.',
      'One bullet per round. KO a human for a point.',
      'Cross first for 3 points — but if an NPC wins, everyone gets shamed.',
    ],
    controls: [['→', 'walk'], ['Space', 'sprint (stamina budgeted)'], ['Mouse', 'aim + fire your one shot']],
    tips: [
      'Sprinting makes your intent readable — dart, don’t marathon.',
      'Watch who reacts to shots. NPCs never flinch.',
      'Corpses stay on the track. Remember who shot whom.',
    ],
  },
  {
    id: 'dogs',
    kicker: '★ TACTICAL ★',
    title: 'DOGS OF WAR',
    tag: 'Tactical multiplayer warfare. Squads, turns, and poor decisions under fire.',
    chips: ['multiplayer', 'tactics', 'live'],
    play: 'https://dogs-of-war-server.fly.dev/',
    keys: 'browser client · runs on its own server, allow a cold start',
    steps: [
      'Muster your squad in the lobby.',
      'Take turns maneuvering against the enemy.',
      'Complete objectives before your dogs are put down.',
    ],
    controls: [['Mouse', 'command units (see in-game help)']],
    tips: ['Coordinate with your team — lone wolves get flanked.'],
  },
]

const cab = document.getElementById('cab')
const dots = document.getElementById('dots')
let index = 0
let autoTimer = 0

function render(i) {
  index = (i + GAMES.length) % GAMES.length
  const g = GAMES[index]
  cab.className = `cab ${g.id}`
  document.getElementById('cab-kicker').textContent = g.kicker
  const screen = document.getElementById('cab-screen')
  screen.className = `cab-screen ${g.id}`
  document.getElementById('cab-title').textContent = g.title
  document.getElementById('cab-tag').textContent = g.tag
  document.getElementById('cab-chips').innerHTML = g.chips.map(c => `<li>${c}</li>`).join('')
  const play = document.getElementById('cab-play')
  play.href = g.play
  document.getElementById('cab-keys').textContent = g.keys
  document.getElementById('detail-steps').innerHTML = g.steps.map(s => `<li>${s}</li>`).join('')
  document.getElementById('detail-controls').innerHTML =
    g.controls.map(([k, d]) => `<li><kbd>${k}</kbd> ${d}</li>`).join('')
  document.getElementById('detail-tips').innerHTML = g.tips.map(t => `<li>${t}</li>`).join('')
  dots.innerHTML = GAMES.map((h, di) =>
    `<button role="tab" aria-selected="${di === index}" aria-label="${h.title}"></button>`).join('')
  dots.querySelectorAll('button').forEach((b, di) => b.addEventListener('click', () => {
    render(di)
    restartAuto()
  }))
}

function restartAuto() {
  clearInterval(autoTimer)
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    autoTimer = setInterval(() => render(index + 1), 9000)
  }
}

document.getElementById('prev').addEventListener('click', () => { render(index - 1); restartAuto() })
document.getElementById('next').addEventListener('click', () => { render(index + 1); restartAuto() })
document.addEventListener('keydown', e => {
  if (e.target.matches('input, textarea')) return
  if (e.key === 'ArrowLeft') { render(index - 1); restartAuto() }
  if (e.key === 'ArrowRight') { render(index + 1); restartAuto() }
})
document.querySelector('.carousel').addEventListener('pointerenter', () => clearInterval(autoTimer))
document.querySelector('.carousel').addEventListener('pointerleave', restartAuto)

render(0)
restartAuto()

// Synthwave hero drive: sun + scrolling grid. Cheap, no deps.
;(() => {
  const canvas = document.getElementById('drive')
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const horizon = H * 0.55
  let t = 0
  const sun = ctx.createLinearGradient(0, 0, 0, horizon)
  sun.addColorStop(0, '#ffd23f')
  sun.addColorStop(1, '#ff2e88')
  function frame() {
    t += 0.008
    const sky = ctx.createLinearGradient(0, 0, 0, horizon)
    sky.addColorStop(0, '#1b0640')
    sky.addColorStop(1, '#ff2e88')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, W, horizon + 1)
    ctx.fillStyle = sun
    ctx.beginPath()
    ctx.arc(W / 2, horizon - 30, 70, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#1b0640'
    for (let i = 0; i < 4; i += 1) ctx.fillRect(W / 2 - 72, horizon - 30 - 10 + i * 18, 144, 6)
    ctx.fillStyle = '#0b0714'
    ctx.fillRect(0, horizon, W, H - horizon)
    ctx.strokeStyle = 'rgba(51,204,255,0.7)'
    ctx.lineWidth = 1.5
    for (let i = 0; i <= 12; i += 1) {
      ctx.beginPath()
      ctx.moveTo(W / 2, horizon)
      ctx.lineTo((W / 12) * i, H)
      ctx.stroke()
    }
    for (let i = 0; i < 8; i += 1) {
      const p = ((t + i / 8) % 1)
      const y = horizon + (H - horizon) * p * p
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.stroke()
    }
    requestAnimationFrame(frame)
  }
  frame()
})()

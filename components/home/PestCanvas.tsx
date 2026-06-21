'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    triggerPestShield?: () => void
  }
}

export function PestCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let W = 0, H = 0
    let bugs: Bug[] = []
    let particles: Particle[] = []
    let shieldWave: ShieldWave | null = null
    let raf = 0
    let elimTotal = 0

    function resize() {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── COCKROACH DRAWING ──────────────────────────────────────────────────
    function drawCockroach(
      x: number, y: number, angle: number,
      size: number, alpha: number, wiggle: number
    ) {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.rotate(angle + Math.PI / 2)
      const s = size

      // Drop shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.beginPath(); ctx.ellipse(3, 4, s * 0.38, s * 0.55, 0, 0, Math.PI * 2); ctx.fill()

      // Body — abdomen (dark brown radial gradient)
      const bodyGrad = ctx.createRadialGradient(-s * 0.1, -s * 0.1, 0, 0, 0, s * 0.5)
      bodyGrad.addColorStop(0, '#7B4525')
      bodyGrad.addColorStop(0.4, '#5A2F12')
      bodyGrad.addColorStop(1, '#2E160A')
      ctx.fillStyle = bodyGrad
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.35, s * 0.52, 0, 0, Math.PI * 2); ctx.fill()

      // Wing segment lines
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 0.8
      ctx.beginPath(); ctx.moveTo(0, -s * 0.45); ctx.lineTo(0, s * 0.45); ctx.stroke()
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath(); ctx.moveTo(-s * 0.35, i * s * 0.1); ctx.lineTo(s * 0.35, i * s * 0.1)
        ctx.globalAlpha = alpha * 0.12; ctx.stroke(); ctx.globalAlpha = alpha
      }

      // Wing sheen
      ctx.fillStyle = 'rgba(160,90,40,0.18)'
      ctx.beginPath(); ctx.ellipse(-s * 0.1, -s * 0.1, s * 0.18, s * 0.35, -0.2, 0, Math.PI * 2); ctx.fill()

      // Pronotum head-shield
      const headGrad = ctx.createRadialGradient(-s * 0.05, -s * 0.65, 0, 0, -s * 0.6, s * 0.3)
      headGrad.addColorStop(0, '#8A4F2A')
      headGrad.addColorStop(1, '#3A1F0A')
      ctx.globalAlpha = alpha
      ctx.fillStyle = headGrad
      ctx.beginPath(); ctx.ellipse(0, -s * 0.6, s * 0.28, s * 0.3, 0, 0, Math.PI * 2); ctx.fill()

      // 6 Legs — alternating walk cycle
      ctx.strokeStyle = '#2A130A'; ctx.lineWidth = 0.9
      const legDefs = [
        { oy: -s * 0.22, phase: 0 },
        { oy: 0, phase: Math.PI },
        { oy: s * 0.24, phase: 0 },
      ]
      legDefs.forEach(({ oy, phase }) => {
        ;[-1, 1].forEach(side => {
          const swing = Math.sin(wiggle + phase) * s * 0.14 * side
          const bx = side * s * 0.33
          const ex = side * (s * 0.33 + s * 0.38 + swing)
          const ey = oy + Math.sin(wiggle + phase) * s * 0.1
          ctx.beginPath(); ctx.moveTo(bx, oy)
          ctx.quadraticCurveTo(side * (s * 0.33 + s * 0.2), oy + swing * 0.5, ex, ey)
          ctx.stroke()
          // Tarsal claw
          ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + side * s * 0.07, ey + s * 0.06); ctx.stroke()
        })
      })

      // Antennae — long, segmented
      const aw = Math.sin(wiggle * 0.7)
      ctx.strokeStyle = '#2A130A'; ctx.lineWidth = 0.7
      ;[[-s * 0.1, -s * 0.85], [s * 0.1, -s * 0.85]].forEach(([ax, ay], i) => {
        const dir = i === 0 ? -1 : 1
        const mx = ax + dir * (s * 0.25 + aw * s * 0.15)
        const my = (ay as number) - s * 0.55
        const ex = mx + dir * (s * 0.3 + aw * s * 0.25)
        const ey = my - s * 0.6
        ctx.beginPath(); ctx.moveTo(ax as number, ay as number)
        ctx.quadraticCurveTo(mx, my, ex, ey); ctx.stroke()
        ctx.fillStyle = '#2A130A'
        ctx.beginPath(); ctx.arc(ex, ey, 1, 0, Math.PI * 2); ctx.fill()
      })

      // Eyes — red, tiny
      ctx.fillStyle = '#FF4444'
      ;[-s * 0.12, s * 0.12].forEach(ex => {
        ctx.beginPath(); ctx.arc(ex, -s * 0.82, s * 0.055, 0, Math.PI * 2); ctx.fill()
      })

      ctx.restore()
    }

    function drawTermite(
      x: number, y: number, angle: number,
      size: number, alpha: number, wiggle: number
    ) {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y); ctx.rotate(angle + Math.PI / 2)
      const s = size

      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.beginPath(); ctx.ellipse(2, 2, s * 0.22, s * 0.38, 0, 0, Math.PI * 2); ctx.fill()

      const bg = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.4)
      bg.addColorStop(0, '#E8C99A'); bg.addColorStop(1, '#B89060')
      ctx.fillStyle = bg
      ctx.beginPath(); ctx.ellipse(0, s * 0.12, s * 0.2, s * 0.33, 0, 0, Math.PI * 2); ctx.fill()

      ctx.fillStyle = '#D4A870'
      ctx.beginPath(); ctx.ellipse(0, -s * 0.32, s * 0.16, s * 0.2, 0, 0, Math.PI * 2); ctx.fill()

      ctx.strokeStyle = '#9A7040'; ctx.lineWidth = 0.8
      const legPairs: [number, number][] = [[-1, -.28], [1, -.28], [-1, .12], [1, .12], [-1, .45], [1, .45]]
      legPairs.forEach(([sx, sy]) => {
        const swing = Math.sin(wiggle + sx * Math.PI) * s * 0.1
        ctx.beginPath()
        ctx.moveTo(sx * s * 0.18, sy * s)
        ctx.lineTo(sx * (s * 0.4 + swing), (sy + .22) * s)
        ctx.stroke()
      })

      ctx.strokeStyle = '#9A7040'; ctx.lineWidth = 0.6
      ;[[-s * 0.07, -s * 0.5], [s * 0.07, -s * 0.5]].forEach(([ax, ay], i) => {
        ctx.beginPath(); ctx.moveTo(ax as number, ay as number)
        ctx.lineTo((ax as number) + Math.sin(wiggle + i) * s * 0.28, (ay as number) - s * 0.55)
        ctx.stroke()
      })

      ctx.restore()
    }

    function drawMosquito(
      x: number, y: number, angle: number,
      size: number, alpha: number, wiggle: number
    ) {
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y); ctx.rotate(angle + Math.PI / 2)
      const s = size
      const wf = Math.sin(wiggle * 4) * 0.25

      ctx.fillStyle = '#1A1A2A'
      ctx.beginPath(); ctx.ellipse(0, 0, s * 0.09, s * 0.26, 0, 0, Math.PI * 2); ctx.fill()

      ctx.strokeStyle = 'rgba(160,200,255,0.45)'; ctx.lineWidth = 0.8
      ;[-1, 1].forEach(side => {
        ctx.beginPath()
        ctx.ellipse(side * s * 0.32, -s * 0.04 + wf * s, s * 0.28, s * 0.1, wf, 0, Math.PI * 2)
        ctx.stroke()
      })

      ctx.strokeStyle = '#1A1A2A'; ctx.lineWidth = 0.6
      ctx.beginPath(); ctx.moveTo(0, -s * 0.26); ctx.lineTo(0, -s * 0.75); ctx.stroke()

      ctx.strokeStyle = '#1A1A2A'; ctx.lineWidth = 0.5
      ;[-1, 0, 1].forEach(i => {
        ;[-1, 1].forEach(side => {
          const ly = i * s * 0.12
          ctx.beginPath()
          ctx.moveTo(side * s * 0.09, ly)
          ctx.lineTo(side * (s * 0.35 + Math.sin(wiggle + i) * s * 0.05), ly + s * 0.18)
          ctx.stroke()
        })
      })

      ctx.restore()
    }

    // ── PARTICLE CLASS ────────────────────────────────────────────────────
    class Particle {
      x: number; y: number; vx: number; vy: number
      life = 1; size: number; isRed: boolean

      constructor(x: number, y: number) {
        this.x = x; this.y = y
        this.vx = (Math.random() - 0.5) * 6
        this.vy = -Math.random() * 5 - 1
        this.size = Math.random() * 3 + 1
        this.isRed = Math.random() < 0.6
      }
      update() {
        this.x += this.vx; this.y += this.vy
        this.vy += 0.14; this.life -= 0.038
      }
      draw() {
        ctx.globalAlpha = Math.max(0, this.life)
        ctx.fillStyle = this.isRed
          ? `rgba(255,59,47,${this.life})`
          : `rgba(255,200,50,${this.life})`
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill()
      }
    }

    // ── BUG CLASS ──────────────────────────────────────────────────────────
    class Bug {
      x = 0; y = 0; vx = 0; vy = 0; angle = 0
      wiggle = Math.random() * 100
      type: 0 | 1 | 2 = 0   // 0=cockroach, 1=termite, 2=mosquito
      size = 16
      alive = true; dying = false
      alpha = 0; deathAlpha = 1; deathRot = 0
      targetX = 0; targetY = 0; speed = 1

      constructor() {
        const r = Math.random()
        this.type = r < 0.55 ? 0 : r < 0.85 ? 1 : 2
        this.size = this.type === 0 ? 17 : this.type === 1 ? 11 : 8
        this.speed = this.type === 2
          ? 0.4 + Math.random() * 0.6
          : 0.6 + Math.random() * 1.2

        const edge = Math.floor(Math.random() * 4)
        if (edge === 0) { this.x = Math.random() * W; this.y = -20 }
        else if (edge === 1) { this.x = W + 20; this.y = Math.random() * H }
        else if (edge === 2) { this.x = Math.random() * W; this.y = H + 20 }
        else { this.x = -20; this.y = Math.random() * H }

        this.targetX = Math.random() * W
        this.targetY = Math.random() * H
        this.vx = (Math.random() - 0.5) * this.speed * 2
        this.vy = (Math.random() - 0.5) * this.speed * 2
        this.angle = Math.atan2(this.vy, this.vx)
      }

      update() {
        this.wiggle += 0.09
        if (!this.alive) {
          this.deathAlpha -= 0.022
          this.deathRot += 0.18
          this.vy += 0.1; this.x += this.vx; this.y += this.vy
          return
        }
        if (this.alpha < 1) this.alpha = Math.min(1, this.alpha + 0.025)

        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        const d = Math.hypot(dx, dy)
        if (d < 60) {
          this.targetX = 80 + Math.random() * (W - 160)
          this.targetY = 80 + Math.random() * (H - 160)
        }
        this.vx += (dx / d) * 0.05 + (Math.random() - 0.5) * 0.14
        this.vy += (dy / d) * 0.05 + (Math.random() - 0.5) * 0.14
        const spd = Math.hypot(this.vx, this.vy)
        if (spd > this.speed) { this.vx *= this.speed / spd; this.vy *= this.speed / spd }
        this.angle = Math.atan2(this.vy, this.vx)
        this.x += this.vx; this.y += this.vy
      }

      draw() {
        if (!this.alive && this.deathAlpha <= 0) return
        const a = this.dying ? Math.max(0, this.deathAlpha) : this.alpha
        const rot = this.dying ? Math.PI + this.deathRot : this.angle
        if (this.type === 0) drawCockroach(this.x, this.y, rot, this.size, a, this.wiggle)
        else if (this.type === 1) drawTermite(this.x, this.y, rot, this.size, a, this.wiggle)
        else drawMosquito(this.x, this.y, rot, this.size, a, this.wiggle)
      }

      kill() {
        this.alive = false; this.dying = true
        this.vx = (Math.random() - 0.5) * 5
        this.vy = -3 - Math.random() * 4
        for (let i = 0; i < 10; i++) {
          particles.push(new Particle(this.x, this.y))
        }
      }
    }

    // ── SHIELD WAVE CLASS ──────────────────────────────────────────────────
    class ShieldWave {
      cx: number; cy: number; r = 0; maxR: number; done = false; speed = 16

      constructor() {
        this.cx = W / 2; this.cy = H / 2
        this.maxR = Math.hypot(W, H) * 0.65
      }

      update(onKill: (count: number) => void) {
        this.r += this.speed
        let killed = 0
        bugs.forEach(b => {
          if (!b.alive) return
          const d = Math.hypot(b.x - this.cx, b.y - this.cy)
          if (d < this.r + 18 && d > this.r - 30) { b.kill(); killed++ }
        })
        if (killed > 0) onKill(killed)
        if (this.r > this.maxR) this.done = true
      }

      draw() {
        const prog = this.r / this.maxR

        // Main ring
        ctx.strokeStyle = `rgba(255,59,47,${(1 - prog) * 0.9})`
        ctx.lineWidth = 2.5
        ctx.beginPath(); ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2); ctx.stroke()

        // Inner glow
        const rg = ctx.createRadialGradient(
          this.cx, this.cy, Math.max(0, this.r - 60),
          this.cx, this.cy, this.r
        )
        rg.addColorStop(0, 'rgba(255,59,47,0)')
        rg.addColorStop(0.6, 'rgba(255,59,47,0.03)')
        rg.addColorStop(1, 'rgba(255,59,47,0.12)')
        ctx.fillStyle = rg
        ctx.beginPath(); ctx.arc(this.cx, this.cy, this.r, 0, Math.PI * 2); ctx.fill()

        // Echo rings
        for (let i = 1; i <= 4; i++) {
          const er = this.r - i * 16
          if (er > 0) {
            ctx.strokeStyle = `rgba(255,59,47,${(1 - prog) * 0.15 / i})`
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.arc(this.cx, this.cy, er, 0, Math.PI * 2); ctx.stroke()
          }
        }
      }
    }

    // ── INIT 32 BUGS spread across the canvas ──────────────────────────────
    for (let i = 0; i < 32; i++) {
      const b = new Bug()
      b.x = 80 + Math.random() * Math.max(1, W - 160)
      b.y = 80 + Math.random() * Math.max(1, H - 160)
      b.alpha = Math.random() * 0.8
      bugs.push(b)
    }

    // ── TRIGGER SHIELD ──────────────────────────────────────────────────────
    function triggerShield() {
      if (shieldWave && !shieldWave.done) return
      shieldWave = new ShieldWave()
      // Respawn bugs after 3.5s
      setTimeout(() => {
        for (let i = 0; i < 22; i++) {
          setTimeout(() => {
            const b = new Bug(); b.alpha = 0; bugs.push(b)
          }, i * 180)
        }
      }, 3500)
    }
    window.triggerPestShield = triggerShield

    // ── RENDER LOOP ─────────────────────────────────────────────────────────
    function render() {
      ctx.fillStyle = '#07050A'
      ctx.fillRect(0, 0, W, H)

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.022)'; ctx.lineWidth = 1
      for (let gx = 0; gx < W; gx += 80) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke()
      }
      for (let gy = 0; gy < H; gy += 80) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke()
      }

      // Vignette
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(0,0,0,0.75)')
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H)

      // Bugs
      bugs.forEach(b => b.update())
      bugs.forEach(b => b.draw())
      bugs = bugs.filter(b => b.deathAlpha > 0 || b.alive)

      // Shield
      if (shieldWave && !shieldWave.done) {
        shieldWave.update((n) => {
          elimTotal += n
          window.dispatchEvent(new CustomEvent('pestKilled', { detail: elimTotal }))
        })
        shieldWave.draw()
      }

      // Particles
      ctx.save()
      particles.forEach(p => { p.update(); p.draw() })
      particles = particles.filter(p => p.life > 0)
      ctx.restore()
      ctx.globalAlpha = 1

      // Respawn if depleted
      if (bugs.filter(b => b.alive).length < 18 && (!shieldWave || shieldWave.done)) {
        bugs.push(new Bug())
      }

      raf = requestAnimationFrame(render)
    }
    render()

    // ── CLICK TO KILL ───────────────────────────────────────────────────────
    function handleClick(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      let nearest: Bug | null = null
      let minD = 55
      bugs.forEach(b => {
        if (!b.alive) return
        const d = Math.hypot(b.x - mx, b.y - my)
        if (d < minD) { minD = d; nearest = b }
      })
      if (nearest) {
        ;(nearest as Bug).kill()
        elimTotal++
        window.dispatchEvent(new CustomEvent('pestKilled', { detail: elimTotal }))
      }
    }
    canvas.addEventListener('click', handleClick)

    // ── PAUSE ON HIDDEN TAB ─────────────────────────────────────────────────
    function handleVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        raf = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('click', handleClick)
      document.removeEventListener('visibilitychange', handleVisibility)
      delete window.triggerPestShield
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0, cursor: 'crosshair' }}
      aria-hidden="true"
    />
  )
}

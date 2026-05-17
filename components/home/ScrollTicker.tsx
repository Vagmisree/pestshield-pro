'use client'

const items = [
  'Cockroach Control',
  'Termite Treatment',
  'Rodent Control',
  'Mosquito Fogging',
  'Bed Bug Removal',
  'General Pest Control',
]

const doubled = [...items, ...items]

export function ScrollTicker() {
  return (
    <div className="bg-forest-950 py-4 overflow-hidden ticker-mask">
      <div className="flex scroll-ticker">
        {doubled.map((item, i) => (
          <div key={i} className="flex shrink-0 items-center">
            <span className="font-display font-black text-4xl text-white whitespace-nowrap px-4">{item}</span>
            <span className="text-emerald-400 text-3xl mx-6">🌿</span>
          </div>
        ))}
      </div>
    </div>
  )
}

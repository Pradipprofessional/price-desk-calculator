import { useState } from 'react'
import './App.css'

type CalculationMode = 'discounted' | 'reverse'

function decodeSellingPrice(value: string) {
  return value
    .toUpperCase()
    .split('')
    .map((character) => {
      if (/[A-I]/.test(character)) return String(character.charCodeAt(0) - 64)
      if (character === 'Z') return '0'
      return character
    })
    .join('')
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value)
}

function App() {
  const [mode, setMode] = useState<CalculationMode>('discounted')
  const [basePrice, setBasePrice] = useState('')
  const [discount, setDiscount] = useState('')

  const decodedPrice = mode === 'reverse' ? decodeSellingPrice(basePrice) : basePrice
  const price = Number(decodedPrice)
  const discountRate = Number(discount)
  const hasPrice = basePrice !== '' && Number.isFinite(price) && price >= 0
  const hasEncodedPrice = mode === 'reverse' && /[A-IZ]/i.test(basePrice)
  const hasDiscount = discount !== '' && Number.isFinite(discountRate) && discountRate >= 0 && discountRate < 100
  const result = hasPrice && hasDiscount
    ? mode === 'discounted'
      ? Math.round(price * (1 - discountRate / 100))
      : Math.round(price / (1 - discountRate / 100))
    : null
  function changeMode(nextMode: CalculationMode) {
    if (nextMode === mode) return
    setMode(nextMode)
    setBasePrice('')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Price Desk home">
          <span className="wordmark-mark">P<span>·</span></span>
          <span>PRICE DESK</span>
        </a>
        <div className="topbar-note"><span className="status-dot" /> RETAIL TOOLS <span className="topbar-divider">/</span> 01</div>
      </header>

      <section className="intro" id="top">
        <div className="intro-copy">
          <p className="eyebrow">THE COUNTER TOOLKIT <span>—</span> 01</p>
          <h1>Get the right<br /><em>number.</em></h1>
        </div>
        <p className="intro-note">Quick price math and encoded selling prices,<br />without leaving the counter.</p>
        <div className="intro-index" aria-hidden="true">01</div>
      </section>

      <section className="workspace" aria-label="Retail calculator tools">
        <article className="price-tool">
          <div className="tool-heading">
            <div className="tool-heading-copy">
              <p className="eyebrow">PRICE CALCULATOR</p>
              <h2>Work out a price</h2>
            </div>
            <span className="tool-index">01 / 01</span>
          </div>

          <div className="mode-switch" role="tablist" aria-label="Price calculation direction">
            <button
              className={mode === 'discounted' ? 'mode-button active' : 'mode-button'}
              onClick={() => changeMode('discounted')}
              role="tab"
              aria-selected={mode === 'discounted'}
            >
              <span className="mode-step">A</span> MRP <span className="mode-arrow">→</span> Selling price
            </button>
            <button
              className={mode === 'reverse' ? 'mode-button active' : 'mode-button'}
              onClick={() => changeMode('reverse')}
              role="tab"
              aria-selected={mode === 'reverse'}
            >
              <span className="mode-step">B</span> Selling price <span className="mode-arrow">→</span> MRP
            </button>
          </div>

          <div className="input-row">
            <label className="field">
              <span className="field-label">{mode === 'discounted' ? 'MRP' : 'Selling price or code'}</span>
              <span className="input-wrap">
                <span className="currency-mark">₹</span>
                <input
                  aria-label={mode === 'discounted' ? 'MRP' : 'Selling price or code'}
                  type={mode === 'discounted' ? 'number' : 'text'}
                  min={mode === 'discounted' ? '0' : undefined}
                  step={mode === 'discounted' ? 'any' : undefined}
                  inputMode={mode === 'discounted' ? 'decimal' : 'text'}
                  placeholder={mode === 'discounted' ? '0.00' : 'e.g. 1200 or ABC'}
                  value={basePrice}
                  onChange={(event) => setBasePrice(
                    mode === 'discounted'
                      ? event.target.value
                      : event.target.value.replace(/[^a-iz0-9]/gi, '').toUpperCase(),
                  )}
                />
              </span>
              {mode === 'reverse' && (
                <span className="selling-price-hint">
                  {hasEncodedPrice
                    ? `Code value: ₹${formatPrice(Number(decodedPrice))}`
                    : 'A-I = 1-9 · Z = 0'}
                </span>
              )}
            </label>
            <label className="field discount-field">
              <span className="field-label">Discount</span>
              <span className="input-wrap">
                <input
                  aria-label="Discount percentage"
                  type="number"
                  min="0"
                  max="99.99"
                  step="any"
                  inputMode="decimal"
                  placeholder="0"
                  value={discount}
                  onChange={(event) => setDiscount(event.target.value)}
                />
                <span className="suffix-mark">%</span>
              </span>
            </label>
          </div>

          <div className="result-panel" aria-live="polite">
            <div className="result-copy">
              <span className="result-label">{mode === 'discounted' ? 'SELLING PRICE' : 'MRP'}</span>
              <span className="result-helper">Rounded to the nearest rupee</span>
            </div>
            <div className="result-value">
              {result === null ? <span className="result-placeholder">—</span> : <><span className="result-currency">₹</span>{formatPrice(result)}</>}
            </div>
          </div>
          {discount !== '' && (!Number.isFinite(discountRate) || discountRate < 0 || discountRate >= 100) && (
            <p className="field-error" role="alert">Enter a discount from 0% to less than 100%.</p>
          )}
          <p className="calculation-note">
            {mode === 'discounted'
              ? 'Selling price = MRP × (1 − discount ÷ 100)'
              : 'MRP = selling price ÷ (1 − discount ÷ 100)'}
          </p>
        </article>

      </section>

      <footer className="footer">
        <span>PRICE DESK <span className="footer-dot">·</span> BUILT FOR THE COUNTER</span>
        <span>01—01 <span className="footer-line" /> READY</span>
      </footer>
    </main>
  )
}

export default App

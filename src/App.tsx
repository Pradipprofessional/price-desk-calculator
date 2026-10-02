import { useEffect, useState } from 'react'
import './App.css'

type CalculationMode = 'discounted' | 'reverse'
type Language = 'en' | 'hi'

const translations = {
  en: {
    documentTitle: 'Price Desk | Retail calculator',
    languageGroupLabel: 'Choose language',
    english: 'English',
    hindi: 'हिन्दी',
    headerNote: 'RETAIL TOOLS',
    introEyebrow: 'THE COUNTER TOOLKIT',
    headlineFirst: 'Get the right',
    headlineSecond: 'number.',
    introNote: 'Quick price math and encoded selling prices,',
    introNoteSecond: 'without leaving the counter.',
    workspaceLabel: 'Retail price calculator',
    calculatorEyebrow: 'PRICE CALCULATOR',
    calculatorHeading: 'Work out a price',
    modeLabel: 'Price calculation direction',
    mrpToSelling: 'MRP → Selling price',
    sellingToMrp: 'Selling price → MRP',
    mrp: 'MRP',
    sellingPriceOrCode: 'Selling price or code',
    sellingPricePlaceholder: 'e.g. 1200 or ABC',
    codeHint: 'Code: A-I = 1-9 · Z = 0',
    codeValue: (value: string) => `Code value: ₹${value}`,
    discount: 'Discount',
    discountAriaLabel: 'Discount percentage',
    popularDiscounts: 'Popular discount presets',
    mrpResultLabel: 'MRP',
    sellingPrice: 'SELLING PRICE',
    roundedResult: 'Rounded to the nearest rupee',
    validationError: 'Enter a discount from 0% to less than 100%.',
    sellingPriceFormula: 'Selling price = MRP × (1 − discount ÷ 100)',
    mrpFormula: 'MRP = selling price ÷ (1 − discount ÷ 100)',
    footerTagline: 'BUILT FOR THE COUNTER',
    footerStatus: 'READY',
  },
  hi: {
    documentTitle: 'Price Desk | मूल्य कैलकुलेटर',
    languageGroupLabel: 'भाषा चुनें',
    english: 'English',
    hindi: 'हिन्दी',
    headerNote: 'दुकान के टूल',
    introEyebrow: 'काउंटर के लिए कैलकुलेटर',
    headlineFirst: 'सही कीमत',
    headlineSecond: 'जानें।',
    introNote: 'कीमत और छूट की गणना,',
    introNoteSecond: 'सीधे काउंटर पर।',
    workspaceLabel: 'खुदरा मूल्य कैलकुलेटर',
    calculatorEyebrow: 'कीमत कैलकुलेटर',
    calculatorHeading: 'कीमत निकालें',
    modeLabel: 'कीमत की गणना का तरीका',
    mrpToSelling: 'MRP → बेचने का दाम',
    sellingToMrp: 'बेचने का दाम → MRP',
    mrp: 'MRP (अधिकतम खुदरा मूल्य)',
    sellingPriceOrCode: 'बेचने का दाम या कोड',
    sellingPricePlaceholder: 'जैसे 1200 या ABC',
    codeHint: 'कोड: A-I = 1-9 · Z = 0',
    codeValue: (value: string) => `कोड से कीमत: ₹${value}`,
    discount: 'छूट',
    discountAriaLabel: 'छूट प्रतिशत',
    popularDiscounts: 'आम छूट चुनें',
    mrpResultLabel: 'MRP',
    sellingPrice: 'बेचने का दाम',
    roundedResult: 'नजदीकी पूरे रुपये में',
    validationError: 'छूट 0% या उससे अधिक और 100% से कम डालें।',
    sellingPriceFormula: 'बेचने का दाम = MRP × (1 − छूट ÷ 100)',
    mrpFormula: 'MRP = बेचने का दाम ÷ (1 − छूट ÷ 100)',
    footerTagline: 'दुकान के काम के लिए',
    footerStatus: 'तैयार',
  },
} as const

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
  const [mode, setMode] = useState<CalculationMode>('reverse')
  const [basePrice, setBasePrice] = useState('')
  const [discount, setDiscount] = useState('')
  const [language, setLanguage] = useState<Language>(() => (
    localStorage.getItem('priceDeskLanguage') === 'en' ? 'en' : 'hi'
  ))
  const text = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
    document.title = text.documentTitle
  }, [language, text.documentTitle])

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

  function changeLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage)
    localStorage.setItem('priceDeskLanguage', nextLanguage)
  }

  return (
    <main className={language === 'hi' ? 'app-shell lang-hi' : 'app-shell'}>
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Price Desk home">
          <span className="wordmark-mark">P<span>·</span></span>
          <span>PRICE DESK</span>
        </a>
        <div className="topbar-actions">
          <div className="topbar-note"><span className="status-dot" /> {text.headerNote} <span className="topbar-divider">/</span> 01</div>
          <div className="language-switch" role="group" aria-label={text.languageGroupLabel}>
            <button aria-pressed={language === 'en'} onClick={() => changeLanguage('en')} type="button">{text.english}</button>
            <button aria-pressed={language === 'hi'} onClick={() => changeLanguage('hi')} type="button">{text.hindi}</button>
          </div>
        </div>
      </header>

      <section className="intro" id="top">
        <div className="intro-copy">
          <p className="eyebrow">{text.introEyebrow} <span>—</span> 01</p>
          <h1>{text.headlineFirst}<br /><em>{text.headlineSecond}</em></h1>
        </div>
        <p className="intro-note">{text.introNote}<br />{text.introNoteSecond}</p>
        <div className="intro-index" aria-hidden="true">01</div>
      </section>

      <section className="workspace" aria-label={text.workspaceLabel}>
        <article className="price-tool">
          <div className="tool-heading">
            <div className="tool-heading-copy">
              <p className="eyebrow">{text.calculatorEyebrow}</p>
              <h2>{text.calculatorHeading}</h2>
            </div>
            <span className="tool-index">01 / 01</span>
          </div>

          <div className="mode-switch" role="tablist" aria-label={text.modeLabel}>
            <button
              className={mode === 'discounted' ? 'mode-button active' : 'mode-button'}
              onClick={() => changeMode('discounted')}
              role="tab"
              aria-selected={mode === 'discounted'}
            >
              <span className="mode-step">A</span> {text.mrpToSelling}
            </button>
            <button
              className={mode === 'reverse' ? 'mode-button active' : 'mode-button'}
              onClick={() => changeMode('reverse')}
              role="tab"
              aria-selected={mode === 'reverse'}
            >
              <span className="mode-step">B</span> {text.sellingToMrp}
            </button>
          </div>

          <div className="input-row">
            <label className="field">
              <span className="field-label">{mode === 'discounted' ? text.mrp : text.sellingPriceOrCode}</span>
              <span className="input-wrap">
                <span className="currency-mark">₹</span>
                <input
                  aria-label={mode === 'discounted' ? text.mrp : text.sellingPriceOrCode}
                  type={mode === 'discounted' ? 'number' : 'text'}
                  min={mode === 'discounted' ? '0' : undefined}
                  step={mode === 'discounted' ? 'any' : undefined}
                  inputMode={mode === 'discounted' ? 'decimal' : 'text'}
                  placeholder={mode === 'discounted' ? '0.00' : text.sellingPricePlaceholder}
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
                    ? text.codeValue(formatPrice(Number(decodedPrice)))
                    : text.codeHint}
                </span>
              )}
            </label>
            <div className="field discount-field">
              <label className="field-label" htmlFor="discount-input">{text.discount}</label>
              <span className="input-wrap">
                <input
                  id="discount-input"
                  aria-label={text.discountAriaLabel}
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
              <div className="discount-presets" aria-label={text.popularDiscounts}>
                {[15, 30, 50, 70].map((percentage) => (
                  <button
                    aria-pressed={Number(discount) === percentage}
                    className={Number(discount) === percentage ? 'discount-chip selected' : 'discount-chip'}
                    key={percentage}
                    onClick={() => setDiscount(String(percentage))}
                    type="button"
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="result-panel" aria-live="polite">
            <div className="result-copy">
              <span className="result-label">{mode === 'discounted' ? text.sellingPrice : text.mrpResultLabel}</span>
              <span className="result-helper">{text.roundedResult}</span>
            </div>
            <div className="result-value">
              {result === null ? <span className="result-placeholder">—</span> : <><span className="result-currency">₹</span>{formatPrice(result)}</>}
            </div>
          </div>
          {discount !== '' && (!Number.isFinite(discountRate) || discountRate < 0 || discountRate >= 100) && (
            <p className="field-error" role="alert">{text.validationError}</p>
          )}
          <p className="calculation-note">
            {mode === 'discounted'
              ? text.sellingPriceFormula
              : text.mrpFormula}
          </p>
        </article>

      </section>

      <footer className="footer">
        <span>PRICE DESK <span className="footer-dot">·</span> {text.footerTagline}</span>
        <span>01—01 <span className="footer-line" /> {text.footerStatus}</span>
      </footer>
    </main>
  )
}

export default App

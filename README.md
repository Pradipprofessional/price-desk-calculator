# Price Desk

A small React + TypeScript utility for retail counter price calculations and alphabet-to-digit codes.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Price calculations

- MRP to selling price: selling price = MRP × (1 − discount / 100)
- Selling price to MRP: MRP = selling price / (1 − discount / 100)
- Calculated prices are rounded to the nearest whole rupee.
- Discounts must be at least 0% and less than 100%.

## Selling-price codes

In reverse mode, enter a numeric selling price or an alphabet code in the Selling price field. A-I decode to 1-9 and Z decodes to 0. Input is case-insensitive and unsupported characters are ignored.

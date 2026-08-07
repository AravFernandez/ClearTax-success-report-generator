# ClearTax Success Report Generator

Automatically generates professional PNG success reports for multiple companies using an HTML template and Puppeteer.

---

## Features

- Generates one report per company
- Reads data from a CSV file
- Automatically calculates:
  - Growth %
  - Additional ITRs Filed
  - Performance Summary
  - Bar Heights
- Exports high-resolution PNG images
- Uses a single HTML/CSS template for all companies

---

## Project Structure

```
Success Report Generator/

├── assets/
│   └── cleartax-logo.png
│
├── data/
│   └── Success_Report_Data.csv
│
├── output/
│   └── (Generated PNG reports)
│
├── index.html
├── style.css
├── script.js
├── generate.js
├── Generate Reports.bat
├── package.json
└── README.md
```

---

# First Time Setup

## 1. Install Node.js

Download and install the **LTS version** from:

https://nodejs.org/

---

## 2. Download this project

Either:

- Clone the GitHub repository

OR

- Download the ZIP and extract it.

---

## 3. Install project dependencies

Open Command Prompt inside the project folder.

Run:

```bash
npm install
```

This installs all required packages automatically.

This only needs to be done **once**.

---

# Generating Reports

## Step 1

Open:

```
data/Success_Report_Data.csv
```

Update the following columns:

| Company | Previous | Current | Traffic | Coupon |
|----------|----------|----------|----------|----------|

Save the file.

---

## Step 2

Double-click:

```
Generate Reports.bat
```

Wait until the generation completes.

---

## Step 3

Open:

```
output/
```

All generated PNG reports will be available there.

---

# Notes

- Do not modify the HTML, CSS or JavaScript files unless making template changes.
- Only update the CSV file before generating reports.
- Generated PNGs are overwritten each time the generator is run.

---

Developed for ClearTax Internal Reporting.

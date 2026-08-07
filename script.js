// ==============================
// Load the JSON file
// ==============================

async function loadReport(){

    const response = await fetch("data/companies.json");

    const companies = await response.json();

    window.renderReport(companies[0]);

}

// ==============================
// Render one report
// ==============================

function renderReport(report) {

    const previous = report.previous;
    const current = report.current;

    const additional = current - previous;
    const growth = ((additional / previous) * 100);

    // Company
    document.getElementById("company").textContent =
        report.company;

    // Coupon
    document.getElementById("coupon").textContent =
        report.coupon;

    // Traffic
    document.getElementById("traffic").textContent =
        report.traffic.toLocaleString();

    // Filing Numbers
    document.getElementById("previous-filing").textContent =
        previous.toLocaleString();

    document.getElementById("current-filing").textContent =
        current.toLocaleString();

    document.getElementById("total-filings").textContent =
        current.toLocaleString();

    // Growth
    document.getElementById("growth-pill").textContent =
        `▲ ${growth.toFixed(1)}%`;

    // Additional Filings
    document.getElementById("additional-filings").textContent =
        `+${additional.toLocaleString()}`;

    // Summary
    document.getElementById("summary-text").innerHTML =
        `Employee filings increased by <strong>${growth.toFixed(1)}%</strong>, resulting in <strong>${additional.toLocaleString()} additional returns</strong> compared to the previous filing season.`;

    // Update graph bars
    scaleBars(previous, current);

}

// ==============================
// Scale the two bars
// ==============================

function scaleBars(previous, current) {

    const previousBar = document.getElementById("previous-bar");
    const currentBar = document.getElementById("current-bar");
    const growthPill = document.getElementById("growth-pill");

    const MAX_HEIGHT = 410;
    const MIN_HEIGHT = 120;

    const maxValue = Math.max(previous, current);

    if (maxValue === 0) {

        previousBar.style.height = MIN_HEIGHT + "px";
        currentBar.style.height = MIN_HEIGHT + "px";

        return;
    }

    const previousHeight = Math.max(
        Math.round(previous / maxValue * MAX_HEIGHT),
        MIN_HEIGHT
    );

    const currentHeight = Math.max(
        Math.round(current / maxValue * MAX_HEIGHT),
        MIN_HEIGHT
    );

    previousBar.style.height = previousHeight + "px";
    currentBar.style.height = currentHeight + "px";

    // Position the growth pill dynamically
    const averageHeight = (previousHeight + currentHeight) / 2;

    growthPill.style.bottom = (averageHeight + 50) + "px";
}
// ==============================
// Start
// ==============================

window.renderReport = renderReport;

loadReport();
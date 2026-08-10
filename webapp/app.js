/* =========================================================
   CLEARTAX SUCCESS REPORT WEB APP
========================================================= */

const companyInput = document.getElementById("companyInput");
const previousInput = document.getElementById("previousInput");
const currentInput = document.getElementById("currentInput");
const trafficInput = document.getElementById("trafficInput");
const couponInput = document.getElementById("couponInput");

const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const status = document.getElementById("status");


/* =========================================================
   REPORT ELEMENTS
========================================================= */

const report = document.getElementById("report");

const rCompany = document.getElementById("rCompany");
const rPrevious = document.getElementById("rPrevious");
const rCurrent = document.getElementById("rCurrent");
const rTraffic = document.getElementById("rTraffic");
const rCoupon = document.getElementById("rCoupon");

const rTotal = document.getElementById("rTotal");
const rAdditional = document.getElementById("rAdditional");

const rGrowth = document.getElementById("rGrowth");
const rSummary = document.getElementById("rSummary");

const previousBar = document.getElementById("previousBar");
const currentBar = document.getElementById("currentBar");


/* =========================================================
   DEFAULT VALUES
========================================================= */

const DEFAULT_DATA = {

    company: "Company",

    previous: 0,

    current: 0,

    traffic: 0,

    coupon: "CTX"

};


/* =========================================================
   NUMBER FORMATTER
========================================================= */

function formatNumber(value){

    return Number(value || 0).toLocaleString("en-IN");

}


/* =========================================================
   GET FORM DATA
========================================================= */

function getFormData(){

    return {

        company:
            companyInput.value.trim(),

        previous:
            Math.max(
                0,
                Number(previousInput.value) || 0
            ),

        current:
            Math.max(
                0,
                Number(currentInput.value) || 0
            ),

        traffic:
            Math.max(
                0,
                Number(trafficInput.value) || 0
            ),

        coupon:
            couponInput.value.trim(),

    };

}


/* =========================================================
   CALCULATE METRICS
========================================================= */

function calculateMetrics(data){

    let growth = 0;

    if(data.previous === 0){

        growth =
            data.current > 0
                ? 100
                : 0;

    }else{

        growth =
            ((data.current - data.previous)
            / data.previous) * 100;

    }


    const additional =
        data.current - data.previous;


    return {

        growth,

        additional

    };

}


/* =========================================================
   SCALE BARS
========================================================= */

function scaleBars(previous, current){

    const MAX_HEIGHT = 410;

    const MIN_HEIGHT = 120;

    const maxValue =
        Math.max(
            previous,
            current,
            1
        );


    let previousHeight =
        Math.round(
            (previous / maxValue)
            * MAX_HEIGHT
        );


    let currentHeight =
        Math.round(
            (current / maxValue)
            * MAX_HEIGHT
        );


    /*
        Make sure a very small value
        is still visible.
    */

    previousHeight =
        Math.max(
            previousHeight,
            MIN_HEIGHT
        );


    currentHeight =
        Math.max(
            currentHeight,
            MIN_HEIGHT
        );


    previousBar.style.height =
        previousHeight + "px";


    currentBar.style.height =
        currentHeight + "px";


    /*
        Put the growth pill above
        the shorter bar.
    */

    const shorterBar =
        Math.min(
            previousHeight,
            currentHeight
        );


    rGrowth.style.bottom =
        (shorterBar + 35) + "px";

}


/* =========================================================
   UPDATE REPORT
========================================================= */

function updateReport(){

    const data =
        getFormData();


    const metrics =
        calculateMetrics(data);


    /* -----------------------------------------
       HEADER
    ----------------------------------------- */

    rCompany.textContent =
        data.company;


    /* -----------------------------------------
       CHART NUMBERS
    ----------------------------------------- */

    rPrevious.textContent =
        formatNumber(data.previous);


    rCurrent.textContent =
        formatNumber(data.current);


    /* -----------------------------------------
       TRAFFIC
    ----------------------------------------- */

    rTraffic.textContent =
        formatNumber(data.traffic);


    /* -----------------------------------------
       TOTAL FILINGS
    ----------------------------------------- */

    rTotal.textContent =
        formatNumber(data.current);


    /* -----------------------------------------
       ADDITIONAL FILINGS
    ----------------------------------------- */

    const additionalPrefix =
        metrics.additional >= 0
            ? "+"
            : "";


    rAdditional.textContent =
        additionalPrefix +
        formatNumber(metrics.additional);


    /* -----------------------------------------
       COUPON
    ----------------------------------------- */

    rCoupon.textContent =
        data.coupon;


    /* -----------------------------------------
       GROWTH
    ----------------------------------------- */

    rGrowth.textContent =
        "▲ " +
        metrics.growth.toFixed(1) +
        "%";


    /* -----------------------------------------
       SUMMARY
    ----------------------------------------- */

    const additionalText =
        Math.abs(metrics.additional);


    if(metrics.additional >= 0){

        rSummary.innerHTML =

            `Employee filings increased by
            <strong>${metrics.growth.toFixed(1)}%</strong>,
            resulting in
            <strong>${formatNumber(additionalText)}
            additional returns</strong>
            compared to last year.`;

    }else{

        rSummary.innerHTML =

            `Employee filings changed by
            <strong>${metrics.growth.toFixed(1)}%</strong>,
            resulting in
            <strong>${formatNumber(additionalText)}
            fewer returns</strong>
            compared to last year.`;

    }


    /* -----------------------------------------
       BARS
    ----------------------------------------- */

    scaleBars(
        data.previous,
        data.current
    );

}


/* =========================================================
   INPUT EVENT LISTENERS
========================================================= */

companyInput.addEventListener(
    "input",
    updateReport
);

previousInput.addEventListener(
    "input",
    updateReport
);

currentInput.addEventListener(
    "input",
    updateReport
);

trafficInput.addEventListener(
    "input",
    updateReport
);

couponInput.addEventListener(
    "input",
    updateReport
);


/* =========================================================
   RESET
========================================================= */

resetBtn.addEventListener(
    "click",
    function(){

        companyInput.value =
            DEFAULT_DATA.company;

        previousInput.value =
            DEFAULT_DATA.previous;

        currentInput.value =
            DEFAULT_DATA.current;

        trafficInput.value =
            DEFAULT_DATA.traffic;

        couponInput.value =
            DEFAULT_DATA.coupon;


        status.textContent = "";


        updateReport();

    }
);


/* =========================================================
   SANITIZE FILE NAME
========================================================= */

function sanitizeFileName(name){

    return name

        .replace(
            /[<>:"/\\|?*]/g,
            ""
        )

        .replace(
            /\s+/g,
            "_"
        )

        .trim();

}


/* =========================================================
   DOWNLOAD REPORT
========================================================= */

downloadBtn.addEventListener(
    "click",
    async function(){

        const data =
            getFormData();


        /*
            html2canvas is loaded dynamically
            so the web app does not require
            npm or Node.js.
        */

        downloadBtn.disabled =
            true;


        downloadBtn.textContent =
            "Generating...";


        status.textContent =
            "Preparing report...";


        try{

            /*
                Load html2canvas if it hasn't
                already been loaded.
            */

            if(!window.html2canvas){

                await loadHtml2Canvas();

            }


            /*
                Give the browser a moment to
                finish rendering the updated
                bars and text.
            */

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        150
                    )
            );


                const canvas =
                    await window.html2canvas(
                        report,
                        {

                            scale: 2,

                            useCORS: true,

                            allowTaint: false,

                            backgroundColor: "#FFFFFF",

                            foreignObjectRendering: true,

                            width: report.scrollWidth,

                            height: report.scrollHeight

                        }
                    );

            /*
                Create PNG download.
            */

            const link =
                document.createElement("a");


            const fileName =
                sanitizeFileName(
                    data.company
                );


            link.download =
                fileName +
                "_Success_Report.png";


            link.href =
                canvas.toDataURL(
                    "image/png"
                );


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            status.textContent =
                "Report downloaded successfully.";


        }catch(error){

            console.error(
                "Report generation error:",
                error
            );


            status.textContent =
                "Unable to generate the report. Please try again.";

        }


        downloadBtn.disabled =
            false;


        downloadBtn.textContent =
            "Download Success Report";

    }
);


/* =========================================================
   LOAD HTML2CANVAS
========================================================= */

function loadHtml2Canvas(){

    return new Promise(
        function(resolve, reject){

            /*
                Don't load it twice.
            */

            if(window.html2canvas){

                resolve();

                return;

            }


            const script =
                document.createElement(
                    "script"
                );


            script.src =
                "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";


            script.onload =
                function(){

                    resolve();

                };


            script.onerror =
                function(){

                    reject(
                        new Error(
                            "Could not load html2canvas."
                        )
                    );

                };


            document.head.appendChild(
                script
            );

        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

companyInput.value =
    DEFAULT_DATA.company;

previousInput.value =
    DEFAULT_DATA.previous;

currentInput.value =
    DEFAULT_DATA.current;

trafficInput.value =
    DEFAULT_DATA.traffic;

couponInput.value =
    DEFAULT_DATA.coupon;


updateReport();
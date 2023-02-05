// Array of API keys and their respective secrets, too add more just replicate an array and modify it's value.
let apiKeys = [
        {
            key: "",
            secret: ""
        },
        {
            key: "",
            secret: ""
        },
        {
            key: "",
            secret: ""
        },
    ],


    // URL for the CORS Proxy
    cors_api_url = "https://corsproxy.io/?",

    // High Value Domains Price Filter
    highValuePriceFilter = 2000,

    checkedDomains = new Set(),

    index = 0,

    keyIndex = 0,

    domains,

    timeoutId,

    requestsCount = 0,

    dn,

    sortEnabled = true,

    oldInnerHTML,


    domainsData = [];

// Calc for delays between appraisals.
let countOfApiKeys = 0;
for (let i = 0; i < apiKeys.length; i++) {
    let key = apiKeys[i];
    if (key.key && key.secret) {
        countOfApiKeys++;
    }
}
let result = countOfApiKeys * 20;
let delay = 60000 / result;

function appraiseDomains() {
    sortEnabled = false;
    if (!cors_api_url) {
        return alert("Please set the 'cors_api_url' variable before proceeding.");
    }
    if (!apiKeys.some(apiKey => apiKey.key && apiKey.secret)) {
        return alert("Please set the 'apiKey' values before proceeding.");
    }
    var e = document.getElementById("textarea-form5-k");

    if (e.value) {
        domains = e.value.split("\n").map(domain => {
            domain = domain.replace(/\s/g, '');
            if (domain.length > 0 && !domain.includes(".")) {
                domain += ".com";
            }
            return domain;
        });
        index = 0;
        checkNextDomain();
    } else {
        alert("Please enter a domain name before submitting!");
    }
}

var retryTimeoutId;

function checkNextDomain() {
    if (!(index >= domains.length)) {
        var e = domains[index++];
        dn = e
        if (0 != e.trim().length) {
            if (checkedDomains.has(e)) {
                checkNextDomain();
            } else {
                checkedDomains.add(e);
                while (!apiKeys[keyIndex].key || !apiKeys[keyIndex].secret) {
                    keyIndex++;
                    if (keyIndex === apiKeys.length) {
                        keyIndex = 0;
                    }
                }
                var t = cors_api_url + "https://api.godaddy.com/v1/appraisal/" + e;
                var n = {
                    method: "GET",
                    headers: {
                        Authorization: "sso-key " + apiKeys[keyIndex].key + ":" + apiKeys[keyIndex].secret
                    }
                };
                requestsCount++;
                if (20 === requestsCount) {
                    keyIndex++;
                    requestsCount = 0;
                    if (keyIndex === apiKeys.length) {
                        keyIndex = 0;
                    }
                }
                var a = [];
                var fetchErrorCount = 0;
                var fetchData = function() {
                    fetch(t, n)
                        .then(response => response.json())
                        .then((e) => {
                            if (e.code === "TOO_MANY_REQUESTS") {
                                var warningDiv = document.createElement("p");
                                var warningText =
                                    "Too many requests, the verifications will resume in " + e.retryAfterSec + " seconds.";
                                warningDiv.innerHTML = warningText;
                                document
                                    .getElementById("warning")
                                    .insertAdjacentHTML("afterbegin", warningDiv.outerHTML);
                                setTimeout(fetchData, e.retryAfterSec * 1000);
                            } else if (e.code === 429) {
                                var warningDiv = document.createElement("p");
                                var warningText =
                                    "Too many requests, the process will resume in 1 minute.";
                                warningDiv.innerHTML = warningText;
                                document
                                    .getElementById("warning")
                                    .insertAdjacentHTML("afterbegin", warningDiv.outerHTML);
                                setTimeout(fetchData, 60000);

                            } else if (e.status === "UNSUPPORTED_DOMAIN") {
                                var warningDiv = document.createElement("p");
                                var warningText = dn + " was skipped, unsupported domain or TLD.";
                                warningDiv.innerHTML = warningText;
                                document
                                    .getElementById("warning")
                                    .insertAdjacentHTML("afterbegin", warningDiv.outerHTML);
                                setTimeout(checkNextDomain, delay);

                            } else if ("OK" === e.status) {
                                var domain = e.domain;
                                var govalue = e.govalue;
                                domainsData.push({
                                    domain: domain,
                                    value: govalue
                                });
                                var resultDiv = document.createElement("div");
                                var text = "Domain: " + domain + "<br>" + "Value: " + govalue;
                                resultDiv.innerHTML = text;
                                document.getElementById("result").insertAdjacentHTML("afterbegin", resultDiv.outerHTML);
                                if (govalue > highValuePriceFilter) {
                                    a.push({
                                        domain: domain,
                                        govalue: govalue
                                    });
                                    var highValueResultDiv = document.createElement("div");
                                    var highValueText = "Domain: " + dn + "<br>" + "Value: " + govalue;
                                    highValueResultDiv.innerHTML = highValueText;
                                    document.getElementById("highValueResult").insertAdjacentHTML("afterbegin", highValueResultDiv.outerHTML);
                                }
                                timeoutId = setTimeout(checkNextDomain, delay);
                            } else {
                                console.error(`Error: ${e.status}`);
                                fetchErrorCount++;
                                if (fetchErrorCount < 3) {
                                    retryTimeoutId = setTimeout(fetchData, delay);
                                } else {
                                    var warningDiv = document.createElement("p");
                                    var warningText =
                                        "Failed to fetch the domain: " + dn + " Error code: " + e.code;
                                    warningDiv.innerHTML = warningText;
                                    document
                                        .getElementById("warning")
                                        .insertAdjacentHTML("afterbegin", warningDiv.outerHTML);
                                    checkNextDomain();
                                }
                            }
                        })
                        .catch((e) => {
                            console.error(`Error appraising domain: ${e}`);
                            fetchErrorCount++;
                            if (fetchErrorCount < 3) {
                                retryTimeoutId = setTimeout(fetchData, delay);
                            } else {
                                var warningDiv = document.createElement("p");
                                var warningText =
                                    "Failed to fetch the domain: " + dn + " Error code: " + e.code;
                                warningDiv.innerHTML = warningText;
                                document
                                    .getElementById("warning")
                                    .insertAdjacentHTML("afterbegin", warningDiv.outerHTML);
                                checkNextDomain();
                            }
                        });
                };
                fetchData();
            }


        } else {
            checkNextDomain();
        }
    } else if (domains.length === index) {
        sortEnabled = true;
    }
}

function exportToCSV() {
    let csv = "domain,value\n";
    let result = document.getElementById("result");
    let rows = result.getElementsByTagName("p");
    for (let i = 0; i < rows.length; i++) {
        let domain = rows[i].textContent.split(" - Value: $")[0];
        let value = rows[i].textContent.split(" - Value: $")[1];
        csv += domain + "," + value + "\n";
    }
    if (!rows.length) {
        domainsData.forEach((domain) => {
            csv += domain.domain + "," + domain.value + "\n";
        });
    }
    let hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = "appraisals.csv";
    hiddenElement.click();
}

function sortDomains() {
    if (!sortEnabled) {
        document.querySelector(".btn-sort").title = "The button has been deactivated, to reactivate stop the appraisal process.";
        return
    }
    if (oldInnerHTML) {
        document.getElementById("result").innerHTML = oldInnerHTML;
        oldInnerHTML = null;
        document.querySelector(".btn-checked").disabled = false;
        document.querySelector(".btn-checked").title = "";
    } else {
        oldInnerHTML = document.getElementById("result").innerHTML;
        domainsData.sort((e, t) => t.value - e.value);
        let e = document.getElementById("result");
        (e.innerHTML = ""),
        domainsData.forEach((t) => {
            let n = document.createElement("p");
            (n.innerHTML = t.domain + " - Value: $" + t.value), e.appendChild(n);
            document.querySelector(".btn-checked").disabled = true;
            document.querySelector(".btn-checked").title = "The button has been deactivated, to reactivate unsort the results.";
        });
    }
}

function clearResults() {
    (document.getElementById("warning").innerHTML = ""),
    (document.getElementById("highValueResult").innerHTML = ""),
    (document.getElementById("result").innerHTML = ""),
    (domains = []),
    (oldInnerHTML = []),
    (domainsData = []),
    (result = []),
    checkedDomains.clear(),
        (index = 0);
}

function clearAllTimeouts() {
    clearTimeout(timeoutId);
    clearTimeout(retryTimeoutId);
}

function copyToClipboard() {
    var result = document.getElementById("result");
    var range = document.createRange();
    range.selectNode(result);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
    document.querySelector(".btn-confirm").innerHTML = "Copied!";
    setTimeout(function() {
        document.querySelector(".btn-confirm").innerHTML = "Copy";
    }, 1200);
}


window.addEventListener("click", function(event) {
    if (event.target.id === "stop") {
        var i = 0;
        var intervalId = setInterval(function() {
            clearAllTimeouts();
            i++;
            if (i >= 30) {
                clearInterval(intervalId);
                clearAllTimeouts();
            }
        }, 50);

        setTimeout(function() {
            clearInterval(intervalId);
            clearAllTimeouts();
        }, 2000);
        sortEnabled = true;
    }
});

// v1.0.0 Code Version - check https://github.com/short443/BDAC/releases/ for updates

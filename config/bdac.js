// An array of API keys and their corresponding secrets.
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

// A function that returns a CORS-enabled URL for the given URL. Default: "https://corsproxy.io/?".
cors = "https://corsproxy.io/?",

// highValuePriceFilter diffines the value of the domains that will be recognized as "HighValue Domains". Default: 2000.
highValuePriceFilter = 2000,

// Beep sound to notify about high value domains. Default: false.
highValueBeep = false,
















// General global variables.
dn,
domains,
index = 0,
keyIndex = 0,
oldInnerHTML,
retryTimeoutId,
sortEnabled,
timeoutId,
requestsCount = 0,
audio = new Audio('assets/audio/hvbeep.mp3'),
notyf = new Notyf(),
checkedDomains = new Map(),
domainsData = [];

// Formula that calculates the number of keys and defines the optimal delay.
let countOfApiKeys = 0;
for (let i = 0; i < apiKeys.length; i++) {
let key = apiKeys[i];
if (key.key && key.secret) {
countOfApiKeys++;
}
}
let result = countOfApiKeys * 20;
let delay = 60000 / result;

// Appraises the domains in the text area.
function appraiseDomains() {
sortEnabled = false;

// Checks if there is content in the <div id="result">
// If there is, the program will warn the user before closing or restarting the page.
setInterval(function() {
if (document.getElementById("result").innerHTML) {
    document.body.setAttribute("onbeforeunload", "return progressAlert()");
} else {
    document.body.removeAttribute("onbeforeunload");
}
}, 300);

// Check if the variable "cors" is set, if not, do not start checking.
if (!cors) {
notyf.error({
    message: 'Please set the "cors" variable in config/bdac.js before proceeding.',
    dismissible: true,
    duration: 7000
})
return
}

// Check if the variable "apiKey" is set, if not, do not start checking.
else if (!apiKeys.some((apiKey) => apiKey.key && apiKey.secret)) {
notyf.error({
    message: 'Please set the "apiKey" variable in config/bdac.js before proceeding.',
    dismissible: true,
    duration: 7000
})
return
}

// Set variable "e" the values in text area "textarea-form5-k".
var e = document.getElementById("textarea-form5-k");

if (e.value) {
// Disable "Evaluate" and "Sort" buttons to avoid data conflicts.
document.querySelector(".btn-checked").disabled = true;
document.querySelector(".btn-checked").title = "The button has been deactivated, stop the appraisal before starting another.";
document.querySelector(".btn-sort").disabled = true;
document.querySelector(".btn-sort").title = "The button has been deactivated, to reactivate stop the appraisal process.";

// Removes spaces and empty lines before sending data for processing.
domains = e.value.split("\n").map((domain) => {
    domain = domain.replace(/\s/g, "");

    // Remove everything before '://'.
    let index = domain.indexOf("://");
    if (index !== -1) {
        domain = domain.substring(index + 3);
    }

    // Remove '/' and anything after it from the end of the domain.
    index = domain.indexOf("/");
    if (index !== -1) {
        domain = domain.substring(0, index);
    }

    // In case of "Keyword" add "".com" at the end of the domain before processing the data.
    if (domain.length > 0 && !domain.includes(".")) {
        domain += ".com";
    }
    return domain;
});

// Starts the check process by calling the function "checkNextDomain()".
index = 0;
checkNextDomain();

// If there is no content in the text area the message below will be returned with no further check.
} else {
notyf.error({
    message: 'Please enter a domain name before submitting!',
    dismissible: true,
    duration: 7000
})
return
}
}

function checkNextDomain() {
    for (; index < domains.length && (0 === domains[index].trim().length || checkedDomains.has(domains[index]));) index++;
    if (index >= domains.length)
        return (
            (sortEnabled = !0),
            (document.querySelector(".btn-checked").disabled = !1),
            (document.querySelector(".btn-checked").title = ""),
            (document.querySelector(".btn-sort").disabled = !1),
            (document.querySelector(".btn-sort").title = ""),
            clearTimeout(timeoutId),
            clearTimeout(retryTimeoutId),
            void notyf.success({
                message: "Verification Completed!",
                dismissible: !1,
                duration: 3500,
            })
        );
    var dn = domains[index++];
    for (checkedDomains.set(dn, !0); !apiKeys[keyIndex].key || !apiKeys[keyIndex].secret;) keyIndex++, keyIndex === apiKeys.length && (keyIndex = 0);
    var url = cors + "https://api.godaddy.com/v1/appraisal/" + dn,
        highValueDomains = [],
        retryCount = 0;
    !(function fetchDomainData() {
        requestsCount++,
        20 === requestsCount && (keyIndex++, keyIndex === apiKeys.length && (keyIndex = 0), (requestsCount = 0)),
            axios
            .get(url, {
                headers: {
                    Authorization: "sso-key " + apiKeys[keyIndex].key + ":" + apiKeys[keyIndex].secret,
                },
                cache: false,
                timeout: 10000
            })
            .then(function(response) {
                if ("OK" === response.data.status) {
                    var domain = response.data.domain,
                        govalue = response.data.govalue

                    domainsData.push({
                        domain: domain,
                        value: govalue,
                    });

                    // create button element with domain and govalue values
                    var button = document.createElement("button");
                    button.innerHTML = "Domain: " + domain + "<br>Value: $" + govalue;
                    button.style.cssText = "display: block; user-select: text; margin-bottom: 5px; text-align: left";
                    button.classList.add("domain-button");
                    button.setAttribute("data-govalue", govalue);

                     // create div element and append the button
                    var div = document.createElement("div");
                    div.appendChild(button);

                    if (govalue >= highValuePriceFilter) {
                        highValueDomains.push({
                            domain: domain,
                            govalue: govalue,
                        });
                        if (highValueBeep){
                            audio.play();
                            }
                        // create button element with domain and govalue values for high value domains
                        var hvButton = document.createElement("button");
                        hvButton.innerHTML = "Domain: " + domain + "<br>Value: $" + govalue;
                        hvButton.classList.add("domain-button");
                        hvButton.style.cssText = "display: block; user-select: text; margin-bottom: 5px; text-align: left";

                        // create div element and append the button for high value domains
                        var hvDiv = document.createElement("div");
                        hvDiv.appendChild(hvButton);

                        notyf.success({
                            message: dn + " appraised in $" + govalue,
                            dismissible: !0,
                            duration: 10000,
                            background: "orange",
                        });
                    }

                    // add div element to result element
                    document.getElementById("result").insertAdjacentElement("afterbegin", div);
                    if (hvDiv) {
                        document.getElementById("highValueResult").insertAdjacentElement("afterbegin", hvDiv);
                    }

                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(checkNextDomain, delay);
                }         
            })
            .catch(function(error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else if ("ECONNABORTED" === error.code && retryCount < 2) {
                    clearTimeout(retryTimeoutId);
                    retryTimeoutId = setTimeout(fetchDomainData, delay);
                    retryCount++;
                } else if (retryCount >= 2) {
                    notyf.error({
                        message: `${dn} - It took too long to respond, this appraisal was skipped.`,
                        dismissible: true,
                        duration: 0,
                    });
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(checkNextDomain, delay);
                } else if (error.response && error.response.data && "TOO_MANY_REQUESTS" === error.response.data.code) {
                    console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.code} Trying again in ${error.response.data.retryAfterSec} seconds.`),
                        notyf.error({
                            message: "Too many requests. Trying again in " + error.response.data.retryAfterSec + " seconds.",
                            dismissible: !0,
                            duration: 1000 * error.response.data.retryAfterSec,
                        });
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(fetchDomainData, 1000 * error.response.data.retryAfterSec);
                } else if (error.response && error.response.data && 429 === error.response.data.code) {
                    console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.code}`);
                    notyf.error({
                        message: "Too many requests (CORS). Trying again in 1 minute.",
                        dismissible: !0,
                        duration: 6e4,
                    });
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(fetchDomainData, 60000);
                } else if (error.response && error.response.data && "UNSUPPORTED_DOMAIN" === error.response.data.status) {
                    console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.status}`);
                    notyf.error({
                        message: dn + " - Unsupported domain, this appraisal was skipped.",
                        dismissible: !0,
                        duration: 0,
                    });
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(checkNextDomain, delay);
                } else if (error.response && error.response.data && "MASKED_DOMAIN" === error.response.data.status) {
                    console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.status}`);
                    notyf.error({
                        message: dn + " - Appraisals are blocked for this domain.",
                        dismissible: !0,
                        duration: 0,
                    });
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(checkNextDomain, delay);
                } else if (error.response && error.response.data && "NOT_FOUND" === error.response.data.code) {
                    console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.code}`);
                    notyf.error({
                        message: dn + " - Not found, this appraisal was skipped.",
                        dismissible: !0,
                        duration: 0,
                    });
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(checkNextDomain, delay);
                } else {
                    if (retryCount < 3) {
                        console.error(error);
                        retryTimeoutId = setTimeout(fetchDomainData, delay);
                        retryCount++;
                    } else {
                        console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.code}`);
                        notyf.error({
                            message: dn + " - Attempt 3 of 3 failed, skipping domain.",
                            dismissible: !0,
                            duration: 0,
                        });
                        clearTimeout(timeoutId);
                        timeoutId = setTimeout(checkNextDomain, delay);
                    }

                }
            });
    })();
}

// Exports the data in the table to a CSV file.
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

// Sorts the domains by their value.
function sortButtons() {
    var resultDiv = document.getElementById("result");
    var buttons = resultDiv.getElementsByTagName("button");
  
    var sortedButtons = Array.from(buttons).sort(function(a, b) {
      var aValue = parseInt(a.getAttribute("data-govalue"));
      var bValue = parseInt(b.getAttribute("data-govalue"));
      return bValue - aValue;
    });
  
    var isSorted = resultDiv.getAttribute("data-sorted") === "true";
  
    if (isSorted) {
      sortedButtons.reverse();
      resultDiv.setAttribute("data-sorted", "false");
      document.querySelector(".btn-sort").title = "The button has been deactivated, to reactivate stop the appraisal process.";
    } else {
      resultDiv.setAttribute("data-sorted", "true");
          "The button has been deactivated, to reactivate unsort the results.";
    }
  
    for (var i = 0; i < sortedButtons.length; i++) {
      resultDiv.appendChild(sortedButtons[i].parentNode);
    }
  }
  

// Clears the results of the previous scan.
async function clearResults() {
    await notyf.dismissAll();
    (document.getElementById("highValueResult").innerHTML = ""),
    (document.getElementById("result").innerHTML = ""),
    (domains = ""),
    (oldInnerHTML = ""),
    (domainsData = []),
    (result = ""),
    (index = 0),
    (checkedDomains.clear()),
    document.querySelector(".btn-checked").disabled = false;
    document.querySelector(".btn-checked").title = "";
    document.querySelector(".btn-sort").disabled = false;
    document.querySelector(".btn-sort").title = "";
    notyf
        .success({
            message: 'Data Cleared!',
            dismissible: false,
            duration: 3500
        });
}

// Copies the checked domains to the clipboard.
async function copyToClipboard() {
    try {
        var result = document.getElementById("result");
        await navigator.clipboard.writeText(result.innerText);
        document.querySelector(".btn-confirm").innerHTML = "Copied!";
        setTimeout(function() {
            document.querySelector(".btn-confirm").innerHTML = "Copy";
        }, 1200);
    } catch (err) {
        console.error("Failed to copy text: ", err);
    }
}

// Force Stop timeouts.
function clearAllTimeouts() {
    clearTimeout(timeoutId);
    clearTimeout(retryTimeoutId);
}

// A function that clears all timeouts and intervals.
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
        notyf.success({
            message: 'Forced Stop.',
            dismissible: false,
            duration: 3500
        })
        document.querySelector(".btn-checked").disabled = false;
        document.querySelector(".btn-checked").title = "";
        document.querySelector(".btn-sort").disabled = false;
        document.querySelector(".btn-sort").title = "";
        document.body.removeAttribute("onbeforeunload");
        sortEnabled = true;
    }
});

// alert before closing or reloading the page.
function progressAlert() {
    return "Are you sure you want to leave? The results of the page will be lost.";
}

// v1.1.0 Code - check https://github.com/short443/BDAC/releases/ for updates.
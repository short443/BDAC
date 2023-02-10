/**
 * An array of API keys and their corresponding secrets.
 * @type {Array<{key: string, secret: string}>}
 */
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

/**
* A function that returns a CORS-enabled URL for the given URL.
* @param {string} url - The URL to convert into a CORS-enabled URL.
* @returns {string} The CORS-enabled URL.
*/

cors_api_url = "https://corsproxy.io/?",

/**
* A filter that will only show domains with a price greater than the given value.
* @param {number} highValuePrice - the high value price to filter products by.
* @returns {FilterConfig} - a filter config object.
*/

highValuePriceFilter = 2000,

/**
* Beep sound to notify about high value domains. (To active, change the value to "true")
* @returns None           
*/

highValueBeep = false,

/**
* General global variables.             
*/
checkedDomains = new Set(),
index = 0,
keyIndex = 0,
domains,
timeoutId,
requestsCount = 0,
dn,
retryTimeoutId,
sortEnabled = true,
oldInnerHTML,
notyf = new Notyf(),
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

/**
* Appraises the domains in the text area.
* @returns None
*/
function appraiseDomains() {
sortEnabled = false;
// Check if the variable "cors_api_url" is set, if not, do not start checking.
if (!cors_api_url) {
notyf
    .error({
        message: 'Please set the "cors_api_url" variable in config/bdac.js before proceeding.',
        dismissible: true,
        duration: 7000
    });
return
}

// Check if the variable "apiKey" is set, if not, do not start checking.
else if (!apiKeys.some((apiKey) => apiKey.key && apiKey.secret)) {
notyf
    .error({
        message: 'Please set the "apiKey" variable in config/bdac.js before proceeding.',
        dismissible: true,
        duration: 7000
    });
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
notyf
    .error({
        message: 'Please enter a domain name before submitting!',
        dismissible: true,
        duration: 7000
    });
return
}
}

/**
* Checks the next domain in the list of domains to check.
* @returns None
*/
function checkNextDomain() {

// Gets the next domain from the domains array.
if (!(index >= domains.length)) {
var e = domains[index++];
dn = e


//Checks if the domain is in the checked domains set. * If it is, it checks the next domain.* If it isn't, it checks the domain.
if (0 != e.trim().length) {
    if (checkedDomains.has(e)) {
        checkNextDomain();
    } else {
        checkedDomains.add(e);

        // Finds the next API key and secret that are valid.           
        while (!apiKeys[keyIndex].key || !apiKeys[keyIndex].secret) {
            keyIndex++;
            if (keyIndex === apiKeys.length) {
                keyIndex = 0;
            }
        }

        // Data to connect to the Godaddy API.
        var t = cors_api_url + "https://api.godaddy.com/v1/appraisal/" + e;
        var n = {
            method: "GET",
            headers: {
                Authorization: "sso-key " + apiKeys[keyIndex].key + ":" + apiKeys[keyIndex].secret
            }
        };

        // Increments the requests count and if it reaches 20, increments the keyIndex.
        requestsCount++;
        if (20 === requestsCount) {
            keyIndex++;
            requestsCount = 0;
            if (keyIndex === apiKeys.length) {
                keyIndex = 0;
            }
        }

        // Fetch process and error handling.
        var a = [];
        var fetchErrorCount = 0;
        var fetchData = function() {
            // Fetch process t= request n= options
            fetch(t, n)
                // Takes in a response object and returns the response body as a JSON object.
                .then(response => response.json())
                // A function that takes in a promise and returns a promise that resolves after a given amount of time.
                .then((e) => {
                    // in case of error code "TOO_MANY_REQUESTS" wait for the time informed in retryAfterSec in the request's response and try to check it again.
                    if (e.code === "TOO_MANY_REQUESTS") {
                        console.log(`Failed to fetch the domain: ${dn} Error code: ${e.code} Trying again in ${e.retryAfterSec} seconds.`);
                        notyf
                            .error({
                                message: 'Too many requests. Trying again in ' + e.retryAfterSec + ' seconds.',
                                dismissible: true,
                                duration: e.retryAfterSec * 1000
                            });
                        timeoutId = setTimeout(fetchData, e.retryAfterSec * 1000);
                    }

                    // in case of error code "429" from CORS, wait 1 minute and try to check it again. ( I don't know if it works, I couldn't replicate this error to test. )
                    else if (e.code === 429) {
                        console.log(`Failed to fetch the domain: ${dn} Error code: ${e.code}`);
                        timeoutId = setTimeout(fetchData, 60000);
                    }

                    // in case of error status "UNSUPPORTED_DOMAIN" wait the delay time and skip it.
                    else if (e.status === "UNSUPPORTED_DOMAIN") {
                        console.log(`Failed to fetch the domain: ${dn} Error code: ${e.status}`);
                        notyf
                            .error({
                                message: dn + ' is not not supported for verification.',
                                dismissible: true,
                                duration: 0
                            });
                        timeoutId = setTimeout(checkNextDomain, delay);
                    }

                    // in case of error status "MASKED_DOMAIN" wait the delay time and skip it.
                    else if (e.status === "MASKED_DOMAIN") {
                        console.log(`Failed to fetch the domain: ${dn} Error code: ${e.status}`);
                        notyf
                            .error({
                                message: dn + ' - Appraisals are blocked for this domain.',
                                dismissible: true,
                                duration: 0
                            });
                        timeoutId = setTimeout(checkNextDomain, delay);
                    }

                    // in case of error status "NOT_FOUND" wait the delay time and skip it.
                    else if (e.code === "NOT_FOUND") {
                        console.log(`Failed to fetch the domain: ${dn} Error code: ${e.code}`);
                        notyf
                            .error({
                                message: dn + ' not found, this appraisal was skipped.',
                                dismissible: true,
                                duration: 0
                            });
                        timeoutId = setTimeout(checkNextDomain, delay);
                    }

                    // if the request return status = OK, format response data and present it to the user in html.
                    else if ("OK" === e.status) {
                        var domain = e.domain;
                        var govalue = e.govalue;
                        domainsData.push({
                            domain: domain,
                            value: govalue
                        });
                        var resultDiv = document.createElement("div");
                        var text = "Domain: " + domain + "<br>" + "Value: $" + govalue;
                        resultDiv.innerHTML = text;
                        document.getElementById("result").insertAdjacentHTML("afterbegin", resultDiv.outerHTML);

                        // Captures domains with the price greater than or equal to the price set in the "highValuePriceFilter" variable and sends them to a different div in the user interface.
                        if (govalue >= highValuePriceFilter) {
                            a.push({
                                domain: domain,
                                govalue: govalue
                            });

                            // Beep sound to notify about high value domains.
                            // ( To activate, change the value of the variable "highValueBeep" to true. )
                            if (highValueBeep === true) {
                                var audio = new Audio("assets/audio/hvbeep.mp3");
                                audio.volume = 0.25;
                                audio.play();
                            }

                            // Formatting high-value domains.
                            var highValueResultDiv = document.createElement("div");
                            var highValueText = "Domain: " + dn + "<br>" + "Value: $" + govalue;
                            highValueResultDiv.innerHTML = highValueText;
                            document.getElementById("highValueResult").insertAdjacentHTML("afterbegin", highValueResultDiv.outerHTML);
                            notyf
                                .success({
                                    message: dn + ' appraised in $' + govalue,
                                    dismissible: true,
                                    duration: 10000,
                                    background: 'orange'
                                });
                        }
                        timeoutId = setTimeout(checkNextDomain, delay);
                    }

                    // In case of errors like 404, 502, 504 the program must try to re-fetch up to 3 times to return the data.
                    // If you don't get "status = OK" the program will skip informing the user that it was not possible to verify the domain.
                    else {
                        console.error(`Error: ${e.status}`);
                        while (fetchErrorCount < 3) {
                            retryTimeoutId = setTimeout(fetchData, delay);
                            fetchErrorCount++;
                            break;
                        }
                        if (fetchErrorCount >= 3) {
                            console.log(`Failed to fetch the domain: ${dn} Error code: ${e.code}`);
                            timeoutId = setTimeout(checkNextDomain, delay);
                        }
                    }
                })
                .catch((e) => {
                    console.error(`Error appraising domain: ${dn}`);
                    fetchErrorCount++;
                    if (fetchErrorCount < 3) {
                        retryTimeoutId = setTimeout(fetchData, delay);
                    }
                    if (fetchErrorCount >= 3) {
                        console.log(`Failed to fetch the domain: ${dn} Error code: ${e.code}`);
                        notyf
                            .error({
                                message: dn + ' - An error occurred, this appraisal was skipped.',
                                dismissible: true,
                                duration: 0
                            });
                        timeoutId = setTimeout(checkNextDomain, delay);
                    }
                });
        };
        fetchData();
    }

}

// Once the process of checking one domain is finished, the function is called again to check the next one.
else {
    checkNextDomain();
}
}

// If all domains in the list are checked, the program will release the disabled buttons and send a completion message to the user
else if (domains.length === index) {
sortEnabled = true;
notyf
    .success({
        message: 'Verification Completed!',
        dismissible: false,
        duration: 3500
    });
document.querySelector(".btn-checked").disabled = false;
document.querySelector(".btn-checked").title = "";
document.querySelector(".btn-sort").disabled = false;
document.querySelector(".btn-sort").title = "";
}
}

/**
* Exports the data in the table to a CSV file.
* @returns None
*/
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

/**
* Sorts the domains by their value.
* @returns None
*/
function sortDomains() {
if (!sortEnabled) {
document.querySelector(".btn-sort").title = "The button has been deactivated, to reactivate stop the appraisal process.";
return;
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
    document.querySelector(".btn-checked").title =
        "The button has been deactivated, to reactivate unsort the results.";
});
}
}

/**
* Clears the results of the previous scan.
*/
async function clearResults() {
await notyf.dismissAll();
(document.getElementById("highValueResult").innerHTML = ""),
(document.getElementById("result").innerHTML = ""),
(domains = []),
(oldInnerHTML = []),
(domainsData = []),
(result = []),
checkedDomains.clear(),
(index = 0);
}

/**
* Clears all timeouts.
* @returns None
*/
function clearAllTimeouts() {
clearTimeout(timeoutId);
clearTimeout(retryTimeoutId);
}

/**
* Copies the checked domains to the clipboard.
* @returns None
*/
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

/**
* A function that clears all timeouts and intervals.
* @returns None
*/
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
document.querySelector(".btn-checked").disabled = false;
document.querySelector(".btn-checked").title = "";
document.querySelector(".btn-sort").disabled = false;
document.querySelector(".btn-sort").title = "";
sortEnabled = true;
}
});

// v1.0.5.5 Code Version - check https://github.com/short443/BDAC/releases/ for updates.

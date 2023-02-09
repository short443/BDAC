/**
 * An array of API keys and their corresponding secrets.
 * @type {Array<{key: string, secret: string}>}
 */
let apiKeys = [
{
    key: "",
    secret: "",
},
{
    key: "",
    secret: "",
},
{
    key: "",
    secret: "",
},
],

/**
* A function that returns a CORS-enabled URL for the given URL.
* @param {string} url - The URL to convert into a CORS-enabled URL.
* @returns {string} The CORS-enabled URL.
*/

cors_api_url = "https://corsproxy.io/?",

/**
* A filter that will only show products with a price greater than the given value.
* @param {number} highValuePrice - the high value price to filter products by.
* @returns {FilterConfig} - a filter config object.
*/

highValuePriceFilter = 2000,

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
sortEnabled = true,
oldInnerHTML,
domainsData = [];

/**
 * Calculates the number of API keys that are in the apiKeys array.
 * @returns {number} The number of API keys that are in the apiKeys array.
 */
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
 * Appraises the domains in the textarea.
 * @returns None
 */
function appraiseDomains() {
    sortEnabled = false;
    if (!cors_api_url) {
        return alert("Please set the 'cors_api_url' variable before proceeding.");
    }
    if (!apiKeys.some((apiKey) => apiKey.key && apiKey.secret)) {
        return alert("Please set the 'apiKey' values before proceeding.");
    }
    var e = document.getElementById("textarea-form5-k");

    if (e.value) {
        document.querySelector(".btn-checked").disabled = true;
        document.querySelector(".btn-checked").title =
                "The button has been deactivated, stop the verification before starting another.";
        domains = e.value.split("\n").map((domain) => {
            domain = domain.replace(/\s/g, "");
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

/**
* Checks the next domain in the list of domains to check.
* @returns None
*/
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
                                console.log(`Failed to fetch the domain: ${dn} Error code: ${e.code} Trying again in ${e.retryAfterSec} seconds.`);
                                const notyf = new Notyf();
                                notyf
                                    .error({
                                        message: 'Too many requests. Trying again in ' + e.retryAfterSec + ' seconds.',
                                        dismissible: true,
                                        duration: e.retryAfterSec * 1000
                                    })
                                    .on('dismiss', ({
                                        target,
                                        event
                                    }) => foobar.retry());
                                setTimeout(fetchData, e.retryAfterSec * 1000);
                            } else if (e.code === 429) {
                                console.log(`Failed to fetch the domain: ${dn} Error code: ${e.code}`);
                                setTimeout(fetchData, 60000);
                            } else if (e.status === "UNSUPPORTED_DOMAIN") {
                                console.log(`Failed to fetch the domain: ${dn} Error code: ${e.code}`);
                                const notyf = new Notyf();
                                notyf
                                    .error({
                                        message: dn + ' is not not supported for verification.',
                                        dismissible: true,
                                        duration: 0
                                    })
                                    .on('dismiss', ({
                                        target,
                                        event
                                    }) => foobar.retry());
                                setTimeout(checkNextDomain, delay);
                            } else if (e.code === "NOT_FOUND") {
                                console.log(`Failed to fetch the domain: ${dn} Error code: ${e.code}`);
                                const notyf = new Notyf();
                                notyf
                                    .error({
                                        message: dn + ' not found, this appraisal was skipped.',
                                        dismissible: true,
                                        duration: 0
                                    })
                                    .on('dismiss', ({
                                        target,
                                        event
                                    }) => foobar.retry());
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
                                while (fetchErrorCount < 3) {
                                    retryTimeoutId = setTimeout(fetchData, delay);
                                    fetchErrorCount++;
                                    break;
                                }
                                if (fetchErrorCount >= 3) {
                                    console.log(`Failed to fetch the domain: ${dn} Error code: ${e.code}`);
                                    const notyf = new Notyf();
                                    notyf
                                        .error({
                                            message: dn + ' - An error occurred, this appraisal was skipped.',
                                            dismissible: true,
                                            duration: 0
                                        })
                                        .on('dismiss', ({
                                            target,
                                            event
                                        }) => foobar.retry());
                                    setTimeout(checkNextDomain, delay);
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
                                const notyf = new Notyf();
                                notyf
                                    .error({
                                        message: dn + ' - An error occurred, this appraisal was skipped.',
                                        dismissible: true,
                                        duration: 0
                                    })
                                    .on('dismiss', ({
                                        target,
                                        event
                                    }) => foobar.retry());
                                setTimeout(checkNextDomain, delay);
                            }
                        });
                };
                setTimeout(fetchData, delay);
            }


        } else {
            setTimeout(checkNextDomain, delay);
        }
    } else if (domains.length === index) {
        sortEnabled = true;
        const notyf = new Notyf();
        notyf
            .success({
                message: 'Verification Completed!',
                dismissible: false,
                duration: 3500
            })
            .on('dismiss', ({
                target,
                event
            }) => foobar.retry());
        document.querySelector(".btn-checked").disabled = false;
        document.querySelector(".btn-checked").title = "";
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
        document.querySelector(".btn-sort").title =
            "The button has been deactivated, to reactivate stop the appraisal process.";
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
function clearResults() {
    const notyf = new Notyf();
    notyf
        .success({
            message: 'Cleaned!',
            dismissible: false,
            duration: 2000
        })
        .on('dismiss', ({
            target,
            event
        }) => foobar.retry());
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
        setTimeout(function() {
            clearInterval(intervalId);
            clearAllTimeouts();
        }, 2000);
        sortEnabled = true;
    }
});

// v1.0.3 Code Version - check https://github.com/short443/BDAC/releases/ for updates.

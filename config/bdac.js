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
cors_api_url = "https://corsproxy.io/?",

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
requestsCount = 0,
retryTimeoutId,
sortEnabled = true,
timeoutId,
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

// Check if the variable "cors_api_url" is set, if not, do not start checking.
if (!cors_api_url) {
notyf.error({
    message: 'Please set the "cors_api_url" variable in config/bdac.js before proceeding.',
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

// Checks the next domain in the list of domains to check.
function checkNextDomain() {

// Check if the index is less than the length of the domains array and if the domain is empty or has already been checked.
while (index < domains.length && (domains[index].trim().length === 0 || checkedDomains.has(domains[index]))) {
index++;
}

// If the index is greater than the length of the domains array, enable the sort and checked buttons.
if (index >= domains.length) {
sortEnabled = true;
document.querySelector(".btn-checked").disabled = false;
document.querySelector(".btn-checked").title = "";
document.querySelector(".btn-sort").disabled = false;
document.querySelector(".btn-sort").title = "";
clearTimeout(timeoutId);
clearTimeout(retryTimeoutId);
notyf.success({
    message: 'Verification Completed!',
    dismissible: false,
    duration: 3500
});
return;
}

// Set the current domain.
var dn = domains[index++];

// Add the domain to the checkedDomains set.
checkedDomains.set(dn, true);

// Loop through the keys until one with both a key and a secret is found.
for (; !apiKeys[keyIndex].key || !apiKeys[keyIndex].secret;) {
keyIndex++;
if (keyIndex === apiKeys.length) {
    keyIndex = 0;
}
}

// Declare the url, an array for high value domains, and a retry count.
var url = cors_api_url + 'https://api.godaddy.com/v1/appraisal/' + dn;
var highValueDomains = [];
var retryCount = 0;

// Declare the function to fetch the domain data.
function fetchDomainData() {
requestsCount++;

// If the requests count is 20, increment the keyIndex.
if (requestsCount === 20) {
    keyIndex++;
    if (keyIndex === apiKeys.length) {
        keyIndex = 0;
    }
    requestsCount = 0;
}

// Use axios to make a get request, passing in the authorization header and a timeout.
axios.get(url, {
    headers: {
        Authorization: 'sso-key ' + apiKeys[keyIndex].key + ':' + apiKeys[keyIndex].secret
    },
    timeout: 10000
}).then(function(response) {

    // If the response status is OK, push the domain and value to the domainsData array.
    if (response.data.status === 'OK') {
        var domain = response.data.domain;
        var govalue = response.data.govalue;
        domainsData.push({
            domain: domain,
            value: govalue
        });

        // Create a div and add the domain and value to it.
        var div = document.createElement('div');
        var text = 'Domain: ' + domain + '<br>Value: $' + govalue;
        div.innerHTML = text;
        document.getElementById('result').insertAdjacentHTML('afterbegin', div.outerHTML);

        // If the value is greater than or equal to the highValuePriceFilter, push the domain and value to the highValueDomains array.
        if (govalue >= highValuePriceFilter) {
            highValueDomains.push({
                domain: domain,
                govalue: govalue
            });
            // If highValueBeep is true, create an audio element and play it.
            if (highValueBeep) {
                audio.volume = 0.25;
                audio.play();
            }

            // Create a div and add the domain and value to it.
            var hvDiv = document.createElement('div');
            var hvText = 'Domain: ' + dn + '<br>Value: $' + govalue;
            hvDiv.innerHTML = hvText;
            document.getElementById('highValueResult').insertAdjacentHTML('afterbegin', hvDiv.outerHTML);
            notyf.success({
                message: dn + ' appraised in $' + govalue,
                dismissible: true,
                duration: 10000,
                background: 'orange'
            });
        }
        
        // Clear the timeout and set a new one to check the next domain.
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkNextDomain, delay);
    }
}).catch(function(error) {

    // If the request was canceled, log it.
    if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
        // If the error code is ECONNABORTED, log it and retry the request.
    } else if (error.code === 'ECONNABORTED') {
        console.log('Timeout:', error.message);
        console.log('Retrying request...');
        clearTimeout(timeoutId);
        timeoutId = setTimeout(fetchDomainData, delay);
        // If the error code is TOO_MANY_REQUESTS, log it, create a notification, and retry the request.
    } else if (error.response.data.code === "TOO_MANY_REQUESTS") {
        console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.code} Trying again in ${error.response.data.retryAfterSec} seconds.`);
        notyf.error({
            message: 'Too many requests. Trying again in ' + error.response.data.retryAfterSec + ' seconds.',
            dismissible: true,
            duration: error.response.data.retryAfterSec * 1000
        });
        clearTimeout(timeoutId);
        timeoutId = setTimeout(fetchDomainData, error.response.data.retryAfterSec * 1000);
        // If the error code is 429, log it, create a notification, and retry the request.
    } else if (error.response.data.code === 429) {
        console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.code}`);
        notyf.error({
            message: 'Too many requests (CORS). Trying again in 1 minute.',
            dismissible: true,
            duration: 60000
        });
        clearTimeout(timeoutId);
        timeoutId = setTimeout(fetchDomainData, 60000);
        // If the error status is UNSUPPORTED_DOMAIN, log it, create a notification, and check the next domain.
    } else if (error.response.data.status === 'UNSUPPORTED_DOMAIN') {
        console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.status}`);
        notyf.error({
            message: dn + ' - Unsupported domain, this appraisal was skipped.',
            dismissible: true,
            duration: 0
        });
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkNextDomain, delay);
        // If the error status is MASKED_DOMAIN, log it, create a notification, and check the next domain.
    } else if (error.response.data.status === 'MASKED_DOMAIN') {
        console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.status}`);
        notyf.error({
            message: dn + ' - Appraisals are blocked for this domain.',
            dismissible: true,
            duration: 0
        });
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkNextDomain, delay);
        // If the error code is NOT_FOUND, log it, create a notification, and check the next domain.
    } else if (error.response.data.code === "NOT_FOUND") {
        console.log(`Failed to fetch the domain: ${dn} Error code: ${error.response.data.code}`);
        notyf.error({
            message: dn + ' - Not found, this appraisal was skipped.',
            dismissible: true,
            duration: 0
        });
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkNextDomain, delay);
        // If there is another error, log it and retry.
    } else {
        console.error('Error: ' + error.response.data.status);
        if (retryCount < 3) {
            retryTimeoutId = setTimeout(fetchDomainData, delay);
            retryCount++;
            return;
        }

        // If the retry count is greater than or equal to 3, log/notifies the error and check the next domain.
        if (retryCount >= 3) {
            console.log('Failed to fetch the domain: ' + dn + ' Error code: ' + error.response.data.code);
            notyf.error({
                message: dn + ' - Check failed (3 of 3 reqs), skipping domain.',
                dismissible: true,
                duration: 0
            });
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkNextDomain, delay);
        }
    }
});
}
// Call the fetchDomainData function.
fetchDomainData();
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

// v1.0.9 Code Version - check https://github.com/short443/BDAC/releases/ for updates.

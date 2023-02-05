<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/favicon.svg" alt="rock" width="100" height="100"/>
</p>

# BDAC - Bulk Domain Appraisal Checker
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/short443)

BDAC is an interface that allows you to evaluate multiple domains at once. It uses the Godaddy API to perform this assessment and displays the results on the screen. The tool is easy to use, just enter the desired domain names into the text box and click "Evaluate".

## Features

🟢 Automatic key rotation system.

🟢 CSV export system.

🟢 Domain formatting system.

🟢 Domain sorting system.

🟢 High-value domain separator

🟢 Automatic calculation of checking speed.

🟢 Error handling.

More coming soon 🔧.

## Configuration.

**What you will need:**

3 x Pairs of GoDaddy Api Key/Secrets **(Each pair from differet accounts)**

1 x Cors Proxy Link **(Optional)**

## Download and running it.

1 - [Click Here](https://github.com/short443/BDAC/releases) and download the latest version of the program.

2 - After the download is finished extract the files anywhere on your computer.

3 - The configuration file is inside the config folder, the 'bdac.js'.

4 - **To run the program follow the configuration steps below defining at least the keys** and open the file "index.html" to open the interface.

5 - Now just enjoy ✨

## Getting and adding Api Keys and Secrets.

*⚠ Be careful, do not host this program on the internet without knowing what you are doing, leaking your api keys can put your account security at risk, use the program locally in a folder or a local server in your computer, never share your keys and secrets with anyone, and never share your personal program folder with anyone.*

To be able to make requests to the GoDaddy API the BDAC uses a key rotation system to avoid bottlenecks during the processing of large domain lists, for each account you can make 20 API calls, with **3 pairs** in different accounts you can make 60 calls, enough to get 1 result per second, it is okay to use fewer keys but the processing time will be quite long. **(You can use more keys to speed up the responses)**.

To get the keys and secrets follow the step-by-step instructions:

1 - Create a GoDaddy account [(Click here)](https://sso.godaddy.com/v1/account/create)

2 - Enter the key management area [(Click Here)](https://developer.godaddy.com/keys) and click on "Create New Api Key".

3 - In "Environment" check "Production" and click next.

4 - Copy the Key and Secret.

5 - Open the BDAC folder enter the config folder and open with a text editor the file "bdac.js"

6 - Add the keys to the locations indicated between quotes in the "apiKeys" array, and repeat the process.

It should look like this (Example keys):

![Key Pairs Example](https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/carbon2.png)

**Note: You can use as many keys as you want to speed up the responses, remember that each Key pair must be in different accounts.**

## Cors Proxy. (Optional).

A CORS (Cross-Origin Resource Sharing) proxy is used to connect to APIs from a different origin (domain, protocol, or port) than the client's. This is necessary because web browsers enforce a security feature called the same-origin policy, which restricts a web page from making requests to a different origin. A CORS proxy acts as an intermediary, forwarding the API requests from the client to the API server and returning the API responses back to the client, allowing for cross-origin communication.

**By default the program comes already set with the cors proxy from corsproxy.io**, only in case you want to use a personal one you have to change it.

Here are the steps on how to create your own (Hosted by Cloudflare):

1 - Open the zibri repository [(Click here)](https://github.com/Zibri/cloudflare-cors-anywhere) and copy all content from "index.js".

2 - Create a Cloudflare account [(Click here)](https://dash.cloudflare.com/signup).

3 - Click on the "Workers" tab and select "Create a Service".

4 - Choose a name for your worker and click "Create Service" again.

5 - On the worker management page click "Quick Edit".

6 - Delete all content from the left block and paste the content you copied in step 1.

7 - Click "Save and Deploy", copy the worker link and confirm.

8 - In the program folder, go to Config and with a text editor edit the file "bdac.js".

9 - In the variable "cors_api_url" modify the CORS proxy URL from "https://corsproxy.io/?" to the worker link. 

Ex: "https://WorkerName.Subdomain.workers.dev/?"

10 - Save and done.

**Note: Cloudflare has some limits that can affect the program's responses, like the limitation of 100k requests per day, if it reaches the limit the program will stop working.**

## Prints.

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/1675601146655.png" alt="rock" width="700" height="352"/>
</p>

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/1675602232992.png" alt="rock" width="700" height="352"/>
</p>

## About the development.

Hello, my name is short (pseudonym) and I would like to talk a little bit about the development and code of my program. This is my first project and I developed it almost entirely without coding. I started researching programming, and this project is part of my study. I used ChatGPT to help with the backend development, and I used Mobirise 4 for the frontend. While I was writing the code and fighting to get correct answers from ChatGPT, I realized that some things in the code might not be correct. That's why I came to Github, to release the code and learn from others on how to correct any issues.

I have been trading domains for a while and I wanted a program that would automate the task of appraising them. I found [@SaveBreach's project](https://hackerpain.github.io/bulkvaluator/), the bulk valuator, but it was very limited without a key rotation system and waiting times, among other things. So I got inspired by his project and started designing my own program based on what his program did and what I wanted it to have. After many attempts with the free ChatGPT version and researching Mobirise's code (thx Sublime Text 3), I managed to make the code work the way I wanted.

There were some mechanics that were removed during the program creation process. For example, there was a mechanic that verified if the domain was available, but I found that there was too much information on the screen and, as it required two requests, the program's response time had decreased, so I decided to leave this mechanic aside. There was also a tool that was intended to come along with BDAC, called K2D (Keyword to Domain). It transformed lists of keywords into domains, with the possibility for the user to specify the TLDs to be generated along with the keywords. For example, you could generate 40 domains with just one keyword by varying the TLD. However, I realized that the loading time and memory usage when trying to convert many keywords (2000+) was very high, and it even crashed the browser page. After researching, I realized that I could use a model with Cloudflare Workers to process the data without relying on the client's computer processing. This project is saved and soon i hope to share it here.

Currently, the code works fine, with some self-correcting properties and limitations to prevent input errors. I tried to make the code as correct as possible, but I had trouble creating an efficient stop button, error handling system, and other organizational parameters. However, I feel that I am gradually getting closer to programming efficiently.

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/favicon.svg" alt="rock" width="100" height="100"/>
</p>

# BDAC - Bulk Domain Appraisal Checker
The tool is an interface that allows you to evaluate multiple domains at once. It uses the Godaddy API to perform this assessment and displays the results on the screen. The tool is easy to use, just enter the desired domain names into the text box and click "Evaluate".

## Features

🟢 Automatic key rotation system.
🟢 CSV export system
🟢 Domain formatting system.
🟢 Domain sorting system.
🟢 High-value domain separator
🟢 Automatic calculation of checking speed.
🟢 Error handling

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

## Cors Proxy. (Optional)

A CORS (Cross-Origin Resource Sharing) proxy is used to connect to APIs from a different origin (domain, protocol, or port) than the client's. This is necessary because web browsers enforce a security feature called the same-origin policy, which restricts a web page from making requests to a different origin. A CORS proxy acts as an intermediary, forwarding the API requests from the client to the API server and returning the API responses back to the client, allowing for cross-origin communication.

By default the program comes already set with the cors proxy from corsproxy.io, only in case you want to use a personal one you have to change it.

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

## About the development

Hello, my name is short (pseudonym) and I wanted to talk a little bit about the development and code of the program, this is my first project and I did almost entirely in NO-CODE, I started to research about programming and this project is part of my study, I developed the backend with the help of ChatGPT and the frontend using Mobirise 4, while I was writing the code and fighting to get answers from ChatGPT I realized that probably some things in the code don't seem right, so I came here in Github to release the code and to learn and correct values that are badly implemented.

I started trading domains a while ago and wanted a program that would automate the task of appraisal for me, there was [@SaveBreach's](https://hackerpain.github.io/bulkvaluator/) project, the bulk valuator, but the program was very limited without the key rotation system, waiting times and etc, so I got inspired by his project and started designing based on what his program did and things I wanted it to have. After a lot of incomplete code from the free ChatGPT version and research in Mobirise's code (thx sublime txt 3), I managed to make the code work the way I wanted, at least doing what I wanted 😁.

Currently the code works fine, with some self-correcting properties and limitations to avoid input errors, I tried to make the code as correct as possible, but I had trouble creating a really efficient stop button and error handling system, and other organizational parameters, but I feel that I am step by step getting closer to programming efficiently.

If you can help me buy the coffee I would appreciate it!

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/short443)

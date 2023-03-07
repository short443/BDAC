<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/favicon.svg" alt="rock" width="100" height="100"/>
</p>

# BDAC - Bulk Domain Appraisal Checker
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/short443)
[!["NamePros Profile"](https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/NamePros.png)](https://www.namepros.com/members/short.1058245/)

BDAC is an interface that allows you to evaluate multiple domains at once. It uses the Godaddy API to perform this assessment and displays the results on the screen. The tool is easy to use, just enter the desired domain names into the text box and click "Evaluate".

## Features

🟢 Automatic key rotation system.

🟢 Support Domain,keyword and URL lists.

🟢 CSV export system.

🟢 Domain formatting system.

🟢 Domain sorting system.

🟢 High-value domain separator.

🟢 Automatic calculation of checking speed.

🟢 Error handling.

More coming soon 🔧.

## Configuration.

**What you will need:**

Disable/Whitlist adblock - It can stop checks by improperly blocking some request.
3 x Pairs of GoDaddy Api Key/Secrets **(Each pair from differet accounts)**

**Note: You can use as many keys as you want to speed up the responses, remember that each Key pair must be in different accounts.**

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

7 - (Optional) Set the variable "highValuePriceFilter" to the price of the high value domains (>=) that you want to separate from the results. (Default: 2000)

8 - (Optional) Set the variable "highValueBeep" to "true" if you want to have a notification sound when encountering high value domains. (Default: false)

## Download and running it.

1 - [Click Here](https://github.com/short443/BDAC/releases) and download the latest version of the program.

2 - After the download is finished extract the files anywhere on your computer.

3 - The configuration file is inside the config folder, the 'bdac.js'.

4 - **To run the program follow the configuration steps below defining at least the keys** and open the file "index.html" to open the interface.

5 - Now just enjoy ✨

## Prints.

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/1675601146655.png" alt="rock" width="700" height="352"/>
</p>

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/1675602232992.png" alt="rock" width="700" height="352"/>
</p>

## Lastest Update Notes.

Mar 6, 2023 (v1.0.9):

Since the last update some major changes were made, like the correction of a big problem that the code had that was the infinite recursion in the function checkNextDomain(), that caused the error "Maximum call stack size exceeded", preventing the program to continue/unpause large domain lists.

I also brought Axios to have more compatibility with the most diverse browsers and to have more ease in implementing code and some changes in the structure of the function itself, with Axios it was possible to impose a limit for the response time of the API, I realized that sometimes the responses took minutes to be obtained (when it didn't give error), now with the timeout, if the response takes more than 10 seconds to return, the code will cancel the request and start a new one.

I also improved a little bit the organization of the error handling code and added some new comments.

Feb 14, 2023 (v1.0.8):

I added a code to prevent the user from accidentally closing the page during the checking process or when there are results in the html, sometimes I would accidentally close the browser while doing checks, tests, this was very annoying because besides losing the list of domains already loaded I would lose results that I wanted to save, so to solve this I added a code in case of forgetting not to close the page with content inside.

## About the development.

Hello, my name is short (pseudonym) and I would like to talk a little bit about the development and code of my program. This is my first project and I developed it almost entirely without coding. I started researching programming, and this project is part of my study. I used ChatGPT to help with the backend development, and I used Mobirise 4 for the frontend. While I was writing the code and fighting to get correct answers from ChatGPT, I realized that some things in the code might not be correct. That's why I came to Github, to release the code and learn from others on how to correct any issues.

I have been trading domains for a while and I wanted a program that would automate the task of appraising them. I found [@SaveBreach's project](https://hackerpain.github.io/bulkvaluator/), the bulk valuator, but it was very limited without a key rotation system and waiting times, among other things. So I got inspired by his project and started designing my own program based on what his program did and what I wanted it to have. After many attempts with the free ChatGPT version and researching Mobirise's code (thx Sublime Text 3), I managed to make the code work the way I wanted.

There were some mechanics that were removed during the program creation process. For example, there was a mechanic that verified if the domain was available, but I found that there was too much information on the screen and, as it required two requests, the program's response time had decreased, so I decided to leave this mechanic aside. There was also a tool that was intended to come along with BDAC, called K2D (Keyword to Domain). It transformed lists of keywords into domains, with the possibility for the user to specify the TLDs to be generated along with the keywords. For example, you could generate 40 domains with just one keyword by varying the TLD. However, I realized that the loading time and memory usage when trying to convert many keywords (2000+) was very high, and it even crashed the browser page. After researching, I realized that I could use a model with Cloudflare Workers to process the data without relying on the client's computer processing. This project is saved and soon i hope to share it here.

Currently, the code works fine, with some self-correcting properties and limitations to prevent input errors. I tried to make the code as correct as possible, but I had trouble creating an efficient stop button, error handling system, and other organizational parameters. However, I feel that I am gradually getting closer to programming efficiently.

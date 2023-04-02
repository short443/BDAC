

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/favicon.svg" alt="rock" width="100" height="100"/>
</p>

# BDAC - Bulk Domain Appraisal Checker
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/short443)
[!["NamePros Profile"](https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/NamePros.png)](https://www.namepros.com/members/short.1058245/)

BDAC is an interface that allows you to evaluate multiple domains at once. It uses the Godaddy API to perform this assessment and displays the results on the screen. The tool is easy to use, just enter the desired domain names into the text box and click "Evaluate".

## Features

🔎 Support is provided for domains, keywords, and URLs.

📄 CSV export system.

🔑 Automatic key rotation system.

✅ Domain formatting system.

🔃 Domain sorting system.

🥇 High-value domain separator.

🕐 Automatic checking speed.

❗ Error handling sys.

## Configuration.

**What you will need:**

3+ x Pairs of GoDaddy Api Key/Secrets **(Each pair from differet accounts)**

**Note: You can use as many keys as you want to speed up the responses, remember that each Key pair must be in different accounts.**

## Setup

*⚠ Be careful, do not host this program on the internet without knowing what you are doing, leaking your api keys can put your account security at risk, use the program locally in a folder or a local server in your computer, never share your keys and secrets with anyone, and never share your personal program folder too.*

To be able to make requests to the GoDaddy API the BDAC uses a key rotation system to avoid bottlenecks during the processing of large domain lists, for each account you can make 20 API calls, with **3 pairs** in different accounts you can make 60 calls, enough to get 1 result per second, it is okay to use fewer keys but the processing time will be quite long. **(You can use more keys to speed up the responses)**.

To get the keys and secrets follow the step-by-step instructions:

1 - Create a GoDaddy account [(Click here)](https://sso.godaddy.com/v1/account/create)

2 - Enter the key management area [(Click Here)](https://developer.godaddy.com/keys) and click on "Create New Api Key".

3 - In "Environment" check "Production" and click next.

4 - Copy the Key and Secret.

5 - Open in the "config" folder inside "BDAC" and open with a text editor the file "bdac.js"

6 - Paste the keys and secrets between quotes in the "apiKeys" array, and repeat the process.

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/0aa121b19d.png" alt="rock" width="588" height="333"/>
</p>

7 - (Optional) Set the variable "highValuePriceFilter" to the price of the high value domains (>=) that you want to separate from the results. (Default: 2000)

8 - (Optional) Set the variable "highValueBeep" to "true" if you want to have a notification sound when encountering high value domains. (Default: false)


## New Version:

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/34e20d63a6.png" alt="rock" width="700" height="352"/>
</p>

## Old Version:
<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/short443/hostimage@main/images/1675602232992.png" alt="rock" width="700" height="352"/>
</p>

## Update Note.

Apr 2, 2023 (v1.1.0):

The current version took a while to come out because I'm focused on another project, that's why it took so long. The current version came with a darker interface and a few fixes, the main one being in the error handling of the code.

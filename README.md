# Test Windows applications with Appium and JavaScript.

Example implementation of a functional UI test with the Appium Windows Driver implemented with JavaScript. This short test was borrowed from a sample test from a blog post listed below.

See http://clemensreijnen.nl/post/2017/10/27/Test-Windows-applications-with-Appium-and-JavaScript for more information about the setup.

This sample is based on the Node sample found in this repository https://github.com/appium/sample-code


# Setup
  * Go to your VM and start up Windows
  * Create a new directory, cd into that, and type the following:
    * npm install appium
    * npm install appium-windows-driver

  * Locally OUTSIDE of the VM on your Mac, do the following...
    * Create a directory, and clone this repo into that new directory you create
    * cd into this repo and install a couple dependencies: `npm install wd`, `npm install underscore`

# Running the test
  * In your VM, open up a terminal, navigate to your appium directory and spin up the appium server by typing `appium`. Your server is running if it looks like [this](https://cl.ly/1t3T332F253J)
  * Outside the VM, cd to this repo, and run the test using the command `mocha test_outlook.js`
  

"use strict";
require("./helpers/setup"); // require() is from node, to load a module

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('./helpers/appium-servers'),
    Q = require('q');


var asserters = wd.asserters;

describe("Windows test from Node", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;

  before(function () {
    var serverConfig = serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);

    // _.clone creates a new object and copies each value from the original to the new object
    var desired = _.clone(require("./helpers/caps").outlook);
    desired.app = require("./helpers/apps").myTestOutlookApp;

    return driver.init(desired);

  });

  after(function () {
    return driver
      .quit();
  });

  afterEach(function () {
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it("should open outlook and click New Email.", function () {
    return driver
    .launchApp() //this is to open Outlook again AFTER the splash window loads
    .waitForElementByClassName('NetUIRibbonTab', asserters.isDisplayed, 3000, 300)
    .elementByXPath('/Window/Pane[1]/ToolBar/Pane/Pane/Pane/Pane/Pane/Group/Group[1]/Button').click()
    .text().should.eventually.include('New Email');
  });

  it("should be able to open the Outreach plugin", function () {
    return driver
      .windowHandles().then(handles => driver.window(handles[0])) // targeting the new email window
      .waitForElementByName('Send', asserters.isDisplayed, 3000, 300)
      .elementByXPath('/Window/Pane[1]/ToolBar/Pane/Pane/Pane/Pane/Pane/Group/Group[6]/Button[4]').click() // XPath Open Outreach button
      .waitForElementByName('Outreach (Staging)', asserters.isDisplayed, 3000, 300)
      .text().should.eventually.include('Outreach (Staging)');
  });

  // possible to do conditional check for Sign In button?
  it("should be able to log into Outreach", function() {
    return driver
      .elementByNameIfExists('Sign In').click()
      .windowHandles().then(handles => driver.window(handles[0]))
      .elementByName('Email').click()
      .type('jenni.bradstreet@outreach.io') // need a dummy outreach account to login with
      .elementByName('Next').click()
      .elementByName('Password').click()
      .type('********') // need a dummy outreach account password
      .elementByXPath('/Window/Window/Window/Group/Group/Pane/Pane/Pane/Pane/Pane/Pane/Pane/Pane/Pane/Button').click() // Xpath for sign in button
  })

  it("should be able to select a template", function () {
    return driver
    .waitForElementByName('Templates', asserters.isDisplayed, 3000, 300).click()
    .waitForElementByName('Mine', asserters.isDisplayed, 3000, 300)
    // click on first template listed
    .waitForElementByName('basic template').click()
    .elementByClassName('RichEdit20WPT').click() // find the "To" input box
    .type('testing@outreachiotest.onmicrosoft.com')
    .elementByName('Subject').click()
    .waitForElementByName('Subject')
    .type('test email')
    .elementByName('Send').click()
    .windowHandles().then(handles => driver.window(handles[1])) // target the current window (no longer the send email window)
    .elementByName('New Email') // find out if the new email button is there
  });
});

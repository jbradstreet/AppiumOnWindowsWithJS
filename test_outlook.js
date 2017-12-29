"use strict";
require("./helpers/setup");

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

  // example of a simple passing test in comments below
  // it("should open outlook and click New Email.", function () {
  //   return driver
  //   .sleep(5000)
  //   .launchApp() //this is to open Outlook again AFTER the splash window loads
  //   .elementByName('New Email').click()
  //   .sleep(3000)
  //   .text().should.eventually.include('New Email');
  // });

  it("should be able to switch focus to the new window",
    function () {

    return driver
      .launchApp()
      .waitForElementByClassName('NetUIRibbonTab', asserters.isDisplayed, 5000, 100)
      .elementByXPath('/Window/Pane[1]/ToolBar/Pane/Pane/Pane/Pane/Pane/Group/Group[1]/Button').click() // XPath New Email button
      .windowHandles().then(handles => driver.window(handles[0])) // targeting the new email window
      .waitForElementByName('Send', asserters.isDisplayed, 3000, 300)
      .elementByXPath('/Window/Pane[1]/ToolBar/Pane/Pane/Pane/Pane/Pane/Group/Group[6]/Button[4]').click() // XPath Open Outreach button
      .waitForElementByName('Outreach (Staging)', asserters.isDisplayed, 3000,300)
      .text().should.eventually.include('Outreach (Staging)');
  });
});

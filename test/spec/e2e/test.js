var Page = require('./pageObjects/test-app');
var Helpers = require('../../../dist/protractor-helpers');

describe('product widget suit', function () {
  var page;
  beforeEach(function () {
    page = new Page();
    page.navigate();
  });

  it('Should support array finders', function () {
    expect(page.singularDataHook.getText()).toEqual('Single Data Hook');
    expect(page.multipleDataHook.count()).toBe(3);
    expect(page.multipleDataHook.get(0).getText()).toBe('Data Hook - 1');
    expect(page.multipleDataHook.getByText('Data Hook - 2')).toHaveClass('have-text-found');
    expect(page.arrayFindersSection.$data('data-hook-that-does-not-exist').isPresent()).toBeFalsy();
  });

  it('Should getting the key from a translated element', function () {
    expect(page.elementThatUsesTranslateFilter.getText()).toMatchTranslated('test-key', 'variable');
  });

  it('Should allow setting window size with default values', function () {
    Helpers.maximizeWindow();
    browser.driver.manage().window().getSize().then(function (size) {
      expect(size.height).toBe(1024);
      expect(size.width).toBe(1280);
    });
  });

  it('Should allow setting window size with specific values', function () {
    Helpers.maximizeWindow(900, 1000);
    browser.driver.manage().window().getSize().then(function (size) {
      expect(size.height).toBe(1000);
      expect(size.width).toBe(900);
    });
    Helpers.maximizeWindow();
  });

  it('Should hover over elements to make them appear and disappear even with delay', function () {
    Helpers.resetPosition();
    browser.ignoreSynchronization = true;
    expect(page.hoverDelayed.isDisplayed()).toBeFalsy();
    browser.actions().mouseMove(page.hoverDelayed).perform();
    expect(page.hoverDelayed.isDisplayed()).toBeFalsy();
    Helpers.displayHover(page.hoverDelayed);
    expect(page.hoverDelayed.isDisplayed()).toBeTruthy();
    browser.ignoreSynchronization = false;
  });

  it('Should wait for elements to appear or disappear', function () {
    Helpers.resetPosition();
    browser.ignoreSynchronization = true;
    Helpers.displayHover(page.hoverTrigger);
    Helpers.waitForElement(page.ngIfDelayed, 600);
    expect(page.ngIfDelayed.isDisplayed()).toBeTruthy();
    Helpers.resetPosition();
    Helpers.waitForElementToDisappear(page.ngIfDelayed, 600);
    expect(page.ngIfDelayed.isPresent()).toBeFalsy();
    browser.ignoreSynchronization = false;
  });
});
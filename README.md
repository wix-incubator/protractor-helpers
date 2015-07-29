# Protractor Helpers

This library extends Protractor API with a commonly used API. It helps write more understandable and clean tests with a well define separation between the test logic and the app under test logic. Consist of 4 extension types - elements, helpers, locators and matchers.

## Get Started
* Get protractor-helpers via **[Npm](https://www.npmjs.com/)**: by running `$ npm install --save-dev protractor-helpers` from your console.
* Inside the protractor-conf.js add the following code to load the helpers.
```js
var onPrepare = config.onPrepare || function () {};
config.onPrepare = function () {
  var promise = onPrepare.apply(this, arguments);
  global.helpers = require('protractor-helpers');
  return promise;
};
```

## Usage
### Elements
The elements API extends the ElementArrayFinder with:
#### getByText(comparedTest:string) => ElementFinder

example (choosing a date from a calander):
```js
$$('.calander').getByText('27').click();
```

### Helpers
global.helpers = require('protractor-helpers') returns helpers functions that can be used by the global helpers object.

* not - Return the negative value of a promise. 
```js
helpers.not($('.some-element').isDisplayed());
```

* translate - Returns the translated key with translation values.
```js
expect($('.some-element').getText()).toEqual(helpers.translate('SOME_TRANSLATION_KEY'));
```

* safeGet - Navigate to a url, maximizing the window and resettings the mouse position.
```js
helpers.safeGet('./SomeUrl');
```

* maximizeWindow - Maximize the window to a given size or a fedault one.
```js
helpers.maximizeWindow(500, 500);
```

* resetPosition - Resets the mouse position.
```js
helpers.resetPosition();
```

* displayHover - Displays an elements that shows only on hoven state.
```js
helpers.displayHover($('.some-element'));
```

* waitForElement - Wait for an element to be showen.
```js
helpers.waitForElement($('.some-element'), timeout);
```

* waitForElementToDisappear - Wait for an element not to be showen.
```js
helpers.waitForElementToDisappear($('.some-element'), timeout);
```

* selectOptionByText - Select an element from a selection box.
```js
helpers.selectOptionByText($('select'), 'options-to-select');
```

* selectOptionByIndex - Select an element from a selection box.
```js
helpers.selectOptionByIndex($('select'), 0);
```

* selectOption - Select a given option.
```js
helpers.selectOption($$('select option').first());
```

* isFirefox - Indicates if is on fire fox browser.
```js
if (helpers.isFireFox()) {
  // Do FF stuff here . . .
}
```

* createMessage - Creates a matchers message with {{locator}}, {{not}} and {{actual}} as place holders.
```js
helpers.createMessage(this, 'Expected {{locator}}{{not}}to have image') + '.');
```

* isIE - Indicates if is on Internet Explorer browser.
```js
if (helpers.isIE()) {
  // Do FF stuff here . . .
}
```

* clearAndSetValue - Allow setting a new value to an input field (rather than appending text)
```js
helpers.clearAndSetValue(inputField, 'text to populate');
```

* getFilteredConsoleErrors - returns console error messages resulted by the test run
* ignores livereload error (since it is not loaded in CI mode), messages with warn and below severity, and a known FireFox bug (https://bugzilla.mozilla.org/show_bug.cgi?id=1127577)
* can be used in order to validate no console errors
```js
expect(helpers.getFilteredConsoleErrors().length).toBe(0);
```

* hasClass - checks whether an element have a class
```js
helpers.hasClass(element, 'class-name');
```

### Locators
Adds an additional of two locators - by.dataHook and by.dataHookAll.
Search for element/s with the data-hook attribute. For example:
```html
<ul>
  <li data-hook="first">First</li>
  <li data-hook="second">Second</li>
</ul>
```
```js
element(by.dataHook('first')).click() - click on the first data hook
```

### Matchers
The Matchers API extends the matchers available for you:
* toBePresent - Checks if an element is present (exists in the DOM).
```js
expect($('.some-element')).toBePresent();
```

* toBeDisplayed - Checks if an element is displayed (visible in the DOM).
```js
expect($('.some-element')).toBeDisplayed();
```

* toHaveLengthOf - Checks the length passes to the function against the value its invoked with.
```js
expect($('.some-elements').count()).toHaveLengthOf(expectedLength);
```

* toHaveText - Checks if an element contains a text.
```js
expect($('.some-element')).toHaveText(expectedText);
```

* toMatchRegex - Checks if an elements text fits a regex.
```js
expect($('.some-element')).toMatchRegex(expectedPattern);
```

* toMatchMoney - Checks if an elements text fits rtl money regex.
```js
expect($('.some-element').getText()).toMatchMoney(expectedValue, currencySymbol);
```

* toMatchMoneyWithFraction - Checks if an elements text fits rtl money regex with fraction.
```js
expect($('.some-element').getText()).toMatchMoneyWithFraction(expectedValue, currencySymbol);
```

* toHaveValue - Checks if an element value attribute fits the expectedValue.
```js
expect($('.some-element')).toHaveValue(expectedValue);
```

* toHaveClass - Checks if an element has a specific class name.
```js
expect($('.some-element')).toHaveClass(className);
```

* toBeDisabled - Checks if an element is disabled.
```js
expect($('.some-element')).toBeDisabled();
```

* toBeChecked - Checks if an element checkbox is checked
```js
expect($('.some-element')).toBeChecked();
```

* toBeValid - Checks if a form element is valid (using the ng-valid className).
```js
expect($('.some-element')).toBeValid();
```

* toBeInvalid - Checks if a form element is invalid (using the ng-invalid className).
```js
expect($('.some-element')).toBeInvalid();
```

* toBeInvalidRequired - Checks if a form element is invalid and required (using the ng-invalid-required className).
```js
expect($('.some-element')).toBeInvalidRequired();
```

* toMatchTranslated - Checks if an element contains a translation value.
```js
expect($('.some-element')).toMatchTranslated(key, values);
```

# Protractor Helpers

This library extends Protractor API with a commonly used API. It helps us write more understandable and clean tests with a well define separation between the test logic and the app under test logic. Consist of 4 extension types - elements, helpers, locators and matchers.

## Get Started
* Get protractor-helpers via **[Npm](https://www.npmjs.com/)**: by running `$ npm install --save-dev protractor-helpers` from your console.
* Inside the protractor-conf.js onPrepare function add the line `global.helpers = require('protractor-helpers');` to load the helpers.

## Usage
### Elements
The elements API we extend the ElementArrayFinder with:
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

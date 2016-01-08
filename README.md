# Protractor Helpers

This library extends Protractor API with a commonly used API. It helps write more understandable and clean tests with a well-defined separation between the test logic and the app under the test logic. It consists of four extension types: elements, helpers, locators, and matchers.

## Get Started
* Get Protractor Helpers via **[npm](https://www.npmjs.com/)** by running `$ npm install --save-dev protractor-helpers` from your console.
* In your e2e tests, import the protractor-helpers module and start using it.
```js
var helpers = require('protractor-helpers');
```

## Usage
### Elements
The Elements API extends `ElementArrayFinder` with:
#### getByText(comparedTest:string) => ElementFinder

example (choosing a date from a calendar):
```js
$$('.calendar').getByText('27').click();
```

### Helpers
* `not` - Returns the negative value of a Promise. 
```js
helpers.not($('.some-element').isDisplayed());
```

* `translate` - Returns the translated key with translation values.
```js
expect($('.some-element').getText()).toEqual(helpers.translate('SOME_TRANSLATION_KEY'));
```

* `safeGet` - Navigates to a URL, maximizing the window and resetting the mouse position.
```js
helpers.safeGet('./SomeUrl');
```

* `maximizeWindow` - Maximizes the window to a given size or a default size.
```js
helpers.maximizeWindow(500, 500);
```

* `resetPosition` - Resets the mouse position.
```js
helpers.resetPosition();
```

* `displayHover` - Displays an element that appears only on hover state.
```js
helpers.displayHover($('.some-element'));
```

* `waitForElement` - Waits for an element to be shown.
```js
helpers.waitForElement($('.some-element'), timeout);
```

* `waitForElementToDisappear` - Waits for an element not to be shown.
```js
helpers.waitForElementToDisappear($('.some-element'), timeout);
```

* `selectOptionByText` - Selects an element from a selection box.
```js
helpers.selectOptionByText($('select'), 'options-to-select');
```

* `selectOptionByIndex` - Selects an element from a selection box.
```js
helpers.selectOptionByIndex($('select'), 0);
```

* `selectOption` - Selects a given option.
```js
helpers.selectOption($$('select option').first());
```

* `isFirefox` - Indicates whether Firefox is the browser.
```js
if (helpers.isFirefox()) {
  // Do FF stuff here . . .
}
```

* `createMessage` - Creates a matchers message with `{{locator}}`, `{{not}}`, and `{{actual}}` as placeholders.
```js
helpers.createMessage(this, 'Expected {{locator}}{{not}}to have image') + '.');
```

* `isIE` - Indicates whether Internet Explorer is the browser.
```js
if (helpers.isIE()) {
  // Do IE stuff here . . .
}
```

* `clearAndSetValue` - Allows setting a new value to an input field (rather than appending text).
```js
helpers.clearAndSetValue(inputField, 'text to populate');
```

* `getFilteredConsoleErrors` - Returns console error messages resulting from the test run.
* Ignores `livereload` error (since it is not loaded in CI mode), messages with `warn` and below severity, and a known Firefox bug (https://bugzilla.mozilla.org/show_bug.cgi?id=1127577).
* Can be used to validate that there are no console errors.
```js
expect(helpers.getFilteredConsoleErrors().length).toBe(0);
```

* `hasClass` - Checks whether an element has a class.
```js
helpers.hasClass(element, 'class-name');
```

### Locators
Adds two locators: `by.dataHook` and `by.dataHookAll`.
Searches for element(s) with the `data-hook` attribute. For example:
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
The Matchers API extends the available matchers:
* `toBePresent` - Checks whether an element is present (exists in the DOM).
```js
expect($('.some-element')).toBePresent();
```

* `toBeDisplayed` - Checks whether an element is displayed (visible in the DOM).
```js
expect($('.some-element')).toBeDisplayed();
```

* `toHaveCountOf` - Checks whether the length passes to the function against the value it's invoked with.
```js
expect($('.some-elements').count()).toHaveCountOf(expectedCount);
```

* `toHaveText` - Checks whether an element contains text.
```js
expect($('.some-element')).toHaveText(expectedText);
```

* `toMatchRegex` - Checks whether an element's text fits a regex.
```js
expect($('.some-element')).toMatchRegex(expectedPattern);
```

* `toMatchMoney` - Checks whether an element's text fits rtl money regex.
```js
expect($('.some-element').getText()).toMatchMoney(expectedValue, currencySymbol);
```

* `toMatchMoneyWithFraction` - Checks whether an element's text fits rtl money regex with fraction.
```js
expect($('.some-element').getText()).toMatchMoneyWithFraction(expectedValue, currencySymbol);
```

* `toHaveValue` - Checks whether an element's `value` attribute fits the `expectedValue`.
```js
expect($('.some-element')).toHaveValue(expectedValue);
```

* `toHaveClass` - Checks whether an element has a specific class name.
```js
expect($('.some-element')).toHaveClass(className);
```

* `toBeDisabled` - Checks whether an element is disabled.
```js
expect($('.some-element')).toBeDisabled();
```

* `toBeChecked` - Checks whether an element checkbox is checked.
```js
expect($('.some-element')).toBeChecked();
```

* `toBeValid` - Checks whether a form element is valid (using the `ng-valid` class name).
```js
expect($('.some-element')).toBeValid();
```

* `toBeInvalid` - Checks whether a form element is invalid (using the `ng-invalid` class name).
```js
expect($('.some-element')).toBeInvalid();
```

* `toBeInvalidRequired` - Checks whether a form element is invalid and required (using the `ng-invalid-required` class name).
```js
expect($('.some-element')).toBeInvalidRequired();
```

* `toMatchTranslated` - Checks whether an element contains a translation value.
```js
expect($('.some-element')).toMatchTranslated(key, values);
```

## License

The MIT License.

See [LICENSE](https://github.com/wix/protractor-helpers/blob/master/LICENSE)

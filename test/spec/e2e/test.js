var Page = require('./pageObjects/test-app');
var Helpers = require('../../../dist/protractor-helpers');

describe('Product Widget Suit', function () {
	var page;
	beforeEach(function () {
		page = new Page();
		page.navigate();
	});

	describe('Element Array Finder Test - ', function () {
		it('Should support array finders', function () {
			expect(page.singularDataHook.getText()).toEqual('Single Data Hook');
			expect(page.multipleDataHook.count()).toBe(3);
			expect(page.multipleDataHook.get(0).getText()).toBe('Data Hook - 1');
			expect(page.multipleDataHook.getByText('Data Hook - 2')).toHaveClass('have-text-found');
			expect(page.arrayFindersSection.$data('data-hook-that-does-not-exist').isPresent()).toBeFalsy();
		});
	});

	describe('Helpers Tests - ', function () {
		it('Should get the key from a translated element', function () {
			expect(page.elementThatUsesTranslateFilter.getText()).toMatchTranslated('test-key', 'variable');
		});

		it('Should allow setting window size with default values', function () {
			Helpers.maximizeWindow();
			browser.driver.manage().window().getSize().then(function (maxWindow) {
				Helpers.maximizeWindow();
				browser.driver.manage().window().getSize().then(function (window) {
					expect(window.height).toBe(maxWindow.height);
					expect(window.width).toBe(maxWindow.width);
				});
			});
		});

		it('Should allow setting window size with specific values', function () {
			var specificWidth = 800;
			var specificHeight = 600;
			Helpers.maximizeWindow(specificWidth, specificHeight);
			browser.driver.manage().window().getSize().then(function (size) {
				expect(size.width).toBe(specificWidth);
				expect(size.height).toBe(specificHeight);
			});
		});

		it('Should hover elements to make them appear and disappear even with delay', function () {
			Helpers.resetPosition();
			browser.ignoreSynchronization = true;
			expect(page.hoverDelayed).not.toBeDisplayed();
			Helpers.moveToElement('delayed-hover')
			expect(page.hoverDelayed).not.toBeDisplayed();
			Helpers.displayHover(page.hoverDelayed);
			expect(page.hoverDelayed).toBeDisplayed();
			browser.ignoreSynchronization = false;
		});

		it('Should wait for elements to appear or disappear', function () {
			Helpers.resetPosition();
			browser.ignoreSynchronization = true;
			Helpers.displayHover(page.hoverTrigger);
			Helpers.waitForElement(page.ngIfDelayed, 600);
			expect(page.ngIfDelayed).toBePresent();
			Helpers.resetPosition();
			Helpers.waitForElementToDisappear(page.ngIfDelayed, 600);
			expect(page.ngIfDelayed).not.toBePresent();
			browser.ignoreSynchronization = false;
		});

		it('Should select drop down by text', function () {
			Helpers.selectOptionByText(page.dropDown, 'Second');
			expect(page.currentDropDownValue).toHaveText('B');
		});

		it('Should select drop down by index', function () {
			Helpers.selectOptionByIndex(page.dropDown, 1);
			expect(page.currentDropDownValue).toHaveText('A');
		});

		it('Should select drop down by option', function () {
			Helpers.selectOption(page.dropDownThirdOption);
			expect(page.currentDropDownValue).toHaveText('C');
		});

		it('Should clear current value and set the new one', function () {
			expect(page.inputValue).not.toHaveValue('Ive changed');
			page.setInputValue(page.inputValue, 'Ive changed');
			expect(page.inputValue).toHaveValue('Ive changed');
		});

		it('Should collect console errors', function () {
			Helpers.getFilteredConsoleErrors().then(function (initialErrors) {
				expect(initialErrors.length).toBe(0);
				page.consoleErrorsCreator.click();
				Helpers.getFilteredConsoleErrors().then(function (finalErrors) {
					expect(finalErrors.length).toBe(1);
				});
			});
		});

		it('Should return true if the element has the same value as the one passed.', function () {
			expect(Helpers.hasValue(page.inputValue, 'original value')).toBeTruthy();
			page.setInputValue(page.inputValue, 'new value');
			expect(Helpers.hasValue(page.inputValue, 'new value')).toBeTruthy();
		});

		it('Should return true if the href of the element and the url match', function () {
			expect(Helpers.hasLink(page.link, 'https://docs.angularjs.org/api')).toBeTruthy();
			expect(Helpers.hasLink(page.link, 'https://docs.angularjs.org/')).not.toBeTruthy();
		});

		it('Should return true if the element is disabled.', function () {
			expect(Helpers.isDisabled(page.disabledInput)).toBeTruthy();
			expect(Helpers.isDisabled(page.activatedInput)).toBeFalsy();
		});

		it('Should return true if the element is checked.', function () {
			expect(Helpers.isChecked(page.checkbox)).toBeFalsy();
			page.checkbox.click();
			expect(Helpers.isChecked(page.checkbox)).toBeTruthy();
		});

	});

	describe('Matchers Tests - ', function () {
		it('Should check if the element is displayed (exists in dom can be hidden).', function () {
			expect(page.visibleElement).toBePresent();
			expect(page.hiddenElement).toBePresent();
			expect(page.noneExistsElement).not.toBePresent();
		});

		it('Should check if the element is displayed (exists in dom and visible).', function () {
			expect(page.visibleElement).toBeDisplayed();
			expect(page.hiddenElement).not.toBeDisplayed();
		});

		it('Should return the count of an object.', function () {
			expect(page.repeaterElement.count()).toHaveCountOf(4);
		});

		it('Should check the element text.', function () {
			expect(page.elementWithText).toHaveText('I am an important text');
			expect(page.elementWithoutText).toHaveText('');
		});

		it('Should check regex against the element text.', function () {
			var percentageRegex = new RegExp(/[0-9]*\.?[0-9]+%/);
			expect(page.percentageElement).toMatchRegex(percentageRegex);
		});

		it('Should check money regex against the element text.', function () {
			expect(page.dollarElement.getText()).toMatchMoney(15, '$');
			expect(page.euroElement.getText()).toMatchMoney(15, '€');
		});

		it('Should check money fraction regex against the element text.', function () {
			expect(page.dollarFractionElement.getText()).toMatchMoneyWithFraction(15.72, '$');
			expect(page.euroFractionElement.getText()).toMatchMoneyWithFraction(15.24, '€');
		});

		it('Should check the input element value and response to changes', function () {
			expect(page.inputValue).toHaveValue('original value');
			page.setInputValue(page.inputValue, 'new value');
			expect(page.inputValue).toHaveValue('new value');
		});

		it('Should check the element class name array', function () {
			expect(page.singularDataHook).toHaveClass('test-class');
			expect(page.multipleDataHook.get(0)).not.toHaveClass('test-class');
		});

		it('Should check if the element is disabled', function () {
			expect(page.disabledInput).toBeDisabled();
			expect(page.activatedInput).not.toBeDisabled();
		});

		it('Should check if the element is checked', function () {
			expect(page.checkbox).not.toBeChecked();
			page.checkbox.click();
			expect(page.checkbox).toBeChecked();
		});

		it('Should check if the input value is valid, invalid or invalid-required', function () {
			expect(page.formName).toBeInvalid();
			expect(page.email).toBeInvalidRequired();
			page.setInputValue(page.formName, 'Miško Hevery');
			page.setInputValue(page.email, 'helper@protractor.com');
			expect(page.formName).toBeValid();
			expect(page.email).toBeValid();
		});

		it('Should get the key from a translated element', function () {
			expect(page.elementThatUsesTranslateFilter.getText()).toMatchTranslated('test-key', 'variable');
		});

		it('Should match the element href to the value on test', function () {
			expect(page.link).toHaveUrl('https://docs.angularjs.org/api');
		});
	});
});

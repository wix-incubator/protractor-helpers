var Page = require('./pageObjects/test-app');
var Helpers = require('../../../dist/protractor-helpers');

describe('product widget suit', function () {
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
			browser.driver.manage().window().maximize();
			browser.driver.manage().window().getSize().then(function (maxSize) {
				Helpers.maximizeWindow();
				browser.driver.manage().window().getSize().then(function (size) {
					expect(size.height).toBe(Math.min(1024, maxSize.height));
					expect(size.width).toBe(1280);
				});
			});
		});

		it('Should allow setting window size with specific values', function () {
			Helpers.maximizeWindow(800, 600);
			browser.driver.manage().window().getSize().then(function (size) {
				expect(size.height).toBe(600);
				expect(size.width).toBe(800);
			});
			Helpers.maximizeWindow();
		});

		it('Should hover elements to make them appear and disappear even with delay', function () {
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

		it('Should select drop down by text', function () {
			Helpers.selectOptionByText(page.dropDown, 'Second');
			expect(page.currentDropDownValue.getText()).toEqual('B');
		});

		it('Should select drop down by index', function () {
			Helpers.selectOptionByIndex(page.dropDown, 1);
			expect(page.currentDropDownValue.getText()).toEqual('A');
		});

		it('Should select drop down by option', function () {
			Helpers.selectOption(page.dropDownThirdOption);
			expect(page.currentDropDownValue.getText()).toEqual('C');
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
				Helpers.getFilteredConsoleErrors().then(function (secondTimeErrors) {
					expect(secondTimeErrors.length).toBe(1);
				});
			});
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

		it('Should return a count by the request made.', function () {
			expect(page.repeaterElement.count()).toHaveLengthOf(4);
		});

		it('Should check the element text.', function () {
			expect(page.elementWithText).toHaveText('I have an important text');
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
			expect(page.inputValue).toHaveValue('originalValue');
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
	});
});

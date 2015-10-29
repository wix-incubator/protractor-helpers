var Page = require('./pageObjects/test-app');

describe('product widget suit', function () {
	var page;
  	beforeEach(function () {
		page = new Page();
		page.navigate();
	});
	it('test', function () {
		expect(true).toBeTruthy();
	})
});

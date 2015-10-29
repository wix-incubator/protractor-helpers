var Page = require('./pageObjects/test-app');

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
  })
});

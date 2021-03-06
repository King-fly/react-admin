var utils = require('./utils');

describe('EditionView', function () {
    'use strict';

    beforeEach(function () {
        // Refresh Fakerest data
        browser.get(browser.baseUrl).then(function () {
            browser.driver.wait(function () {
                return browser.driver.isElementPresent(by.css('.panel-heading'));
            }, 10000); // wait 10s
        });
    });

    describe('Edition', function() {

        beforeEach(function() {
            browser.get(browser.baseUrl + '#/posts/edit/12').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.react-admin-field-title input'));
                }, 10000); // wait 10s
            });
        });

        it('should render an edit page with form fields', function () {
            expect($('.react-admin-field-title input').getAttribute('value')).toBe('Qui tempore rerum et voluptates');
        });

        it('should update values on form submit', function () {
            $('#edit-view .react-admin-field-title input').sendKeys(' and what ?').then(function () {
                $('#edit-view button[type="submit"]').click().then(function () {
                    // Wait for notification to be displayed
                    utils.waitElementWithText('.humane-flatty-success');

                    // Check that a notification has been displayed
                    expect($('.humane-flatty-success').getText()).toBe('Changes successfully saved.');

                    expect($('.page-header h1').getText()).toContain('and what ?');
                });
            });
        });

    });

    describe('SelectField', function() {

        beforeEach(function() {
            browser.get(browser.baseUrl + '#/comments/edit/11').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.react-admin-field-post_id input'));
                }, 10000); // wait 10s
            });
        });

        it('should render as a dropdown with reference choices', function () {
            expect($('.react-admin-field-post_id input').getAttribute('value')).toBe('1');
            expect($('.react-admin-field-post_id div.Select-placeholder').getText()).toBe('Accusantium qui nihil voluptatum quia voluptas maxime ab similique');

            $('.react-admin-field-post_id span.Select-arrow').click().then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.react-admin-field-post_id div.Select-menu-outer'));
                }, 5000); // wait 5s

                $$('.react-admin-field-post_id .Select-option').then(function (options) {
                    expect(options.length).toBe(12);
                });
            });
        });

        it('should render as a dropdown when choices is a function', function () {
            $('#edit-view .react-admin-field-post_id .Select-input input')
                .sendKeys('Sint dignissimos in architecto aut')
                .sendKeys(protractor.Key.ENTER)
                .then(function () {
                    expect($('.react-admin-field-post_id input').getAttribute('value')).toBe('2');
                });
        });

    });

    describe('DateField', function() {

        beforeEach(function() {
            browser.get(browser.baseUrl + '#/posts/edit/12').then(function () {
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.react-admin-field-published_at input'));
                }, 10000); // wait 10s
            });
        });

        it('allows update from a calendar', function () {
            $('.react-admin-field-published_at .input-group-addon').click().then(function () {
                // Wait for calendar to display
                browser.driver.wait(function () {
                    return browser.driver.isElementPresent(by.css('.react-admin-field-published_at .bootstrap-datetimepicker-widget td.active'));
                }, 2000);

                $('.react-admin-field-published_at .bootstrap-datetimepicker-widget td.active + td').click().then(function () {
                    // Wait for calendar to hide
                    var displayed = true;
                    browser.driver.wait(function () {
                        $('.react-admin-field-published_at .bootstrap-datetimepicker-widget').isDisplayed().then(function (value) {
                            displayed = value;
                        });

                        return !displayed;
                    }, 5000);

                    // Submit form
                    $('#edit-view button[type="submit"]').click().then(function () {
                        $('.btn-show').click().then(function () {
                            browser.driver.wait(function () {
                                return browser.driver.isElementPresent(by.css('.react-admin-field-published_at'));
                            }, 10000); // wait 10s

                            expect($('.react-admin-field-published_at').getText()).toBe('2012-11-08');
                        });
                    });
                });
            });
        });

    });

    xdescribe('ChoiceField', function() {

        it('should render as a dropdown when choices is an array', function () {
            $$('.ng-admin-field-category select option').then(function (options) {
                expect(options[1].getText()).toBe('Tech');
                expect(options[1].getAttribute('selected')).toBe('true');
                expect(options[2].getText()).toBe('Lifestyle');
            });
        });

        it('should render as a dropdown when choices is a function', function () {
            $$('.ng-admin-field-subcategory select option').then(function (options) {
                expect(options[1].getText()).toBe('Computers');
                expect(options[1].getAttribute('selected')).toBe('true');
                expect(options[2].getText()).toBe('Gadgets');
            });
        });

    });

});

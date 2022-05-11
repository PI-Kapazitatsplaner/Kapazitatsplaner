/// <reference types="cypress" />

describe ('Mein Kalender', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/');
        cy.get('div.bar').get('button').filter(':contains("Settings")').click();
        cy.get('#settingsForm').as('form');
    })

    it('should have a title and correct header', () => {
        cy.title().should('include', 'Settings');
        cy.get('div.nav').get('h1').should('contain', 'Settings');
        cy.get('div.nav').get('img')
            .should('have.attr', 'onclick', `location.href='/mein_kalender'`)
            .should('have.attr', 'src', '/Images/arrow_back.png');
    })

    it('setting for light and dark mode is working', () => {
        cy.get('form').get('div.element').eq(0).find('input').should('have.length', 2);
        cy.get('form').get('div.element').eq(0).find('input').eq(0).as('darkInput');
        cy.get('form').get('div.element').eq(0).find('input').eq(1).as('lightInput');
        cy.get('@darkInput').should('have.attr', 'type', 'radio')
            .and('have.attr', 'name', 'theme')
            .and('have.attr', 'value', 'dark');
        cy.get('@lightInput').should('have.attr', 'type', 'radio')
            .and('have.attr', 'name', 'theme')
            .and('have.attr', 'value', 'light');

        cy.get('@darkInput').check().should('be.checked');
        cy.get('@lightInput').should('not.be.checked');
        cy.get('@form').submit();
        cy.reload();
        cy.get('@darkInput').should('be.checked');
        cy.get('@lightInput').should('not.be.checked');

        cy.get('@lightInput').check().should('be.checked');
        cy.get('@darkInput').should('not.be.checked');
        cy.get('@form').submit();
        cy.reload();
        cy.get('@lightInput').should('be.checked');
        cy.get('@darkInput').should('not.be.checked');

        cy.get('@darkInput').check()
        cy.get('@form').submit();
    })

    it('setting for default days off is working', () => {
        cy.get('form').get('div.element').eq(1).find('input').should('have.length', 7);

        cy.get('form').get('div.element').eq(1).find('input').eq(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDay()).uncheck().should('not.be.checked');
        cy.get('@form').submit();

        cy.get('div.nav').get('img').click();

        cy.get('div.calendar').get('ul.days').children().filter('.fillerDay').should('have.length', );

    })



})
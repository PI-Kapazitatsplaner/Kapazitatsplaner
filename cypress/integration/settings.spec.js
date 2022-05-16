/// <reference types="cypress" />

describe ('Mein Kalender', () => {

    beforeEach(() => {
        cy.exec('npx prisma db seed');
        cy.visit('http://localhost:'+ Cypress.env("port"));
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

        cy.get('form').get('div.element').eq(1).find('input').each(($el)=> {
            cy.wrap($el).uncheck().should('not.be.checked');
        })
        cy.get('@form').submit();

        cy.visit('http://localhost:'+ Cypress.env("port"));

        cy.get('div.calendar').get('ul.days').children().filter('.abwesend').should('have.length', 0);
        cy.get('div.calendar').get('ul.days').children().filter('.halbbwesend').should('have.length', 0);

        cy.get('div.bar').get('button').filter(':contains("Settings")').click();

        cy.get('form').get('div.element').eq(1).find('input').eq(0).check().should('be.checked');
        cy.get('@form').submit();

        cy.visit('http://localhost:'+ Cypress.env("port"));

        cy.get('div.calendar').get('ul.days').children().filter('.abwesend').should('have.length', 5);
        cy.get('div.calendar').get('ul.days').children().eq(7).should('have.class', 'abwesend');
    })  

    it('adding and removing teams works', () => {
        cy.get('form').get('div.element').should('have.length', 4);
        cy.get('form').get('div.element').eq(2).find('i').click();
        cy.get('form').get('div.element').should('have.length', 3);
        cy.get('@form').submit();
        cy.reload();
        cy.get('form').get('div.element').should('have.length', 3);
        cy.get('form').get('button[type=button].addBtn').click();
        cy.get('form').get('div.element').should('have.length', 4);
        cy.get('form').get('#teamInput').type('Team1');
        cy.get('@form').submit();
        cy.reload();
        cy.get('form').get('div.element').should('have.length', 4);
        cy.get('form').get('div.element').eq(3).contains("Team1");
    })

    it.only('changing productivity in teams works', () => {
        cy.get('form').get('div.element').eq(2).find('input[name=productivity]').as('pi1');
        cy.get('@pi1').should('have.attr', 'type', 'number');
        cy.get('@pi1').should('have.attr', 'min', '0');
        cy.get('@pi1').should('have.attr', 'max', '100');
        cy.get('@pi1').should('have.attr', 'value', '50');
        cy.get('@pi1').clear().type('10');
        cy.get('#saveBtn').should('not.have.attr', 'disabled');
        cy.get('@form').submit();
        cy.reload();
        cy.get('@pi1').should('have.attr', 'value', '10');
        cy.get('@pi1').clear().type('79');
        cy.get('#saveBtn').should('have.attr', 'disabled');
    })
})
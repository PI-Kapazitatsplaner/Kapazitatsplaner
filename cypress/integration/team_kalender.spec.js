/// <reference types="cypress" />

describe ('Mein Kalender', () => {

    beforeEach(() => {
        cy.visit('http://localhost:' + Cypress.env("port"));
        cy.get('header').get("a").filter(':contains("Team Kalender")').click();
    })

    it('should have a title and correct header', () => {
        cy.title().should('include', 'Team Kalender');
        cy.get('div.bar').get('button').should((buttons) => {
            expect(buttons[0].textContent).to.equal('Logout(mock)');
            expect(buttons[1].textContent).to.equal('Settings');
            expect(buttons[2].textContent).to.equal('Termine verwalten');
        })
        cy.get('header').get('b').should('contain', 'Team Kalender');
    })

})
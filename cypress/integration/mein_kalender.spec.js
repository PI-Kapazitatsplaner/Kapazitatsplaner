/// <reference types="cypress" />

describe ('Mein Kalender', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    })

    it('should have a title and correct header', () => {
        cy.title().should('include', 'Mein Kalender');
        cy.get('div.bar').get('button').should((buttons) => {
            expect(buttons[0].textContent).to.equal('Logout(mock)');
            expect(buttons[1].textContent).to.equal('Settings');
            expect(buttons[2].textContent).to.equal('Termine verwalten');
        })
        cy.get('header').get('b').should('contain', 'Mein Kalender');
    })

    it('should have a calendar and be in the current Month', () => {
        cy.url().should('include', '/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 1));
        cy.get('div.calendar').get('div.month').should('contain', new Date().toLocaleString('de-DE', { month: 'long' })).and('contain', new Date().getFullYear());
    })

    it('should have the correct month in next and prev', () => {
        cy.prevCalendar();
        cy.url().should('include', '/' + new Date().getFullYear() + '/' + (new Date().getMonth()));  
        cy.nextCalendar(); 
        cy.nextCalendar();
        cy.url().should('include', '/' + new Date().getFullYear() + '/' + (new Date().getMonth() + 2)); 
    })

    it('should have a calendar with the correct number of days and filler Days', () => {
        cy.get('div.calendar').get('ul.days').children().filter('.fillerDay').should('have.length', new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDay());
        cy.get('div.calendar').get('ul.days').children().not('.fillerDay').should('have.length', new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate());
    })
    
    it('should behave correct when changing from anwesend to halbAnwesend to abwesend', () => {
        cy.get('div.calendar').get('ul.days').children().filter('.anwesend').eq(1)
            .click().should('have.class', 'abwesend')
            .click().should('have.class', 'halbAbwesend')
            .click().should('have.class', 'anwesend');
    })
})

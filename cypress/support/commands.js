// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('calendar.prev', () => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('prevCalendar', () => { 
    cy.get('div.calendar').get('div.month').get('li.prev').click()
})

Cypress.Commands.add('nextCalendar', () => { 
    cy.get('div.calendar').get('div.month').get('li.next').click()
})

Cypress.Commands.add('getCountOfMondaysInCurrentMonth', () => {
    let d = new Date();
    d.setDate(1);
    const month = d.getMonth();
    let mondays = 0;
    while (d.getDay() !== 1) { d.setDate(d.getDate() + 1);}
    while (d.getMonth() === month) {
        mondays++;
        d.setDate(d.getDate() + 7);
    }
    return mondays;
})

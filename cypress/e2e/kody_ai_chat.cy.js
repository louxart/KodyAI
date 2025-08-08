describe('Kody AI - Pruebas de UI básicas sin backend', () => {

  beforeEach(() => {
    cy.visit('https://kody-ai.vercel.app/');
  });

  it('Debe cargar la página principal correctamente', () => {
    cy.contains('Your AI Partner for Web Development').should('be.visible');
    cy.contains('Get Started').should('be.visible');
    cy.contains('Login').should('exist');
    cy.contains('Register').should('exist');
  });

  it('El botón "Login" debe existir y no romper la página al hacer clic', () => {
    cy.visit('https://kody-ai.vercel.app/');
    cy.contains('Login')
  .should('exist')
  .should('be.visible')
  .click({ force: true }); 

  });

  it('El botón "Register" debe existir y navegar sin romperse', () => {
    cy.visit('https://kody-ai.vercel.app/');
    cy.contains('Register')
      .should('exist')
      .should('be.visible')
      .scrollIntoView()
      .then(($el) => {
        cy.wrap($el).click({ force: true });
      });
  
    cy.location('pathname', { timeout: 10000 }).should('include', '/register');
    cy.get('body').should('not.contain.text', 'Internal Server Error');
  });
  

  it('El botón "Get Started" debe existir y navegar sin romperse', () => {
    cy.visit('https://kody-ai.vercel.app/');
    cy.contains('Get Started')
    .should('exist')
    .should('be.visible')
    .scrollIntoView()
    .then(($el) => {
      cy.wrap($el).click({ force: true });
    });

  cy.location('pathname', { timeout: 10000 }).should('include', '/register');
  cy.get('body').should('not.contain.text', 'Internal Server Error');
  });

  it('Debe mostrar elementos de beneficios principales', () => {
    cy.visit('https://kody-ai.vercel.app/');
    cy.contains(/^AI.*Assistance$/).should('exist');
    cy.contains(/^Relevant Documentation$/).should('exist');
    cy.contains(/^One Active Session$/).should('exist');
  });
});

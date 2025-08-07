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
    cy.contains('Login').click();
    cy.location('pathname').should('satisfy', (path) =>
      path === '/' || path.includes('/login') || path.includes('404')
    );
    cy.get('body').should('not.contain.text', 'Internal Server Error');
  });

  it('El botón "Register" debe existir y no causar error', () => {
    cy.contains('Register').click();
    cy.location('pathname').should('satisfy', (path) =>
      path === '/' || path.includes('/register') || path.includes('404')
    );
    cy.get('body').should('not.contain.text', 'Internal Server Error');
  });

  it('El botón "Get Started" debe existir y navegar sin romperse', () => {
    cy.contains('Get Started').click();
    cy.location('pathname').should('satisfy', (path) =>
      path === '/' || path.includes('/chat') || path.includes('404')
    );
    cy.get('body').should('not.contain.text', 'Internal Server Error');
  });

  it('Debe mostrar elementos de beneficios principales', () => {
    cy.contains('AI‑Powered Assistance').should('exist');
    cy.contains('Relevant Documentation').should('exist');
    cy.contains('One Active Session').should('exist');
  });

});

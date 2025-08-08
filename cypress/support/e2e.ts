// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
Cypress.on('uncaught:exception', (err) => {
    // Ignorar errores de React minificados como el #418
    if (err.message && err.message.includes('Minified React error')) {
      return false;
    }
  
    // También ignora errores comunes de RSC en Next.js
    if (err.message && err.message.includes('hydration')) {
      return false;
    }
  
    // Deja pasar el resto de errores
    return true;
  });
  
  Cypress.on('uncaught:exception', (err) => {
    if (
      err.message.includes('Minified React error') ||
      err.message.includes('hydration') ||
      err.message.includes('Invariant failed')
    ) {
      return false;
    }
  
    return true;
  });
  
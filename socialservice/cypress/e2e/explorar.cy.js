describe('Login y exploración de proyectos', () => {
  it('Inicia sesión y accede a la vista de explorar', () => {
    cy.visit('http://localhost:3000');

    // Verifica elementos de la vista de login
    cy.contains('INICIAR SESIÓN');
    cy.get('button').contains('Continuar con Google').click();

    // Espera la redirección
    cy.url().should('include', '/explorar');

    // Verifica que se carga la página de explorar
    cy.contains('Explorar');
    cy.get('[placeholder="Buscar..."]').should('exist');
  });

  it('Filtra proyectos por modalidad', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Continuar con Google').click();
    cy.url().should('include', '/explorar');

    cy.get('button').contains('Modalidad').click();
    cy.contains('En línea').click();
    cy.get('body').click();

    cy.get('[data-testid="card-item"]').each(($card) => {
      cy.wrap($card).contains('En línea');
    });
  });
  
  it('Carga correctamente la página y muestra proyectos', () => {
    cy.contains('Explorar');
    cy.get('[placeholder="Buscar..."]').should('exist');
    cy.get('button').contains('Modalidad');
    cy.get('button').contains('Horas');
    cy.get('[data-testid="card-item"]').should('exist'); // Solo si CardItem tiene `data-testid`
  });

  it('Filtra proyectos por modalidad', () => {
    cy.get('button').contains('Modalidad').click();
    cy.contains('En línea').click();
    cy.get('body').click(); // Para cerrar el dropdown
    cy.get('[data-testid="card-item"]').each(($card) => {
      cy.wrap($card).contains('En línea');
    });
  });

  it('Filtra proyectos por horas', () => {
    cy.get('button').contains('Horas').click();
    cy.contains('120').click();
    cy.get('body').click(); // cerrar dropdown
    cy.get('[data-testid="card-item"]').each(($card) => {
      cy.wrap($card).contains('120');
    });
  });

  it('Filtra usando la barra de búsqueda', () => {
    cy.get('[placeholder="Buscar..."]').type('salud');
    cy.get('[data-testid="card-item"]').each(($card) => {
      cy.wrap($card).invoke('text').should('include', 'salud');
    });
  });

  it('Limpia filtros correctamente', () => {
    cy.get('button').contains('Horas').click();
    cy.contains('100').click();
    cy.get('body').click();
    cy.get('button').contains('Modalidad').click();
    cy.contains('Mixto').click();
    cy.get('body').click();
    cy.get('[placeholder="Buscar..."]').type('educación');

    cy.get('button').find('svg').click(); // Botón de limpiar (icono de basurero)
    cy.get('[placeholder="Buscar..."]').should('have.value', '');
    cy.get('[data-testid="card-item"]').should('exist');
  });
});

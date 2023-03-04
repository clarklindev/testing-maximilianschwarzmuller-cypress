describe('page navigation', ()=>{
  it('should navigate between pages', ()=>{
    cy.visit('http://localhost:5173/');
    cy.get('[data-cy="header-about-link"]').click();
    // verify we navigated to that page
    cy.location('pathname').should('eq', '/about'); //about
    cy.go('back');
    cy.location('pathname').should('eq', '/'); //home

    //go to about page
    cy.get('[data-cy="header-about-link"]').click();
    //test home link from about page
    cy.get('[data-cy="header-home-link"]').click();
    cy.location('pathname').should('eq', '/'); //home

  })
})
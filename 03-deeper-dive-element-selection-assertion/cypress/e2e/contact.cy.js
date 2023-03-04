describe("contact form", ()=>{
  it("should submit the form", ()=>{
    cy.visit('http://localhost:5173/about');
    cy.get('[data-cy="contact-input-message"]').type('Hello world');
    cy.get('[data-cy="contact-input-name"]').type('John');
    cy.get('[data-cy="contact-input-email"]').type('john@email.com');
    //check button text before sending
    cy.get('[data-cy="contact-btn-submit"]').contains('Send Message');
    // check button is not disabled
    cy.get('[data-cy="contact-btn-submit"]').should('not.have.attr', "disabled");
    cy.get('[data-cy="contact-btn-submit"]').click();
    // sending state
    cy.get('[data-cy="contact-btn-submit"]').contains('Sending...');
    //check button is disabled
    cy.get('[data-cy="contact-btn-submit"]').should('have.attr', "disabled");  
  });

  it("should validate the form input", ()=>{
    // make sure form is not submitted if not valid
    cy.visit('http://localhost:5173/about');
    cy.get('[data-cy="contact-btn-submit"]').click();
    cy.get('[data-cy="contact-btn-submit"]').then(el=>{
      // make sure invalid form is not sending
      expect(el).to.not.have.attr('disabled');
      expect(el.text()).to.not.equal("Sending...");
    });
    cy.get('[data-cy="contact-btn-submit"]').contains('Send Message');

    // styling on focus/loss of focus
    cy.get('[data-cy="contact-input-message"]').as('msgInput');
    cy.get('@msgInput').focus().blur();
    // check if paragraph wrapping input has class that contains "invalid" 
    cy.get('@msgInput')
      .parent()
      // causes error when running in cmdline npx cypress run
      // .then(el=>{
      //   expect(el.attr("class")).to.contains('invalid');
      // });
      .should('have.attr', 'class')
      .and('match', /invalid/);

  });
});
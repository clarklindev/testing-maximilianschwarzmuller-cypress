/// <reference types="Cypress"/>

// introduction
describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.main-header img');
  })
  
  it('should display the page title', ()=>{
    cy.visit('http://localhost:5173/');
    cy.get('h1').should("have.length", 1);
  })
})


// user interaction
describe('tasks management', ()=>{

  it('should open and close the new task modal', ()=>{
      cy.visit('http://localhost:5173/');
      cy.contains('Add Task').click();
      cy.get('.backdrop').click({force: true}); //note backdrop click is by default at center, but the form is above it. so we use force
      cy.get('.backdrop').should('not.exist');
      cy.get('.modal').should('not.exist');

      cy.contains('Add Task').click();
      cy.contains('Cancel').click();
      cy.get('.backdrop').should('not.exist');
      cy.get('.modal').should('not.exist');
  });

  // simulate typing
  it('should create a new task', ()=>{
    cy.visit('http://localhost:5173/');
    cy.contains('Add Task').click();
    cy.get('#title').type('New Task');
    cy.get('#summary').type('Some description');
    cy.get('.modal').contains('Add Task').click();
    // modal should be closed
    cy.get('.backdrop').should('not.exist');
    cy.get('.modal').should('not.exist');
    // on modal...
    cy.get('.task').should('have.length', 1);
    cy.get('.task h2').contains('New Task');
    cy.get('.task p').contains('Some description');
  });

  // validation - if form input is empty
  it('should validate input', ()=>{
    cy.visit('http://localhost:5173/');
    cy.contains('Add Task').click();
    cy.get('.modal').contains('Add Task').click();
    cy.contains('Please provide values');
  });

  //selecting dropdown values - use select filter to display or not display task
  it("should filter tasks", ()=>{
    cy.visit('http://localhost:5173/');
    cy.contains('Add Task').click();
    cy.get('#title').type('New Task');
    cy.get('#summary').type('some text');
    cy.get('#category').select('urgent'); //can use label or value
    cy.get('.modal').contains('Add Task').click();

    //task is visible
    cy.get('.task').should('have.length', 1);

    //changing category in another select
    cy.get('#filter').select('moderate');
    cy.get('.task').should('have.length', 0);   //should have 0 because we selected 'urgent'
    
    cy.get('#filter').select('urgent');
    cy.get('.task').should('have.length', 1);  

    cy.get('#filter').select('all');
    cy.get('.task').should('have.length', 1);  
  });

  it("should add multiple tasks", ()=>{
    cy.visit('http://localhost:5173/');

    // task 1 exists
    cy.contains('Add Task').click();
    cy.get('#title').type('task 1');
    cy.get('#summary').type('first task');
    cy.get('.modal').contains('Add Task').click();
    cy.get('.task').should('have.length', 1);
    // task 2 exists
    cy.contains('Add Task').click();
    cy.get('#title').type('task 2');
    cy.get('#summary').type('second task');
    cy.get('.modal').contains('Add Task').click();
    cy.get('.task').should('have.length', 2);

    //check order sequence is correct
    cy.get('.task').first().contains('first task');
    cy.get('.task').last().contains('second task');
  });
})
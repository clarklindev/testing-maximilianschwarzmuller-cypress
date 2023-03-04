
# Cypress
extension is: .cy.js
vscode add extension for Cypress autocomplete

```powershell
npm i cypress

# go to project folder
npx cypress open
```

- E2E testing -> start E2E Testing in chrome -> new Spec
- this creates a cypress/ folder in your project folder
- test run in isolation

## testing - link should exist
- it will fail if project not started
- npm run dev
- to get auto cypress auto completion add to top of test file: 
- 

```js
// using cy object to make tests
// .get() to work with DOM finding elements on page using css selector
/// <reference types="Cypress"/>

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
```

## testing with get() vs find()
  - get() starts from root node, 
  - find() should be used to look inside element from found elements own children
  - contains() looks inside element
  
## simulate user interaction 

#### a click
- cy.get('button').click();

```js
/// <reference types="Cypress"/>

describe('tasks management', ()=>{

    it('should open and close the new task modal', ()=>{
        cy.visit('http://localhost:5173/');
        cy.get('button').click();
        cy.get('.backdrop').click({force: true});
    })
})
```

#### simulate typing
```
.type()
```

#### simulate selecting
```
.select()
```

```js
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
```
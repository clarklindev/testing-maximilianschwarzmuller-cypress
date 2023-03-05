
# Cypress
extension is: .cy.js
vscode add extension for Cypress autocomplete

```powershell
npm i cypress

# go to project folder
npx cypress run (run in headless mode)
npx cypress open
```

- E2E testing -> start E2E Testing in chrome -> new Spec
- this creates a cypress/ folder in your project folder
- test run in isolation
- the official recommended way to select elements from dom is to use data- attribute as a selector
- use cypress studio app in the browser -> selector playground to hover over elements and cypress give you the best selector
- you can use constants to store cy DOM queries - but preferable to rather use as()
- cypress gives each test step 4seconds timeframe to run assertion

## testing - link should exist
- it will fail if project not started
- npm run dev
- to get auto cypress auto completion add to top of test file: 
- /// <reference types="Cypress"/>


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

### using data- attributes for testing
- navigate between pages
- data-cy attribute - this is the recommended default way to select elements
- use .go() and .location() for navigating

```js
it('should navigate between pages', ()=>{
    cy.visit('http://localhost:5173/');
    cy.get('data-cy["header-about-link"]').click();
    // verify we navigated to that page
    cy.location('pathname').should('eq', '/about'); //about
    cy.go('back');
    cy.location('pathname').should('eq', '/'); //home

    //go to about page
    cy.get('data-cy["header-about-link"]').click();
    //test home link from about page
    cy.get('data-cy["header-home-link"]').click();
    cy.location('pathname').should('eq', '/'); //home

  })
```

## forms
```js
// contact.cy.js
describe("contact form", ()=>{
  cy.visit('http://localhost:5173/about');
  cy.get('[data-cy="contact-input-message"]').type('Hello world');
  cy.get('[data-cy="contact-input-name"]').type('John');
  cy.get('[data-cy="contact-input-email"]').type('john@email.com');
  //check button text before sending
  cy.get('[data-cy="contact-button-submit"]').contains('Send Message');
  // check button is not disabled
  cy.get('[data-cy="contact-button-submit"]').should('not.have.attr', "disabled");
  cy.get('[data-cy="contact-button-submit"]').click();
  // sending state
  cy.get('[data-cy="contact-button-submit"]').contains('Sending...');
  //check button is disabled
  cy.get('[data-cy="contact-button-submit"]').should('have.attr', "disabled");
})
```

### using an alias and then referencing it with @
- you can use constants to store cy DOM queries - but preferable to rather use as()
  
```js
  cy.get('[data-cy="contact-button-submit"]').as('submitBtn');
  cy.get('@submitBtn').click();

```

### reference to the element (wrapper around result set from css selector)
- cypress allows the then method -> which you can pass an anonymous function 
- .get() returns actual element in dom giving access to the dom element properties (wrapper object around matched dom element(s))
- then() method can be chained
- MUST make use of expect() inside .then() - cant use should() inside then()

```js
  cy.get('[data-cy="contact-button-submit"]').then((el)=>{
    expect(el.attr('disabled')).to.be.undefined;
  })

```

### simulating special key presses
- eg. hitting enter key to submit 
- {enter} key press simulation

```js
 cy.get('[data-cy="contact-input-email"]').type('john@email.com{enter}');

```

###  validation and styling change and checking after touched / dirty  
- eg. when you active an input, but click away


### running cypress tests from vscode internal powershell
- you can run tests using:
- test results may differ from browser cypress studio app (npx cypress open)
```
npx cypress run
```

### screenshots
- you can tell cypress to take screenshots

```js
cy.screenshot();
```

----------------------------------------
# 04 Configuration

- shared logic
- config file: cypress.config.js
- setting timeouts configuration - waiting for timeframe before failing test
- settings local to a file by using an object as second parameter where you can put settings on a per test basis: 
- setting browser to use: npx cypress run --browser firefox
- setting 'base url' should be set globally in the cypress.config.js file under 'e2e' 
  - makes urls relative paths 

```js
describe('contact form', {}, () =>{}) 
```

```js
// cypress.config.js
import { defineConfig } from "cypress";

export default defineConfig({
  video: true,
  videosFolder: '',
  videoCompression: '',
  screenshotOnRunFailure: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173'
  },
});

```

- after setting baseUrl, links can use relative pathing:
```js
// contact.cy.js
describe('contact form', {}, () => {
  it('should submit the form', () => {
    cy.visit('/about');
  });
});
```

### sharing logic
- beforeEach(()=>{}) hook allows running certain code before each test
- after this is set up we can remove this line from each test
- beforeEach runs before each test, where as before() runs only once before all tests
- theres also after(()=>{}) and afterEach(()=>{}) but its more recommended to use before(), beforeEach() for initialization and cleanup

```js

before(()=>{
  //runs once before all tests
});


beforeEach(()=>{
  cy.visit('/about'); //http://localhost:5173/about
})

```

### custom commands & queries
- custom commands - reusable shortcuts for complex command chains
  - custom commands can make code less readable
  - folder cypress/support/commands.js

- custom queries - synchronous, chainable, re-triable commands
  - eg. get('[data-cy=""]');

```js
// cypress/support/commands.js

// command
Cypress.Commands.add('submitForm', ()=>{
  cy.get('form button[type="submit"]').click();
});

// query - 'getById'
Cypress.Commands.addQuery('getById', (id)=>{
  //preparing function to be called
  const getFn = cy.now('get', `[data-cy="${id}"]`)
  return ()=>{
    //actually calling function
    return getFn();
  }
});

```

```js
cy.getById('contact-input-name')
```

### tasks
cy.task() 
- in cypress.config.js, under setupNodeEvents() allows you to listen to certain events generated by Cypress eg. on()
- there is a 'task' event
- this allows you to run code outside of your browser
- the on("task", {}) second property is an object which you give a property name and assign a function to call
- and you call it like cy.task('seedDatabase') 
- parameters and returns from task is optional
- access the returned value with .then()

```js
cy.task('seedDatabase', 'filename.csv').then(returnValue=>{
  //use return value
})
```

```js
export default defineConfig({
  // video: true,
  // videosFolder: '',
  // videoCompression: '',
  // screenshotOnRunFailure: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        seedDatabase(filename){
          //run some code
          return filename;
        }
      })
    },
  },
});

```
------------------------------------------------------------------------------------
### 05. Stubs, Spies, Fixtures, Manipulating the Clock

- simulating fetching get users location -> browser asks for permission for location

#### stubs
- a replacement for an existing function / method
- used for evaluating and controlling function calls
- it simulates - by making use of dummy test functions
- eg. browser requests permissions to access location -> simulate getting users location
  - but thats only in browser
  - what happens when you use headless testing (without browser)? 
  - solution is to use stub(), 
    - stub takes 2 arguments: 
      1. points at object that contains the method you want to replace
      2. name of method you want to replace as a string.
- note the window object is only accessible after cy.visit() which gives window object
- you then check if the stub method is called by giving the stub an alias so you can reference it later
- use .callsFake() for the implementation of the as('') fake function that would be called 
- it receives a callback function as argument: cb({coords: { latitude: 37.5, longitude: 48.01 }});
- the execution is almost instant so loader and text might not get picked up by cypress because it happens too quickly
  - addin a timeout to cypress test will make sure it gets picked up 
```js
  navigator.geolocation.getCurrentPosition(function (position) 
```

```js
// e2e/location.cy.js
/// <reference types="cypress" />

describe('share location', () => {
  it('should fetch the user location', () => {
    cy.visit('/').then((win)=>{
                                        // main.js
      cy.stub(win.navigator.geolocation, "getCurrentPosition").as('getUserPosition').callsFake((cb)=>{
        setTimeout(()=>{
          cb({coords: {
            latitude: 37.5,
            longitude: 48.01
          }});
        }, 100);
      });
      cy.get('[data-cy="get-loc-btn"]').click();

      // make sure our stub getCurrentPosition() is called
      cy.get('@getUserPosition').should('have.been.called');
    });
  });
});

```
- we dont test features provided by browser like there is data in the clipboard
- we test if we called this api

### beforeEach()
- tests run in isolation so a stub in first test wont be available for second test unless stub is extracted to be used by tests that need it.
- using a beforeEach hook

```js
describe(()=>{
  beforeEach(()=>{
  });
})

```

### Fixtures
- these are like environment variables but are pieces of json data that can be shared accross tests

```json
// fixtures/user-location.json 
{
  "coords":{
    "latitude": 37.5,
    "longitude": 48.01
  }
}
```

### Spies
- listeners attached to functions 
- does not change or replace the function
- pass object and method name you want to add a spy to

```js
cy.spy(win.localStorage, 'setItem').as('storeLocation');
cy.spy(win.localStorage, 'getItem').as('getStoredLocation');
```

```js
// cy.js
cy.get('@storeLocation').should('have.been.calledwithMatch', /John Doe/, new RegExp(`${latitude}.*${longitude}.*${encodeURI('John Doe')}`));
cy.get('@storeLocation').should('have.been.called');
```

### Timers
- manipulate the clock when waiting for intervals to pass (setTimeout) without waiting the time
- advancing with .tick() to pass time
- cy.clock() should be called in beforeEach() during initialize

```
cy.clock();

cy.tick(2000); 
```
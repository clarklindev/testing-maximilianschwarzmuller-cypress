/// <reference types="cypress" />

describe('share location', () => {
  beforeEach(()=>{
    cy.clock();

    cy.fixture("user-location.json").as('userLocation');

    cy.visit('/').then((win)=>{
      cy.get("@userLocation").then(fakePosition => {
        // main.js - navigator.geolocation.getCurrentPosition()
        cy.stub(win.navigator.geolocation, "getCurrentPosition").as('getUserPosition').callsFake(
          (cb)=>{
          setTimeout(()=>{
            cb(fakePosition);
          }, 100);
        });
      });

      

       // mimic the clipboard to call a promise
    //this stub will return a promise and you can pass a value to resolve. And that value will then be the value yielded by that promise that is returned by the stub.
    cy.stub(win.navigator.clipboard, 'writeText').as("saveToClipboard").resolves();
    });

   
  });

  it('should fetch the user location', () => {
    cy.get('[data-cy="get-loc-btn"]').click();
    // make sure our stub getCurrentPosition() is called
    cy.get('@getUserPosition').should('have.been.called');
    cy.get('[data-cy="get-loc-btn"]').should('be.disabled');
    cy.get('[data-cy="actions"]').should('contain', 'Location fetched');
  });

  it("should share a location URL", ()=> {
    cy.get('[data-cy="name-input"]').type('John Doe');
    cy.get('[data-cy="get-loc-btn"]').click();
    cy.get('[data-cy="share-loc-btn"]').click();
    // make sure browser internal clipboard was used
    cy.get('@saveToClipboard').should('has.been.called');
    cy.tick(2000);
    cy.get('@userLocation').then((fakePosition)=>{
      const {latitude, longitude} = fakePosition.coords;
      cy.get('@saveToClipboard').should(
        'has.been.calledWithMatch', new RegExp(`${latitude}.*${longitude}.*${encodeURI('John Doe')}`));
    })
  });
});
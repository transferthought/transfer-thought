describe('The Sign In Page', () => {
    beforeEach(() => {});

    it('sets auth cookie when logging in via form submission', function() {
        cy.visit('/signin');

        cy.get('input#user-email').type('support@transferthought.com');

        // {enter} causes the form to submit
        cy.get('input#user-password').type(`TT_Support123{enter}`);

        const fullUrl = Cypress.config('baseUrl') + '/';
        cy.url().should('equal', fullUrl);
    });
});

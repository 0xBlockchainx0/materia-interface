describe('Lists', () => {
  beforeEach(() => {
    cy.visit('/swap')
  })

  it('defaults to materia list', () => {
    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#currency-search-selected-list-name').should('contain', 'Materia')
  })

  it('change list', () => {
    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#currency-search-change-list-button').click()
    cy.get('#list-row-tokens-1inch-eth .select-button').click()
    cy.get('#currency-search-selected-list-name').should('contain', '1inch')
    cy.get('#currency-search-change-list-button').click()
    cy.get('#list-row-tokens-materia-eth .select-button').click()
    cy.get('#currency-search-selected-list-name').should('contain', 'Materia')
  })
})

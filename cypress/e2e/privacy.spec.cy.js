describe('Testes da Política de Privacidade', () => {
  it.only('testa a página da política de privacidade de forma independente',function(){
    cy.visit('./src/privacy.html')
    cy.title().should('be.eq','Central de Atendimento ao Cliente TAT - Política de privacidade')
    cy.contains('Talking About Testing').should('be.visible')
  })
})
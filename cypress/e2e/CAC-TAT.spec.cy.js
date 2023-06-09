describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})

/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  beforeEach(function() {
    cy.visit('./src/index.html')
  })
  it('verifica o título da aplicação', function() {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT")
  })

  it('preenche os campos obrigatórios e envia formulário', function(){
    const longText = 'Teste.'
    cy.get('#firstName').type("Luís")
    cy.get('#lastName').type("Santos Seixas")
    cy.get('#email').type("emailteste@gmail.com",{delay: 0})
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.get('button[type="submit"]').click()

    cy.get('.success').should("be.visible")
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
    const longText = 'Test, TESTE TESTE TESTE TESTE TESTE TESTE TESTE TESTE TESTE.'
    cy.get('#firstName').type("Luís")
    cy.get('#lastName').type("Santos Seixas")
    cy.get('#email').type("emailtestegmail.com",{delay: 0})
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.contains('button','Enviar').click()

    cy.get('.error').should("be.visible")
  })

  it('Checar se valores não-numéricos são ignorados no campo telefone', function() {
    cy.get('#phone').type("a99210230b").should('have.value', '99210230')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
    cy.get('#firstName').type("Luís")
    cy.get('#lastName').type("Santos Seixas")
    cy.get('#email').type("emailtestegmail.com",{delay: 0})
    cy.get('#open-text-area').type("longText long text long text abacaxi açaí", {delay: 0})
    //cy.get('#phone').type("99210230", {delay: 0})
    cy.get('#phone-checkbox').check()

    cy.get('button[type="submit"]').click()
    cy.get('.error').should("be.visible")

  })
  
  it('preencher e limpar os campos de digitação', function() {
    cy.get('#firstName').type("Luís").should('have.value','Luís').clear().should('have.value','')
    cy.get('#lastName').type("Santos Seixas").should('have.value','Santos Seixas').clear().should('have.value','')
    cy.get('#email').type("emailtestegmail.com",{delay: 0}).should('have.value','emailtestegmail.com').clear().should('have.value','')
    cy.get('#open-text-area').type("longText long text long text abacaxi açaí", {delay: 0}).should('have.value','longText long text long text abacaxi açaí').clear().should('have.value','')
    cy.get('#phone').type("99210230", {delay: 0}).should('have.value','99210230').clear().should('have.value','')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
    cy.get('#firstName').type("Luís")
    cy.get('button[type="submit"]').click()
    cy.get('.error').should("be.visible")
  })

  it('envia o formuário com sucesso usando um comando customizado', function() {
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should("be.visible")
  })

  it('seleciona um produto (YouTube) por seu texto', function(){
    cy.get('#product').select('YouTube').should('have.value', 'youtube')

  })
  it('seleciona um produto (Mentoria) por seu valor (value)', function(){
    cy.selecionarValue("mentoria")
  })

  it('seleciona um produto (Blog) por seu índice', function(){
    cy.get('#product').select(1).should('have.value', 'blog')
  })

  it('marca cada tipo de atendimento',function(){
    //cy.get("input[type='radio'][value ='feedback']").check().should('have.value', 'feedback')

    cy.get("input[type='radio']").should('have.length',3)
    .each(function($radio){
      cy.wrap($radio).check()
      cy.wrap($radio).should('be.checked')
    })
  })

  it('marca ambos checkboxes, depois desmarca o último"', function(){
    cy.get('input[type="checkbox"]').check().should('be.checked')
    .last().uncheck().should('not.be.checked')
  })

  it('seleciona um arquivo da pasta fixtures',function(){
    cy.fillMandatoryFields()
    cy.get('#file-upload').selectFile('cypress/fixtures/example.json')
    .should(function($input){
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('seleciona um arquivo simulando um drag-and-drop',function(){
    cy.get('#file-upload').should('not.have.value').selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
    .should(function($input){
      expect($input[0].files[0].name).to.equal('example.json')
    })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload').should('not.have.value').selectFile('@sampleFile')
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
    cy.get('#privacy a').should('have.attr','target','_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
    cy.get('#privacy a').invoke('removeAttr','target').click()
    cy.title().should('be.eq','Central de Atendimento ao Cliente TAT - Política de privacidade')
    cy.contains('Talking About Testing').should('be.visible')
  })

})

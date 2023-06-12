//Rodar repetidas vezes
Cypress._.times(3, function(){
describe('template spec', function() {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})
})

/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
  const WAIT_TIME = 3000
  const longText = Cypress._.repeat('abcde fghijklm opqrstuvxywz',20)
  beforeEach(function() {
    cy.visit('./src/index.html')
  })
  it('verifica o título da aplicação', function() {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT")
  })

  it('preenche os campos obrigatórios e envia formulário', function(){
    cy.clock()
    cy.get('#firstName').type("Luís")
    cy.get('#lastName').type("Santos Seixas")
    cy.get('#email').type("emailteste@gmail.com",{delay: 0})
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.get('button[type="submit"]').click()

    cy.get('.success').should("be.visible")
    cy.tick(WAIT_TIME)
    cy.get('.success').should("not.be.visible")
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
    cy.clock()
    cy.get('#firstName').type("Luís")
    cy.get('#lastName').type("Santos Seixas")
    cy.get('#email').type("emailtestegmail.com",{delay: 0})
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.contains('button','Enviar').click()

    cy.get('.error').should("be.visible")
    cy.tick(WAIT_TIME)
    cy.get('.error').should("not.be.visible")
  })

  it('Checar se valores não-numéricos são ignorados no campo telefone', function() {
    cy.get('#phone').type("a99210230b").should('have.value', '99210230')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
    cy.clock()
    cy.get('#firstName').type("Luís")
    cy.get('#lastName').type("Santos Seixas")
    cy.get('#email').type("emailtestegmail.com",{delay: 0})
    cy.get('#open-text-area').type("longText long text long text abacaxi açaí", {delay: 0})
    //cy.get('#phone').type("99210230", {delay: 0})
    cy.get('#phone-checkbox').check()

    cy.get('button[type="submit"]').click()
    cy.get('.error').should("be.visible")
    cy.tick(WAIT_TIME)
    cy.get('.error').should("not.be.visible")

  })
  
  it('preencher e limpar os campos de digitação', function() {
    cy.get('#firstName').type("Luís").should('have.value','Luís').clear().should('have.value','')
    cy.get('#lastName').type("Santos Seixas").should('have.value','Santos Seixas').clear().should('have.value','')
    cy.get('#email').type("emailtestegmail.com",{delay: 0}).should('have.value','emailtestegmail.com').clear().should('have.value','')
    cy.get('#open-text-area').type("longText long text long text abacaxi açaí", {delay: 0}).should('have.value','longText long text long text abacaxi açaí').clear().should('have.value','')
    cy.get('#phone').type("99210230", {delay: 0}).should('have.value','99210230').clear().should('have.value','')
  })

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
    cy.clock()
    cy.get('#firstName').type("Luís")
    cy.get('button[type="submit"]').click()
    cy.get('.error').should("be.visible")
    cy.tick(WAIT_TIME)
    cy.get('.error').should("not.be.visible")
  })

  it('envia o formuário com sucesso usando um comando customizado', function() {
    cy.clock()
    cy.fillMandatoryFieldsAndSubmit()
    cy.get('.success').should("be.visible")
    cy.tick(WAIT_TIME)
    cy.get('.success').should("not.be.visible")

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

  it('exibe e esconde as mensagens de sucesso e erro usando o invoke', function() {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  })

  it('preenche a area de texto usando o comando invoke', function(){
    cy.clock()
    cy.get('#firstName').type("Luís")
    cy.get('#lastName').type("Santos Seixas")
    cy.get('#email').type("emailteste@gmail.com",{delay: 0})
    cy.get('#open-text-area').invoke('val',longText).should('have.value', longText)
    cy.get('button[type="submit"]').click()

    cy.get('.success').should("be.visible")
    cy.tick(WAIT_TIME)
    cy.get('.success').should("not.be.visible")
  })

  it('faz uma requisição HTTP', function(){
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
    .should(function(response){
      const {status, statusText, body} = response
      expect(status).to.equal(200)
      expect(statusText).to.equal('OK')
      expect(body).to.include('CAC TAT')
    })
  })

  it('achando o gato MEOW',function(){
    cy.get('#cat').invoke('show').should('be.visible')
    cy.get('#title').invoke('text', "Gato Encontrado MIAU MIAU").should('have.text', "Gato Encontrado MIAU MIAU")
  })
})

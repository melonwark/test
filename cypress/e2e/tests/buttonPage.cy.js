/// <reference types = 'cypress' />

import ButtonPage from "../../PageObjects/ButtonPage"

const buttonPage = new ButtonPage()

describe('Тесты страницы Button', function () {
    before(function () {
        cy.fixture('ButtonPageFix').then(function (data) {
            this.data = data
        })
    })
    beforeEach(function () {
        buttonPage.visit()
    })

    it('кликаем на кнопку Отправка fetch -> проверяем что отправился запрос', function () {
        cy.intercept(buttonPage.apiUrls.fetchButtonApi).as('sendReq')
        buttonPage.clickFetchButton()
        cy.wait('@sendReq').then((interception) => {
            expect(interception.request.body).to.include(this.data.fetchBody)
        })
    })

    it('вводим данные в форму, кликаем на кнопку Submit Form -> проверяем что отправился запрос и проверяем отправленные данные', function () {
        const key1 = 'pepe'
        const key2 = 'sadfrog'
        cy.get(buttonPage.formInput).type(key1)
        cy.get(buttonPage.formTextArea).type(key2)
        cy.intercept(buttonPage.apiUrls.submitFormApi).as('subForm')
        buttonPage.clickSubmitForm()
        cy.wait('@subForm').then((interception) => {
            expect(interception.request.body).to.include(`key1=${key1}`)
            expect(interception.request.body).to.include(`key2=${key2}`)
        })
    })

    it('вводим данные в поля -> кликаем на кнопу очистить -> проверяем что поля пустые', function () {
        const dataField1 = 'pupu'
        const dataField2 = 'puuu'
        const multiselectOption = 'item1'
        cy.get(buttonPage.formField1).type(dataField1)
        cy.get(buttonPage.formField2).type(dataField2)
        cy.get(buttonPage.multiselectField).click().find('li').contains(multiselectOption).click()
        buttonPage.clickClearButton()
        cy.get(buttonPage.formField1).should('be.empty')
        cy.get(buttonPage.formField2).should('be.empty')
        cy.get(buttonPage.multiselectField).within(() => {
            cy.contains(multiselectOption).should('not.be.visible')
        })
    })

    it('тыкаем на кнопку -> кнопка блокируется, проверяем', function () {
        cy.get(buttonPage.blockButton).first().click()
        cy.get(buttonPage.blockButton).first().should('be.disabled')
    })

    it('клик на confirm -> проверка появления модалки с текстом -> закрываем модалку', function() {
        const confirmMessage = 'Are you sure?'
        cy.get(buttonPage.confirmButton).click()
        cy.get(buttonPage.modalBoxContent).contains('p', confirmMessage).should('be.visible')
        cy.get(buttonPage.modalCancel).click()
        cy.contains(buttonPage.modalBoxContent).should('not.exist')
    })
})

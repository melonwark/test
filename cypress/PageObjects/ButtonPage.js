/// <reference types='cypress'/>


class ButtonPage
{
    constructor() {
        this.pageUrl = '/button';

        // UI элементы
        
        this.sendRequestButton = '[data-cy=send-request-button]'
        this.formInput = '[data-cy=form-input]'
        this.formTextArea = '[data-cy=form-textarea]'
        this.submitFormButton = '[data-cy=submit-form-button]'
         // clear form
        this.formField1 = '[data-cy=form-field-1]'
        this.formField2 = '[data-cy=form-field-2]'
        this.multiselectField = '[data-cy=multiselect-field]'
        this.clearFormButton = '[data-cy=clear-form-button]'
         //блокировка кнопок
        this.blockButton = '[data-cy=block-button]'
        //confirm
        this.confirmButton = '[data-cy=confirm-button]'
        this.modalCancel = '[data-cy=modal-cancel]'
        this.modalConfirm = '[data-cy=modal-confirm]'
        this.modalBoxContent = '[data-cy=modal-box-content]'
        
        // API endpoints
        this.apiUrls = {
            fetchButtonApi: 'https://jsonplaceholder.typicode.com/todos',
            submitFormApi: 'http://localhost:5174/form'
        }
    }
    // переход на страницу
    visit() {
        cy.visit(this.pageUrl);
    }
    // клики по кнопкам
    clickFetchButton() {
        cy.get(this.sendRequestButton).click();
    }
    clickSubmitForm() {
        cy.get(this.submitFormButton).click();
    }
    clickClearButton() {
        cy.get(this.clearFormButton).click()
    }
    clickBlockButton1() {
        cy.get(this.blockButton1).click()
    }
}

export default ButtonPage
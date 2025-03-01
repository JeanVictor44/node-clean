import { AddAccount } from "../../domain/use-cases/add-account"
import { InvalidParamError, MissingParamError } from "../errors"
import { badRequest, serverError } from "../helpers/http-helper"
import { Controller, EmailValidator } from "../protocols"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignupController implements Controller {
    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount
    ){}

    handle(httpRequest: HttpRequest): HttpResponse {
        const { email, password, passwordConfirmation } = httpRequest.body

        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            
            for(let field of requiredFields) {
                if(!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            
            if(password !== passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
            }

            const isValidEmail = this.emailValidator.isValid(email)
            
            if(!isValidEmail){
                return badRequest(new InvalidParamError('email'))
            }

            this.addAccount.add({
                email,
                password,
                name: httpRequest.body.name,
            })
            
            return {
                statusCode: 200,
                body: 'success'
            }
        } catch (error) {
            return serverError()
         
        }
    }
}
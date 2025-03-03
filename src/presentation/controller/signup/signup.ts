import { InvalidParamError, MissingParamError } from "../../errors"
import { badRequest, ok, serverError } from "../../helpers/http-helper"
import { Controller, HttpRequest, HttpResponse } from "../../protocols"
import { AddAccount, EmailValidator } from "./signup-protocols"

export class SignupController implements Controller {
    constructor(
        private readonly emailValidator: EmailValidator,
        private readonly addAccount: AddAccount
    ){}

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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

            const account = await this.addAccount.add({
                email,
                password,
                name: httpRequest.body.name,
            })

            return ok(account)
        } catch (error) {
            console.error(error)
            return serverError()
         
        }
    }
}
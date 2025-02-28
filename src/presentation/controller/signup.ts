import { InvalidParamError } from "../errors/invalid-param-error"
import { MissingParamError } from "../errors/missing-param-error"
import { ServerError } from "../errors/server-error"
import { badRequest } from "../helpers/http-helper"
import { Controller } from "../protocols/controller"
import { EmailValidator } from "../protocols/email-validator"
import { HttpRequest, HttpResponse } from "../protocols/http"


export class SignupController implements Controller {
    constructor(private readonly emailValidator: EmailValidator){}

    handle(httpRequest: HttpRequest): HttpResponse {
        try {
            const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
            
            for(let field of requiredFields) {
                if(!httpRequest.body[field]) {
                    return badRequest(new MissingParamError(field))
                }
            }
            
            const isValidEmail = this.emailValidator.isValid(httpRequest.body.email)
            if(!isValidEmail){
                return badRequest(new InvalidParamError('email'))
            }

            return {
                statusCode: 200,
                body: 'success'
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: new ServerError()
            }
         
        }
    }
}
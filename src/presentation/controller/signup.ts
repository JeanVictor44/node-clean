import { InvalidParamError, MissingParamError } from "../errors"
import { badRequest, serverError } from "../helpers/http-helper"
import { Controller, EmailValidator } from "../protocols"
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
            
            if(httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
                return badRequest(new InvalidParamError('passwordConfirmation'))
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
            return serverError()
         
        }
    }
}
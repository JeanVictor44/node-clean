import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignupController {
    handle(httpRequest: HttpRequest): HttpResponse {
        const requiredFields = ['name', 'email']
        
        for(let field of requiredFields) {
            if(!httpRequest.body[field]) {
                return badRequest(new MissingParamError(field))
            }
        }
        
        return {
            statusCode: 200,
            body: 'Success'
        }
    }
}
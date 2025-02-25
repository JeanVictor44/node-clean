import { MissingParamError } from "../errors/missing-param-error"
import { badRequest } from "../helpers/http-helper"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignupController {
    handle(httpRequest: HttpRequest): HttpResponse {
        const NoResourceFoundStatusCode = 400
        
        if (!httpRequest.body.name){
            return badRequest(new MissingParamError('name'))
        }

        if(!httpRequest.body.email){
            return badRequest(new MissingParamError('email'))
        }

        return {
            statusCode: 200,
            body: 'Success'
        }
    }
}
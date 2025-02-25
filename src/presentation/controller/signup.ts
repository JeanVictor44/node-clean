import { MissingParamError } from "../errors/missing-param-error"
import { HttpRequest, HttpResponse } from "../protocols/http"

export class SignupController {
    handle(httpRequest: HttpRequest): HttpResponse {
        const NoResourceFoundStatusCode = 400
        if (!httpRequest.body.name){
            return {
                statusCode: NoResourceFoundStatusCode,
                body: new MissingParamError('name')
            }
        }

        if(!httpRequest.body.email){
            return {
                statusCode: NoResourceFoundStatusCode,
                body: new MissingParamError('email')
            }
        }

        return {
            statusCode: 200,
            body: 'Success'
        }
    }
}
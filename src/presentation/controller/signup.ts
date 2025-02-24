export class SignupController {
    handle(httpRequest: unknown): any {
        const NoResourceFoundStatusCode = 400
         
        return {
            statusCode: NoResourceFoundStatusCode,
            body: new Error('Missing param: name')
        }
    }
}
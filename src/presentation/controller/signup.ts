export class SignupController {
    handle(httpRequest: any): any {
        const NoResourceFoundStatusCode = 400
        if (!httpRequest.body.name){
            return {
                statusCode: NoResourceFoundStatusCode,
                body: new Error('Missing param: name')
            }
        }

        if(!httpRequest.body.email){
            return {
                statusCode: NoResourceFoundStatusCode,
                body: new Error('Missing param: email')
            }
        }

    }
}
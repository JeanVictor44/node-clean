import { SignupController } from "./signup";

describe('SignUp Controller', () => { 
    test('Should return 400 if no name is provided', () => {
        const sut = new SignupController();
        const httpRequest = {
            body: {
                email: 'anyemail@mail.com',
                password: 'anypassword',
                passwordConfirmation: 'anypassword'
            }
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new Error('Missing param: name'))
    })
})
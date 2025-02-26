import { MissingParamError } from "../errors/missing-param-error";
import { SignupController } from "./signup";

const makeSut = (): SignupController => {
    return new SignupController();
}

describe('SignUp Controller', () => { 
    test('Should return 400 if no name is provided', () => {
        const sut = makeSut();
        const httpRequest = {
            body: {
                email: 'anyemail@mail.com',
                password: 'anypassword',
                passwordConfirmation: 'anypassword'
            }
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', () => {
        const sut = makeSut();
        const httpRequest = {
            body: {
                name: 'anyname',
                password: 'anypassword',
                passwordConfirmation: 'anypassword'
            }
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', () => {
        const sut = makeSut();
        const httpRequest = {
            body: {
                email: 'anymail@mail.com',
                name: 'anyname',
                passwordConfirmation: 'anypassword'
            }
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no password confirmation is provided', () => {
        const sut = makeSut();
        const httpRequest = {
            body: {
                email: 'anymail@mail.com',
                name: 'anyname',
                password: '123456'
            }
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })
})
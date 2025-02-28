import { InvalidParamError, MissingParamError, ServerError } from "../errors";
import { EmailValidator } from "../protocols/email-validator";
import { SignupController } from "./signup";

// Mockar com o case de sucesso
// Stub - dublê de teste com retorno fixo - Teste duble - Retorno marretado

interface SutTypes {
    sut: SignupController,
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true;
        }
    }

    const emailValidatorStub = new EmailValidatorStub();
     
    const sut = new SignupController(emailValidatorStub);

    return {
        sut,
        emailValidatorStub
    }
}

describe('SignUp Controller', () => { 
    test('Should return 400 if no name is provided', () => {
        const {sut, emailValidatorStub} = makeSut();
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
        const {sut} = makeSut();
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
        const {sut} = makeSut();
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
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'anymail@mail.com',
                name: 'anyname',
                password: '123456',
            }
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if an invalid email is provided', () => {
        const {sut, emailValidatorStub} = makeSut();
        
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                name: 'anyname',
                password: '123456',
                passwordConfirmation: 'anypassword'
            }
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should call EmailValidator with correct email', () => {
        const {sut, emailValidatorStub} = makeSut();
        
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                name: 'anyname',
                password: '123456',
                passwordConfirmation: 'anypassword'
            }
        }

        sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    test('Should return 400 if an invalid email is provided', () => {
        class EmailValidatorStub implements EmailValidator{
            isValid(email: string): boolean {
                throw new Error()
            }
        }
    
        const emailValidatorStub = new EmailValidatorStub();
         
        
        const sut = new SignupController(emailValidatorStub);

        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                name: 'anyname',
                password: '123456',
                passwordConfirmation: 'anypassword'
            }
        }

        const httpResponse = sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
})
import { InvalidParamError, MissingParamError, ServerError } from "../../errors";
import { EmailValidator,  AddAccount, AddAccountModel , AccountModel} from "./signup-protocols";
import { SignupController } from "./signup";

// Mockar com o case de sucesso
// Stub - dublê de teste com retorno fixo - Teste duble - Retorno marretado

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true;
        }
    }

    return new EmailValidatorStub();
}

const makeAddAccount = (): AddAccount => {
    class AddAccountStub implements AddAccount{
        async add(account: AddAccountModel): Promise<AccountModel>{
            const fakeAccount = {
                id: 'valid_id',
                name: 'valid_name',
                email: 'valid_email@mail.com',
                password: 'valid_password'
            }

            return new Promise(resolve => resolve(fakeAccount));
        }
    }

    return new AddAccountStub()
}

interface SutTypes {
    sut: SignupController,
    emailValidatorStub: EmailValidator
    addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidator();
    const addAccountStub = makeAddAccount(); 
    const sut = new SignupController(emailValidatorStub, addAccountStub);

    return {
        sut,
        emailValidatorStub,
        addAccountStub
    }
}

describe('SignUp Controller', () => { 
    test('Should return 400 if no name is provided', async() => {
        const {sut, emailValidatorStub} = makeSut();
        const httpRequest = {
            body: {
                email: 'anyemail@mail.com',
                password: 'anypassword',
                passwordConfirmation: 'anypassword'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is provided', async() => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'anyname',
                password: 'anypassword',
                passwordConfirmation: 'anypassword'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is provided', async() => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'anymail@mail.com',
                name: 'anyname',
                passwordConfirmation: 'anypassword'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('Should return 400 if no password confirmation is provided', async() => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'anymail@mail.com',
                name: 'anyname',
                password: '123456',
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if an invalid email is provided', async() => {
        const {sut, emailValidatorStub} = makeSut();
        
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                name: 'anyname',
                password: '123456',
                passwordConfirmation: '123456'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })

    test('Should call EmailValidator with correct email', async() => {
        const {sut, emailValidatorStub} = makeSut();
        
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                name: 'anyname',
                password: '123456',
                passwordConfirmation: '123456'
            }
        }

        await sut.handle(httpRequest)
        expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
    })

    test('Should return 500 EmailValidator throws', async() => {
        const  {emailValidatorStub, sut } = makeSut()

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error()
        })

        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                name: 'anyname',
                password: '123456',
                passwordConfirmation: '123456'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })
    test('Should return 400 if password confirmation fails ', async() => {
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'anymail@mail.com',
                name: 'anyname',
                password: '123456',
                passwordConfirmation: 'invalidpassword'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
    })


    test('Should call add account with correct values', async() => {
        const {sut, addAccountStub} = makeSut();
        const addSpy = jest.spyOn(addAccountStub, 'add')

        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                name: 'anyname',
                password: '123456',
                passwordConfirmation: '123456'
            }
        }

        await sut.handle(httpRequest)
        expect(addSpy).toHaveBeenCalledWith({
            email: 'invalid_email@mail.com',
            name: 'anyname',
            password: '123456',
        })
    })

    test('Should return 500 if AddAccount throws', async() => {
        const  {addAccountStub, sut } = makeSut()

        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            return new Promise((resolve, reject) => reject(new Error()))
        })

        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                name: 'anyname',
                password: '123456',
                passwordConfirmation: '123456'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError())
    })

    test('Should return 200 if valid data is provided', async() => {
        const {sut } = makeSut();
        
        const httpRequest = {
            body: {
                email: 'invalid_email@mail.com',
                name: 'anyname',
                password: '123456',
                passwordConfirmation: '123456'
            }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(httpResponse.statusCode).toBe(200)
        expect(httpResponse.body).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@mail.com',
            password: 'valid_password'
        })
    })
})
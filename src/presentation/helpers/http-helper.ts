import { MissingParamError } from "../errors/missing-param-error";
import { HttpResponse } from "../protocols/http";

export const badRequest = (error: Error): HttpResponse => ({
    body: error,
    statusCode: 400
})
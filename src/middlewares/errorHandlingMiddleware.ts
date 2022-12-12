import { ErrorRequestHandler } from "express";
import httpStatus from "http-status";

interface Error {
  type: string;
  message: string | string[];
}

//422
export function unprocessableError(error: string[]): Error {
  return { type: "error_unprocessable_entity", message: error };
}

//401
export function missingHeaderError(header: string): Error {
  return {
    type: "error_unauthorized",
    message: header,
  };
}

//404
export function notFoundError(value: string): Error {
  return {
    type: "error_not_found",
    message: `Could not find specified ${value}`,
  };
}

//409
export function conflictError(value: string): Error {
  return {
    type: "error_conflict",
    message: `${value} already exists`,
  };
}

//403
export function accessDeniedError(value: string): Error {
  return {
    type: "error_access_denied",
    message: `Unable to ${value}`,
  };
}

//401
export function unauthorizedError(value: string): Error {
  return {
    type: "error_unauthorized",
    message: `${value} is invalid`,
  };
}

//400
export function badRequestError(value: string): Error {
  return {
    type: "error_bad_request",
    message: `${value}`,
  };
} 
//406
export function notAcceptableError(value: string): Error {
  return {
    type: "error_not_acceptable",
    message: `${value}`,
  };
}

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.type === "error_unprocessable_entity") {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(err.message);
  }

  if (err.type === "error_unauthorized") {
    return res.status(httpStatus.UNAUTHORIZED).send(err.message);
  }

  if (err.type === "error_not_found") {
    return res.status(httpStatus.NOT_FOUND).send(err.message);
  }

  if (err.type === "error_conflict") {
    return res.status(httpStatus.CONFLICT).send(err.message);
  }

  if (err.type === "error_access_denied") {
    return res.status(httpStatus.FORBIDDEN).send(err.message);
  }
  if (err.type === "error_bad_request") {
    return res.status(httpStatus.BAD_REQUEST).send(err.message);
  }
  if (err.type === "error_not_acceptable") {
    return res.status(httpStatus.NOT_ACCEPTABLE).send(err.message);
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message);
};

export default errorHandler;

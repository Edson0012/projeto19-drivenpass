export type SignInParams = {
    email: string,
    password: string
}

export type Body = {
    name: string,
    password: string
}

export type SignUpParams = Pick<SignInParams, "email" | "password">

export type ApplicationError = {
    name: string;
    message: string;
  };
export type SignInParams = {
    email: string,
    password: string
}

export type IdParams = {
    id: number
}

export type SignUpParams = Pick<SignInParams, "email" | "password">

export type ApplicationError = {
    name: string;
    message: string;
  };
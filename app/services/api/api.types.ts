import { ApiOkResponse } from "apisauce"
import { GeneralApiProblem } from "./api-problem"

export interface IUser {
    UserID: string;
    AccessToken: string;
    FirstName?: string | null,
    LastName?: string | null;
    FullName?: string | null;
    EmailAddress?: string | null;
    UserName?: string | null,
    Password?: string | null,
    LevelID?: string | null,
    CompanyID?: string | null,
    CompanyName?: string | null,
    LevelName?: string | null
}

export type GetUsersResult = { kind: "ok"; users: IUser[] } | GeneralApiProblem;
export type GetUserResult = { kind: "ok"; user: IUser } | GeneralApiProblem;

export type GeneralResponse<T = any> = ApiOkResponse<T> & {
    kind: 'ok',
    data: T
};

export interface ILoginPayload {
    UserName: string,
    Password: string
}
export interface ILoginResponse {
    UserID: string;
    AccessToken: string;
    FirstName?: string | null,
    LastName?: string | null;
    FullName?: string | null;
    EmailAddress?: string | null;
    UserName?: string | null,
    Password?: string | null,
    LevelID?: string | null,
    CompanyID?: string | null,
    CompanyName?: string | null,
    LevelName?: string | null
}

export interface IDashboardFetchPayload {
    UserID: string,
    AccessToken: string
}
export interface IObservationFetchPayload {
    UserID: string,
    AccessToken: string,
    LevelID: string,
    PageNumber: string
}


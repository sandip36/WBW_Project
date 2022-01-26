import { ApiOkResponse } from "apisauce"
import { IImages } from "models";
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
export interface IAuditHistoryFetchPayload {
    UserID: string,
    AccessToken: string,
    CustomFormID: string,
    AuditAndInspectionTemplateID: string,
    PageNumber: string
}
export interface IFetchDataForStartInspectionPayload {
    UserID: string,
    AccessToken: string,
    CustomFormID: string,
    AuditAndInspectionTemplateID: string
}
export interface IFetchEditInspectionDetailsPayload {
    UserID: string,
    AccessToken: string,
    CustomFormID: string,
    AuditAndInspectionTemplateID: string,
    AuditAndInspectionId: string,
    CompanyID: string
}
export interface IFetchTaskPayload {
    UserID: string,
    AccessToken: string,
    AuditAndInspectionID: string,
    AttributeID: string,
    CustomFormResultID: string
}
export interface ICompleteTaskPayload {
    UserID: string,
    AccessToken: string,
    AuditAndInspectionID: string,
    TaskTitle: string,
    Comments: string,
    AttributeID: string,
    HazardsID: string, 
    CustomFormResultID: string
}
export interface IImageUploadPayload {
    image: IImages,
    url: string
}
export interface IFetchTaskRatingDetailsPayload {
    UserID: string,
    AccessToken: string,
    LevelID: string
}
export interface IFetchRiskRatingPayload {
    UserID: string,
    AccessToken: string,
    AuditAndInspectionID: string,
    SeverityRateValue: string,
    ProbabilityRateValue: string
}


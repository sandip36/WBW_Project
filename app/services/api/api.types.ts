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
export interface IDeleteTask {
    UserID: string,
    AccessToken: string,
    AuditAndInspectionTaskID: string,
    CustomFormResultID: string
}
export interface IUpdateHazard {
    UserID: string,
    AccessToken: string,
    HazardsID: string,
    CustomFormResultID: string
}
export interface ISubmitStartInspectionPayload {
    UserID: string,
    AccessToken: string,
    CustomFormID: string,
    AuditAndInspectionTemplateID: string,
    TypeID: string,
    PrimaryUserID: string,
    Type: string,
    CompanyID: string
}
export interface IAnyAuditInProcessPayload {
    UserID: string,
    AccessToken: string,
    AuditAndInspectionTemplateID: string,
    TypeID: string,
    PrimaryUserID: string,
    Type: string,
}
export interface IDeleteInspectionRecord {
    UserID: string,
    AccessToken: string,
    AuditAndInspectionID: string
}
export interface IAssignTaskPayload {
    UserID: string,
    AccessToken: string,
    AuditAndInspectionID: string,
    TaskTitle: string,
    Description: string,
    AttributeID: string,
    AssignedToUserID: string,
    DueDate: string,
    SeverityRating: string,
    ProbabilityRating: string,
    RiskRating: string,
    HazardsID: string,
    CustomFormResultID: string
}

export interface ISaveAuditPayload {
    UserID: string,
    PrimaryUserID: string,
    AccessToken: string,
    AuditAndInspectionID: string,
    Type: string,
    TypeID: string,
    Notes: string,
    ReportingPeriodDueDateSelected: string,
    NextDueDate: string,
    SkippedReason: string,
    SystemFields: {
        // eslint-disable-next-line camelcase
        AuditAndInspection_SystemFieldID: string,
        SystemFields: any[]
    },
    GroupsAndAttributes: {
        Groups: any[]
    }
}

// Added payload for commanallfilters
export interface IAllCommanFilterPayload{
    UserID:string,
    AccessToken: string,
    CompanyID:string,
    ObservationSettingID:string
}
// Added payload for commanallfilters
export interface ISubmitObservation {
    UserID: string,
    AccessToken: string,
    LevelID: string,
    ObservationSettingID: string,
    SectionID: string,
    TopicID: string,
    ActOrConditionID: string,
    ActOrCondition: string,
    HazardID: string,
    Observation: string,
    IsFollowUpNeeded: string,
    ObservationDate: string,
    ObservationTime: string,	
    DescribeWhereTheIncidentHappened: string
}

export interface IDeleteAttributeImages {
    UserID:string,
    AccessToken: string,
    // eslint-disable-next-line camelcase
    CustomForm_Attribute_Instance_ImageID: string
}


// Added payload for edit Observation
export interface IEditObervationPayload{
    UserID:string,
    AccessToken:string,
    ObservationGUID:string
}
// payload for getting media related data
export interface IMediaPayload {
    UserID: string,
    AccessToken: string,
    PageNumber: string
}


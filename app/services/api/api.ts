import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { AxiosRequestConfig } from "axios"
import { CreateQueryParams } from '@nestjsx/crud-request'
import { GeneralResponse, IAllCommanFilterPayload, IAuditHistoryFetchPayload, IDashboardFetchPayload, IFetchDataForStartInspectionPayload, IFetchTaskPayload, ILoginPayload, ILoginResponse, IObservationFetchPayload } from "./api.types"
import { IAssignTaskPayload, ICompleteTaskPayload, IDeleteInspectionRecord, IDeleteTask, IFetchEditInspectionDetailsPayload, IFetchRiskRatingPayload, IFetchTaskRatingDetailsPayload, ISaveAuditPayload, ISubmitStartInspectionPayload, IUpdateHazard } from "."
import { IImages } from "models/models/audit-model/groups-and-attributes.model"
import { AsyncStorage } from "utils/storage/async-storage"
import { conformsTo } from "lodash"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor ( config: ApiConfig = DEFAULT_API_CONFIG ) {
      this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup () {
      // construct the apisauce instance
      this.apisauce = create( {
          baseURL: this.config.url,
          timeout: this.config.timeout,
          headers: {
              Accept: "application/json",
          },
      } )
  }

  token: any

  setToken ( token ) {
      this.token = token
      if ( token === undefined || token === null ) {
          this.apisauce.deleteHeader( 'Authorization' )
      } else {
          this.apisauce.setHeader( 'Authorization', `Bearer ${this.token}` )
      }
  }

  async setBaseUrl ( url?: any ) {
      if ( url === undefined || url === null || url === "" ) {
          this.apisauce.setBaseURL( this.config.url )
      } else {
          this.apisauce.setBaseURL( url )
      }
  }

  async get ( url: string, params?: CreateQueryParams, config?: AxiosRequestConfig ) {
      const response: ApiResponse<any> = await this.apisauce.get( url, params, config )

      if ( !response.ok ) {
          throw getGeneralApiProblem( response )
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async login ( payload: ILoginPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/User/UserLogin", payload )

      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async fetchDashboard ( payload: IDashboardFetchPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/Dashboard/GetDashboardLink", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  // started add obervation maodule
  async fetchAllCommanfilter ( payload:IAllCommanFilterPayload ){
      const response: ApiResponse<IAllCommanFilterPayload>= await this.apisauce.post( "/Common/GetAllFilters",payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }
      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse

  }


  async fetchObservations ( payload: IObservationFetchPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/Observation/GetObservationHistory_WithPaging", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async fetchAuditHistory ( payload: IAuditHistoryFetchPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/GetHistory", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async fetchDataForStartInspection ( payload: IFetchDataForStartInspectionPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/GetTypes", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async submitDataForStartInspection ( payload: ISubmitStartInspectionPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/StartAudit", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async fetchDataForEditInspection ( payload: IFetchEditInspectionDetailsPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/GetAuditDetails", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async fetchTasks ( payload: IFetchTaskPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/GetTask", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async completeTask ( payload: ICompleteTaskPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/CompleteTask", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async imageUpload ( payload: any, userId?: string, auditAndInspectionId?: string, auditAndInspectionTaskId?: string ) {
      const finalUploadUrl = `/AuditAndInspection/UploadCompleteImage?UserID=${userId}&AuditAndInspectionID=${auditAndInspectionId}&AuditAndInspectionTaskID=${auditAndInspectionTaskId}`
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( finalUploadUrl, payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async fetchTaskRatingFilters ( payload: IFetchTaskRatingDetailsPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/Common/GetTaskRatingFilters", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async fetchRiskRating ( payload: IFetchRiskRatingPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/GetRiskRatingAndDueDate", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async deleteTask ( payload: IDeleteTask ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/DeleteTask", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async updateHazard ( payload: IUpdateHazard ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/UpdateHazard", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async deleteInspection ( payload: IDeleteInspectionRecord ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/DeleteAuditAndInspection", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async assignTask ( payload: IAssignTaskPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/AssignTask", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async saveAuditAndInspection ( payload: ISaveAuditPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/SaveAudit", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async completeAuditAndInspection ( payload: ISaveAuditPayload ) {
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( "/AuditAndInspection/CompleteAudit", payload )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  async uploadImages ( payload: any, userId: string, auditAndInspectionId: string ) {
      const finalUploadUrl = `/AuditAndInspection/UploadAttributesInstanceImage?UserID=${userId}&AuditAndInspectionID=${auditAndInspectionId}`
      //   const finalUploadUrl = `/AuditAndInspection/UploadAttributesInstanceImage?UserID=${userId}`
      const response: ApiResponse<ILoginResponse> = await this.apisauce.post( finalUploadUrl, payload, {
          "headers": {
              'Content-Type': 'multipart-formdata'
          }
      } )
      if ( !response.ok ) {
          const problem = getGeneralApiProblem( response )
          if ( problem ) throw problem
      }

      return {
          kind: 'ok',
          data: response.data
      } as GeneralResponse
  }

  


}

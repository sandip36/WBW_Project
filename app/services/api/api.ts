import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { AxiosRequestConfig } from "axios"
import { CreateQueryParams } from '@nestjsx/crud-request'
import { GeneralResponse, IAuditHistoryFetchPayload, IDashboardFetchPayload, IFetchDataForStartInspectionPayload, IFetchTaskPayload, ILoginPayload, ILoginResponse, IObservationFetchPayload } from "./api.types"
import { ICompleteTaskPayload, IFetchEditInspectionDetailsPayload, IFetchRiskRatingPayload, IFetchTaskRatingDetailsPayload } from "."

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

  


}

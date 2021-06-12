import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { AxiosRequestConfig } from "axios"
import { CreateQueryParams } from '@nestjsx/crud-request'
import { GeneralResponse, IDashboardFetchPayload, ILoginPayload, ILoginResponse, IObservationFetchPayload } from "./api.types"

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


}

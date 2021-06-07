import { ModelPropertiesDeclaration, types, addMiddleware, ModelActions } from 'mobx-state-tree'
import { atomic } from "mst-middlewares"
import { Environment } from '../environment'
import { withEnvironment } from '../environment/with-environment'
import { AbstractModelType } from './types'

export const createModel =
    <P extends ModelPropertiesDeclaration>( props?: P ): AbstractModelType<P, { environment: Environment }> =>
        types
            .model()
            .extend( withEnvironment )
            .props( { ...props } )
            .actions( self => {
                addMiddleware( self, atomic )
                return {} as ModelActions
            } )

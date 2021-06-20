import { addMiddleware, Instance, ModelPropertiesDeclaration, SnapshotIn, types } from "mobx-state-tree"
import { Environment } from '../environment'
import { withEnvironment } from '../environment/with-environment'
import { AbstractModelType, AbstractModelMapType } from './types'
import { atomic } from "mst-middlewares"

export const createModelMap =
    <M extends AbstractModelType<any, unknown>, P extends ModelPropertiesDeclaration>( Model: M, props?: P ):
    AbstractModelMapType<M, P, { environment: Environment }> => types
        .model( `${Model.name}Collection` )
        .extend( withEnvironment )
        .props( {
            items: types.map( Model ),
            ...props
        } )
        .actions( self => {
            addMiddleware( self, atomic )

            const _insertOrUpdate = ( items: SnapshotIn<M> | SnapshotIn<M>[] ) => {
                const toLoad = Array.isArray( items ) ? items : [ items ]

                const instances: Instance<M>[] = []

                toLoad.forEach( item => {
                    const existing = self.items.get( item.id )
                    const instance = self.items.put( { ...existing, ...item } )
                    instances.push( instance as Instance<M> )
                } )

                return instances
            }

            const _clear = ( ) => {
                self.items.clear()
            }
            return {
                _insertOrUpdate,
                _clear
            }
        } )

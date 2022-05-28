import { ModelPropertiesDeclaration, types, SnapshotIn, applySnapshot, SnapshotOut, destroy, Instance, addMiddleware, getSnapshot } from "mobx-state-tree"
import { atomic } from "mst-middlewares"
import { differenceWith } from "ramda"
import { Environment } from '../environment'
import { withEnvironment } from '../environment/with-environment'
import { AbstractModelType, AbstractModelCollectionType } from './types'

export const createModelCollection =
    <M extends AbstractModelType<any, unknown>, P extends ModelPropertiesDeclaration>( Model: M, props?: P ):
    AbstractModelCollectionType<M, P, { environment: Environment }> => types
        .model( `${Model.name}Collection` )
        .extend( withEnvironment )
        .props( {
            items: types.array( Model ),
            ...props
        } )
        .actions( self => {
            addMiddleware( self, atomic )

            const _insert = ( snapshots: SnapshotIn<M> | SnapshotIn<M>[] ) => {
                if ( !Array.isArray( snapshots ) ) {
                    snapshots = [ snapshots ]
                }
                const instances = []
                const existingItems = self.items.slice()
                const comparer = ( x, y ) => x.id === y.id
                const itemsToAdd = differenceWith( comparer, snapshots, existingItems )
                itemsToAdd.forEach( item => {
                    self.items.push( item )
                    instances.push( item )
                } )
                return instances
            }

            const _insertOrUpdate = ( snapshots: SnapshotIn<M> | SnapshotIn<M>[], pushToStart?: boolean, merge?: boolean ) => {
                if ( !Array.isArray( snapshots ) ) {
                    snapshots = [ snapshots ]
                }
                const instances = []
                // console.log( "snapshiots",JSON.stringify( snapshots ) )
                snapshots.forEach( item => {
                    const instance = self.items.find( s => s.id === item?.id )
                    if ( instance ) {
                        const mergedItem = { ...( merge ? getSnapshot( instance ) : {} ), ...item }
                        applySnapshot( instance, mergedItem )
                        instances.push( instance )
                    } else {
                        console.log( "items               ",JSON.stringify( item ) )

                        if ( pushToStart ) {
                            
                            self.items.unshift( item )

                        } else {
                            self.items.push( item )
                        }
                        const instanceIndex = pushToStart ? 0 : self.items.length - 1
                        instances.push( self.items[instanceIndex] )
                    }
                } )
                return instances
            }
            const _remove = ( id: string ) => {
                const item = self.items.find( ( sn: SnapshotOut<M> ) => sn.id === id )
                if ( item ) {
                    destroy( item )
                }
            }
            const _clear = ( ) => {
                self.items.clear()
            }

            const _sort = ( order: 'ASC' | 'DESC' = 'DESC' ) => {
                self.items.replace(
                    self.items.slice().sort( ( a, b ) => {
                        return order === 'ASC' ? a.createdAt.localeCompare( b.createdAt ) : b.createdAt.localeCompare( a.createdAt )
                    } )
                )
            }
            return {
                _insertOrUpdate,
                _insert,
                _remove,
                _clear,
                _sort
            }
        } )
        .views( self => ( {
            _get ( id: string| any ) {
                return self.items.find( item => item.id === id ) as Instance<M>
            }
        } ) )

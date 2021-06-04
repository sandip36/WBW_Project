/**
 * @file Types shared by the *.factory
 */

import {
    Instance,
    ModelPropertiesDeclaration,
    ModelPropertiesDeclarationToProperties,
    ISimpleType,
    IMaybeNull,
    IModelType,
    IAnyModelType,
    IArrayType,
    SnapshotIn,
    IMapType,
} from 'mobx-state-tree'

export type BaseModelPropertiesDeclarations<P extends ModelPropertiesDeclaration> =
    ModelPropertiesDeclarationToProperties<{
        id: ISimpleType<string>,
        createdAt?: IMaybeNull<ISimpleType<string>>
    } & P>

export type AbstractModelType<P extends ModelPropertiesDeclaration, OTHERS> = IModelType<BaseModelPropertiesDeclarations<P>, OTHERS>

export type AbstractModelCollectionProperties<M extends IAnyModelType, P extends ModelPropertiesDeclaration> =
    ModelPropertiesDeclarationToProperties<{
        items: IArrayType<M>
    } & P>

export type AbstractModelCollectionType<M extends IAnyModelType, P extends ModelPropertiesDeclaration, OTHERS> =
    IModelType<AbstractModelCollectionProperties<M, P>, {
        _insertOrUpdate ( snapshot: SnapshotIn<M> | SnapshotIn<M>[], pushToStart?: boolean, merge?: boolean ): Instance<M>[];
        _insert ( snapshot: SnapshotIn<M> | SnapshotIn<M>[] ): Instance<M>[];
        _remove ( id: string ): void;
        _clear ( ): void,
        _get ( id: string ): Instance<M>,
        _sort ( order?: 'ASC' | 'DESC' ): void
    } & OTHERS>

export type AbstractModelMapProperties<M extends IAnyModelType, P extends ModelPropertiesDeclaration> =
    ModelPropertiesDeclarationToProperties<{items: IMapType<M>} & P>

export type AbstractModelMapType<M extends IAnyModelType, P extends ModelPropertiesDeclaration, OTHERS> =
    IModelType<AbstractModelMapProperties<M, P>, {
        insertOrUpdate ( snapshot: SnapshotIn<M> | SnapshotIn<M>[] ): Instance<M>[]
    } & OTHERS>

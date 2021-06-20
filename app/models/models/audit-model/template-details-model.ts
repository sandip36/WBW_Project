import { types } from "mobx-state-tree";

export const TemplateDetailsModel = types.model( {
    Type: types.maybeNull( types.string ),
    Title: types.maybeNull( types.string )
} )
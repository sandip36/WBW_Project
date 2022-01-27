import { types } from "mobx-state-tree";

export const PrimaryUserListModel = types.model( {
    ID: types.maybeNull( types.string ),
    Name: types.maybeNull( types.string )
} )

export const ReportingPeriodDueDatesModal =types.model( {
    ID: types.maybeNull( types.string ),
    Value : types.maybeNull( types.string )
} )
import { Instance } from "mobx-state-tree"
import { UserModel } from "models/models/user-model/user-model"
import { createModelCollection } from '../../factories/model-collection.factory'


export const UserStore = createModelCollection( UserModel )

export type UserStoreType = Instance<typeof UserStore>
import { createContext } from 'react'

export interface RadioProviderProps<T = any > {
    value?: T,
    onChange?: ( value: T ) => void
}

export const RadioContext = createContext<RadioProviderProps>( {

} )

import React, { FC } from 'react'
import { RadioContext, RadioProviderProps } from './RadioProvider'

export const RadioGroup: FC<RadioProviderProps> = ( { onChange, value, children } ) =>
    <RadioContext.Provider value={{ onChange, value }}>
        {children}
    </RadioContext.Provider>

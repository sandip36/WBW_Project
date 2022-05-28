import { Box, Text } from "components"
import { CustomFormStore, UserStore, useStores } from "models"
import React, { useCallback, useEffect } from 'react'


export type CustomFormScreenProps = {

}

const CustomFormScreen:React.FunctionComponent<CustomFormScreenProps>=()=>{
    const { CustomFormStore } = useStores()

    useEffect( ( ) => {
        fetchdata()
    }, [ ] )

    const fetchdata = useCallback( async () => {
        await CustomFormStore.fetch()
       
    }, [] )


    return(
        <Box>
            <Text>hello </Text>
        </Box>
    )

}

export default CustomFormScreen
  

import { useNavigation } from "@react-navigation/native"
import { Box, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import { useStores } from "models"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator } from "react-native"

export type DynamicFormScreenProps = {

}

export const DynamicFormScreen: React.FunctionComponent<DynamicFormScreenProps> = ( ) => {
    const { DynamicFormStore } = useStores()
    const navigation = useNavigation()

    const fetchDashboard = useCallback( async () => {
        await DynamicFormStore.fetch()
    }, [] )

    return (
        <Box flex={1}>
            <Async promiseFn={fetchDashboard}>
                <Async.Pending>
                    { ( ) => (
                        <Box position="absolute" top={0} left={0} right={0} bottom={0} alignItems="center" justifyContent="center">
                            <ActivityIndicator size={32} color="red" />
                        </Box>
                    ) }
                </Async.Pending>
                <Async.Rejected>
                    { ( error: any ) => (
                        <Box justifyContent="center" alignItems="center" flex={1}>
                            <Text>{error.reason || error.message || 'Something went wrong'}</Text>
                        </Box>
                    ) }
                </Async.Rejected>
                <Async.Resolved>
                    <Box flex={1}>
                        <FormHeader 
                            title="Dynamic Form"
                            navigation={navigation}
                        />
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
}
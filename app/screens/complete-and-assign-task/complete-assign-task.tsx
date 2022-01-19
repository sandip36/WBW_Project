import { Box, Header, Radio, Text } from "components"
import { useStores } from "models"
import React from "react"

export type CompleteOrAssignTaskScreenProps = {

}

export const CompleteOrAssignTaskScreen: React.FC<CompleteOrAssignTaskScreenProps> = ( props ) => {
    const { AuditStore } = useStores()

    const onRadioPress = ( value ) => {
        //
    }

    return (
        <Box flex={1}>
            <Header 
                title="Complete or Assign Task"
            />
            <Box flex={1}>
                <Radio 
                    onPress={onRadioPress}
                />
            </Box>
        </Box>
    )
}
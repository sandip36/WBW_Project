import { Box, Icon, Text, TouchableBox } from "components"
import { IObservation, ObservationStore, useStores } from "models"
import React from "react"
import { isEmpty } from "lodash"
import { useNavigation } from "@react-navigation/native"
import { IEditObervationPayload } from "services/api/api.types"

export interface ObservationHistoryCardProps {
    observation: IObservation
}


const renderHistoryCardDetails = ( title: string, value: string ) => {
    return (
        <Box flex={1}>
            <Box flex={1} flexDirection="row" paddingLeft="regular">
                <Box flex={0.5}>
                    <Text variant="heading5" fontWeight="bold">{title}</Text>
                </Box>
                <Box flex={0.5}>
                    <Text variant="body" mx="small">{value}</Text>
                </Box>
            </Box>
            <Box flex={0.1} mb="medium" />
        </Box>
    )
}

export const ObservationHistoryCard: React.FunctionComponent<ObservationHistoryCardProps> = ( props ) => {
    const {
        observation
    } = props

    const navigation = useNavigation()
    const { AuthStore,ObservationStore } = useStores()

    const onEditObservation = async ( ) => {
        // await  ObservationStore.resetEditStore()
        const payload = {
            UserID:AuthStore?.user?.UserID,
            AccessToken:AuthStore?.token,
            ObservationGUID:observation?.ObservationGUID
        } as IEditObervationPayload
        await ObservationStore.editObservationApi( payload )
        navigation.navigate( "AddObservation" )
    }
    
    return (
        <Box flex={1} mx="regular" my="medium">
            <Box borderRadius="large" borderWidth={0.5} bg="lightGrey">
                <Box 
                    flex={1}
                    justifyContent="center" 
                    alignItems="center" 
                    borderTopLeftRadius="large"
                    borderTopRightRadius="large"
                    bg="primary"
                    flexDirection="row"
                >
                    <Box flex={0.7} padding="regular">
                        <Text variant="body" color="white">{observation?.ObservationNumber}</Text>
                    </Box>
                    <Box flex={0.3} alignItems="flex-end" mr={"regular"}>
                        <Text variant="body" color="white">{observation?.Status}</Text>
                    </Box>
                    <Box>
                        {
                            observation?.Status === "In Process"
                                ? <TouchableBox flex={0.1} justifyContent="center" mx="regular" alignItems="flex-end" onPress={onEditObservation}>
                                    <Icon size={32} name="edit" color="background" type="material" />
                                </TouchableBox>
                                : null
                        }
                    </Box>
                </Box>
                <Box my="medium">
                    {!isEmpty( observation.Observation ) && renderHistoryCardDetails( 'Observation: ', observation.Observation )}
                    {!isEmpty( observation.Location ) && renderHistoryCardDetails( 'Location: ', observation.Location )}
                    {!isEmpty( observation.ObservationDate ) && renderHistoryCardDetails( 'Observation Date: ', observation.ObservationDate )}
                    {!isEmpty( observation.ObservationTime ) && renderHistoryCardDetails( 'Observation Time: ', observation.ObservationTime )}
                    {!isEmpty( observation.IsFollowUpNeeded ) && renderHistoryCardDetails( 'Follow Up Needed: ', observation.IsFollowUpNeeded )}
                    {!isEmpty( observation.Section ) && renderHistoryCardDetails( 'Section: ', observation.Section )}
                    {!isEmpty( observation.Topic ) && renderHistoryCardDetails( 'Topic: ', observation.Topic )}
                    {!isEmpty( observation.Category ) && renderHistoryCardDetails( 'Act or Condition: ', observation.Category )}
                    {!isEmpty( observation.PreventiveHazard ) && renderHistoryCardDetails( 'Preventive Hazard: ', observation.PreventiveHazard )}
                    {!isEmpty( observation.Hazard ) && renderHistoryCardDetails( 'Hazard: ', observation.Hazard )}
                    {!isEmpty( observation.OutstandingTask ) && renderHistoryCardDetails( 'Outstanding Task: ', observation.OutstandingTask )} 
                </Box>
            </Box>
        </Box>
    )
}
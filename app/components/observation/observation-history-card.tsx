import { Box, Text } from "components"
import { IObservation } from "models"
import React from "react"
import { isEmpty } from "lodash"

export interface ObservationHistoryCardProps {
    observation: IObservation
}


const renderHistoryCardDetails = ( title: string, value: string ) => {
    return (
        <Box flex={1}>
            <Box flex={1} flexDirection="row" paddingLeft="regular">
                <Box flex={0.5}>
                    <Text variant="heading5" fontWeight="bold" color="white">{title}</Text>
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
    
    return (
        <Box flex={1} mx="regular" my="medium">
            <Box borderRadius="large" borderWidth={0.5} bg="lightGrey5">
                <Box 
                    flex={1}
                    justifyContent="center" 
                    alignItems="center" 
                    borderTopLeftRadius="large"
                    borderTopRightRadius="large"
                    bg="primary"
                    flexDirection="row"
                >
                    <Box flex={0.7} padding="large">
                        <Text variant="body" color="white">{observation?.ObservationNumber}</Text>
                    </Box>
                    <Box flex={0.3}>
                        <Text variant="body">{observation?.Status}</Text>
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
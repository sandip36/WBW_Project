import { Box, Icon, Text, TouchableBox } from "components"
import { AuditAndInspectionListingType } from "models/models/audit-model"
import React from "react"
import { isEmpty } from "lodash"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "models"

const renderAuditCardDetails = ( title: string, value: string ) => {
    return (
        <Box flex={1}>
            <Box flex={1} flexDirection="row" paddingLeft="large">
                <Box flex={0.6}>
                    <Text variant="body" fontWeight="bold">{title}</Text>
                </Box>
                <Box flex={0.4}>
                    <Text variant="body">{value}</Text>
                </Box>
            </Box>
            <Box mb="medium" flex={0.1} />
        </Box>
    )
}

export type AuditAndInspectionCardProps = {
    auditAndInspectionDetails: AuditAndInspectionListingType
}

export const AuditAndInspectionCard: React.FunctionComponent<AuditAndInspectionCardProps> = ( props ) => {
    const {
        auditAndInspectionDetails
    } = props
    const navigation = useNavigation()
    const { AuditStore } = useStores()


    const onEditInspection = async ( ) => {
        await AuditStore.setCurrentInspectionId( auditAndInspectionDetails?.AuditAndInspectionID )
        await AuditStore.resetPassingValueSelected()
        navigation.navigate( 'EditInspection' )
    }

    return (
        <Box flex={1} mx="regular" my="medium" bg="lightGrey">
            <Box 
                flex={1} 
                justifyContent="center" 
                alignItems="center"
                borderTopLeftRadius="large"
                borderTopRightRadius="large"
                flexDirection="row"
                bg="primary">
                <Box flex={0.6} padding="large">
                    <Text variant="body" fontWeight="bold" color="white">
                        {auditAndInspectionDetails?.RecordNumber}
                    </Text>
                </Box>
                <Box flex={0.3} justifyContent="center" mx="regular" alignItems="flex-end">
                    <Text variant="body" color="white">
                        {auditAndInspectionDetails?.Status}
                    </Text>
                </Box>
                {
                    auditAndInspectionDetails?.Status === "In Process"
                        ? <TouchableBox flex={0.1} justifyContent="center" mx="regular" alignItems="flex-end" onPress={onEditInspection}>
                            <Icon size={32} name="edit" color="background" type="material" />
                        </TouchableBox>
                        : null
                }
            </Box>
            <Box my="large">
                {!isEmpty( auditAndInspectionDetails.FullName ) && renderAuditCardDetails( 'Full Name: ', auditAndInspectionDetails.FullName )}
                {!isEmpty( auditAndInspectionDetails.LastDayOfSchedulePeriod ) && renderAuditCardDetails( 'Last Day Of Schedule Period: ', auditAndInspectionDetails.LastDayOfSchedulePeriod )}
                {!isEmpty( auditAndInspectionDetails.Tasks ) && renderAuditCardDetails( 'Task(s)?: ', auditAndInspectionDetails.Tasks )}
                {!isEmpty( auditAndInspectionDetails.IsOutstandingTaskRequired ) && renderAuditCardDetails( 'Outstanding Task(s)?: ', auditAndInspectionDetails.IsOutstandingTaskRequired )}
                {!isEmpty( auditAndInspectionDetails.AuditAndInspectionFor ) && renderAuditCardDetails( 'Audit And Inspection For: ', auditAndInspectionDetails.AuditAndInspectionFor )}
                {!isEmpty( auditAndInspectionDetails.Work_Site_Name_Value ) && renderAuditCardDetails( 'Work Site Name Value: ', auditAndInspectionDetails.Work_Site_Name_Value )}
            </Box>
        </Box>
    )
}
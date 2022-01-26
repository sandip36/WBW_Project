import { useNavigation } from "@react-navigation/native"
import { Box, Input, Text } from "components"
import { FormHeader } from "components/core/header/form-header"
import { useStores } from "models"
import React, { useCallback } from "react"
import { Async } from "react-async"
import { ActivityIndicator, FlatList, StyleProp, ViewStyle } from "react-native"
import { isEmpty } from "lodash"
import { IFetchEditInspectionDetailsPayload } from "services/api"
import { makeStyles } from "theme"
import { GroupsAndAttributes } from "components/inspection"
import { observer } from "mobx-react-lite"

export type EditInspectionScreenProps = {

}

const useStyles = makeStyles<{contentContainerStyle: StyleProp<ViewStyle>}>( ( theme ) => ( {
    contentContainerStyle: {
        paddingBottom: theme.spacing.large
    }
} ) )


export const EditInspectionScreen: React.FC<EditInspectionScreenProps> = observer( ( ) => {
    const navigation = useNavigation()      
    const { DashboardStore, AuditStore, AuthStore, TaskStore } = useStores()
    const STYLES = useStyles()
    const fetchEditInspectionDetails = useCallback( async () => {
        const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
        if( isEmpty( dashboard ) ) {
            return null
        }
        const payload = {
            UserID: AuthStore?.user.UserID,
            AccessToken: AuthStore?.token,
            CustomFormID: dashboard?.CustomFormID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
            AuditAndInspectionId: AuditStore?.currentInspectionId,
            CompanyID: AuthStore?.user?.CompanyID
        } as IFetchEditInspectionDetailsPayload
        await AuditStore.fetchDataForEditInspection( payload )
    }, [] )

    const renderItem = ( { item, index } )  => {
        switch( item.ControlType ) {
        case 'TextBox': {    
            return (
                <Input 
                    label={item.IsMandatory === "True" 
                        ? `${item.ControlLabel} *`
                        : `${item.ControlLabel}`
                    }
                    placeholder={item.ControlLabel}
                    value={item.SelectedValue}
                /> 
            )
            
        }
        case 'DropDownList': {
            return null
        }
        } 
    }

    const renderSystemFieldsData = ( ) => {
        return(
            <Box>
                <FlatList 
                    data={AuditStore.systemFieldsData}
                    renderItem={renderItem}
                    keyExtractor={( item ) => item.ControlID }
                    contentContainerStyle={STYLES.contentContainerStyle}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                />
            </Box>
        )
    }

    const ItemSeparatorComponent = ( ) => {
        return (
            <Box height={24} />
        )
    }

    return (
        <Box flex={1}>
            <Async promiseFn={fetchEditInspectionDetails} watch={TaskStore.completedTaskComments}>
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
                    <FormHeader 
                        title="Edit Inspection"
                        navigation={navigation}
                    />                        
                    <Box>
                        <FlatList 
                            data={AuditStore.dynamicFieldsData}
                            extraData={AuditStore.dynamicFieldsData}
                            nestedScrollEnabled
                            ListHeaderComponent={renderSystemFieldsData}
                            renderItem={( { item } ) => {
                                return (
                                    <Box flex={1}>
                                        <Box flex={1} marginHorizontal="regular" p="regular" borderRadius="medium" justifyContent="center" alignItems="center" backgroundColor="primary">
                                            <Text color="background" variant="heading5" fontWeight="bold">{item.GroupName}</Text>
                                        </Box>
                                        <Box flex={1}>
                                            <GroupsAndAttributes groupId={item.GroupID}/>
                                        </Box>
                                    </Box>
                                )
                            }}
                            keyExtractor={( item ) => item.GroupID }
                            contentContainerStyle={STYLES.contentContainerStyle}
                            ItemSeparatorComponent={ItemSeparatorComponent}
                        />
                    </Box>
                </Async.Resolved>
            </Async>
        </Box>
    )
} )
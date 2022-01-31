import { useNavigation } from "@react-navigation/native"
import { Box, Button, Input, Text, TextAreaInput } from "components"
import { FormHeader } from "components/core/header/form-header"
import { useStores } from "models"
import React, { useCallback, useState } from "react"
import { Async } from "react-async"
import { ActivityIndicator, FlatList, StyleProp, TextStyle, ViewStyle } from "react-native"
import { isEmpty } from "lodash"
import { IFetchEditInspectionDetailsPayload } from "services/api"
import { makeStyles, theme } from "theme"
import { GroupsAndAttributes } from "components/inspection"
import { Observer, observer, useObserver } from "mobx-react-lite"
import { AuditDetailsRow } from "components/audit-detail-row/audit-details-row"
import { Dropdown } from "components/core/dropdown"
import { CheckBox } from "react-native-elements"
import { ISystemFieldsInnerModel, SystemFieldsInnerModel } from "models/models/audit-model/system-fields-outer-model"

export type EditInspectionScreenProps = {

}

const useStyles = makeStyles<{contentContainerStyle: StyleProp<ViewStyle>, inputContainerStyle: StyleProp<ViewStyle>, checkboxTextStyle: StyleProp<TextStyle>, checkboxContainerStyle: StyleProp<ViewStyle>, skippedDataLabelStyle: StyleProp<TextStyle> }>( ( theme ) => ( {
    contentContainerStyle: {
        paddingBottom: theme.spacing.massive
    },
    inputContainerStyle: {
        marginVertical: -15
    },
    checkboxTextStyle: {
        fontSize: theme.textVariants.heading5?.fontSize,
        color: theme.colors.black,
        fontWeight: "bold",
    },
    checkboxContainerStyle: {
        padding: 0,
        backgroundColor: theme.colors.transparent,
        borderWidth: 0,
        marginLeft: 3
    },
    skippedDataLabelStyle: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        marginHorizontal: theme.spacing.medium
    }
} ) )


// TODO: skipped dropdown array.
/* TODO: system fields array may contain varios control type, need to show with different components 
        like dropdown,  calendar, checkbox, multi-select checkbox etc.
*/
export const EditInspectionScreen: React.FC<EditInspectionScreenProps> = observer( ( ) => {
    const navigation = useNavigation()      
    const { DashboardStore, AuditStore, AuthStore, TaskStore } = useStores()
    const STYLES = useStyles()
    const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
    const [ reportingPeriod, setReportingPeriod ] = useState( "" )
    if( isEmpty( dashboard ) ) {
        return null
    }
    const fetchEditInspectionDetails = useCallback( async () => {
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

    const renderItem = ( { item }: {item: ISystemFieldsInnerModel } )  => {
        switch( item.ControlType ) {
        case 'TextBox': {    
            return (
                <Box marginHorizontal="medium">
                    <Input 
                        label={item.IsMandatory === "True" 
                            ? `${item.ControlLabel} *`
                            : `${item.ControlLabel}`
                        }
                        placeholder={item.ControlLabel}
                        defaultValue={item.SelectedValue}                        
                        onChangeText={ ( text ) => item.setSelectedValue( text ) }
                        containerStyle={STYLES.inputContainerStyle}
                    /> 
                </Box>
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
                {
                    AuditStore.shouldDisplayWarningMessage
                        ? <Box flexDirection="row" alignItems="center" marginVertical="regular" marginHorizontal="regular">
                            <Text numberOfLines={0} color="primary" variant="heading4">
                                {
                                    AuditStore?.inspection?.AuditAndInspectionDetails?.AdhocWarnigMessage
                                }
                            </Text>
                        </Box>
                        : null
                }
                <Box mt="small">
                    <AuditDetailsRow 
                        title= "Record Number: " 
                        value={AuditStore?.inspection?.AuditAndInspectionDetails?.AuditAndInspectionNumber} 
                    />
                </Box>  
                <Box>
                    <Observer>
                        {
                            () => (
                                <Box>
                                    <CheckBox
                                        title="Select Passing Values for Incomplete Tasks:"
                                        checked={AuditStore.isPassingValuesSelected}
                                        onPress={AuditStore.togglePassingValueSelected}
                                        iconRight={true}
                                        textStyle={STYLES.checkboxTextStyle}
                                        containerStyle={STYLES.checkboxContainerStyle}
                                    />
                                </Box> 
                            ) 
                        }
                    </Observer>
                </Box>          
                <Box>
                    <AuditDetailsRow 
                        title= "Action Taken By: " 
                        value={AuthStore?.user?.FullName} 
                    />
                </Box>                       
                <Box mb="large">
                    <AuditDetailsRow 
                        title={`Select ${AuditStore?.audit?.TemplateDetails?.Type}: `}
                        value={AuditStore?.inspection?.AuditAndInspectionDetails?.TypeName} 
                    />
                </Box>
                <Box marginHorizontal="medium">
                    <TextAreaInput 
                        label="Notes"
                        labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize, marginLeft: theme.spacing.mini  }}
                        placeholder="Type Here"
                        defaultValue={AuditStore.inspection?.AuditAndInspectionDetails?.Notes}                       
                        onChangeText={ ( text ) => AuditStore.setInspectionNotes( text ) }
                    />
                </Box>
                {
                    isEmpty( AuditStore.inspection?.AuditAndInspectionDetails?.PrimaryUserList )
                        ? null
                        :  <Box>
                            <Dropdown
                                title="Inspection on behalf of *"
                                items={AuditStore.primaryUser}
                                value={AuditStore.inspection?.AuditAndInspectionDetails?.PrimaryUserID}
                                onValueChange={( value )=>AuditStore.setPrimaryUserId( value )}
                            /> 
                        </Box>
                }
                {
                    AuditStore.shouldShowReportingPeriod
                        ? <Box>
                            <Dropdown
                                title="Last Day of Schedule Period *"
                                items={AuditStore.reportingPeriodDueDates}
                                value={isEmpty( reportingPeriod ) ? AuditStore.initialReportingPeriodDueDateID : reportingPeriod }
                                onValueChange={( value ) => setReportingPeriod( value )}
                            /> 
                        </Box>
                        : null
                }
                {/* {
                    AuditStore.shouldShowSkippedData
                        ? <Box>
                            <Box>
                                <Text numberOfLines={0} style={STYLES.skippedDataLabelStyle}>
                                    {
                                        `By doing this, following period(s) will be skipped: ${AuditStore.skippedDueDateList}`
                                    }
                                </Text>
                            </Box>
                            <Box>
                                <TextAreaInput 
                                    label="Reason for Skipping the Last Day of Schedule Period *"
                                    labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize, marginLeft: theme.spacing.mini  }}
                                    placeholder="Type Here"
                                    defaultValue={AuditStore.inspection?.AuditAndInspectionDetails?.SkippedReason}                       
                                    onChangeText={ ( text ) => AuditStore.setSkippedReason( text ) }
                                />
                            </Box>
                        </Box>
                        : <Text>Other</Text>
                } */}
                <Box marginVertical="large" marginHorizontal="small" >
                    <FlatList 
                        data={AuditStore.systemFieldsData}
                        renderItem={renderItem}
                        keyExtractor={( item ) => item.ControlID }
                        contentContainerStyle={STYLES.contentContainerStyle}
                        ItemSeparatorComponent={ItemSeparatorComponent}
                    />
                </Box>
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
                        title={dashboard?.Category}
                        navigation={navigation}
                    />                        
                    <Box flex={1}>
                        <FlatList 
                            data={AuditStore.dynamicFieldsData}
                            nestedScrollEnabled
                            ListHeaderComponent={renderSystemFieldsData}
                            renderItem={( { item } ) => 
                                
                            {
                                console.log( 'called' )
                                return (
                                    <Box flex={0.85}>
                                        <Box flex={1} marginHorizontal="regular" p="regular" borderRadius="medium" justifyContent="center" alignItems="center" backgroundColor="primary">
                                            <Text color="background" variant="heading5" fontWeight="bold">{item.GroupName}</Text>
                                        </Box>
                                        <Box flex={0.9} mt="medium">
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
                    <Box flexDirection="row">
                        <Box width={AuditStore.shouldShowReportingPeriod ? "50%" : "100%"}>
                            <Button
                                title="Submit"
                            // onPress={handleSubmit}
                            />
                        </Box>
                        {
                            AuditStore.shouldShowReportingPeriod
                                ? <Box width="50%">
                                    <Button 
                                        title="Save And Come Back"
                                        // onPress={handleSubmit}
                                    />
                                </Box>
                                : null
                        }
                    </Box>

                </Async.Resolved>
            </Async>
        </Box>
    )
} )
import { useNavigation } from "@react-navigation/native"
import { Box, Button, Input, Text, TextAreaInput } from "components"
import { FormHeader } from "components/core/header/form-header"
import { IReportingPeriodDueDatesModel, useStores } from "models"
import React, { useCallback, useEffect, useState } from "react"
import { Async } from "react-async"
import { ActivityIndicator, Alert, BackHandler, FlatList, StyleProp, TextStyle, ViewStyle } from "react-native"
import { findIndex, isEmpty } from "lodash"
import { IDeleteInspectionRecord, IFetchEditInspectionDetailsPayload, ISaveAuditPayload } from "services/api"
import { makeStyles, theme } from "theme"
import { GroupsAndAttributes } from "components/inspection"
import { Observer, observer, useObserver } from "mobx-react-lite"
import { AuditDetailsRow } from "components/audit-detail-row/audit-details-row"
import { Dropdown } from "components/core/dropdown"
import { CheckBox } from "react-native-elements"
import { ISystemFieldsInnerModel, SystemFieldsInnerModel } from "models/models/audit-model/system-fields-outer-model"
import Toast from "react-native-simple-toast"


export type InspectionScreenProps = {

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
        fontSize: theme.textVariants?.caption?.fontSize,
        marginHorizontal: theme.spacing.large
    }
} ) )

/** TODO: checkbox implementation. 
 * 
 */
/* TODO: system fields array may contain varios control type, need to show with different components 
        like dropdown,  calendar, checkbox, multi-select checkbox etc.
*/
let remainingDropdownArray = []
export const InspectionScreen: React.FC<InspectionScreenProps> = observer( ( ) => {
    const navigation = useNavigation()      
    const { DashboardStore, AuditStore, AuthStore, TaskStore } = useStores()
    const STYLES = useStyles()
    const dashboard = DashboardStore._get( DashboardStore?.currentDashboardId )
    const [ reportingPeriod, setReportingPeriod ] = useState( "" )
    const [ isChecked, setIsChecked ] = useState( false )
    if( isEmpty( dashboard ) ) {
        return null
    }

    useEffect( ( ) => {
        resetChecked()
    }, [] )

    const resetChecked = async ( ) => {
        await AuditStore.resetPassingValueSelected()
    }

    useEffect( () => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            _handleBackPress
        );
        return () => backHandler.remove();
    }, [] )

    const _handleBackPress = ( ) => {
        // Works on both iOS and Android
        Alert.alert(
            "Discard changes?",
            "Are you sure you want to discard the changes?",
            [
                {
                    text: "No",
                    onPress: () => null
                },
                {
                    text: "Yes",
                    onPress: deleteInspectionRecord
                }
            ],
        );
        return true
    }

    const deleteInspectionRecord = async ( ) => {
        const payload = {
            UserID: AuthStore.user?.UserID,
            AccessToken: AuthStore.token,
            AuditAndInspectionID: AuditStore.inspection?.AuditAndInspectionDetails?.AuditAndInspectionID,
        } as IDeleteInspectionRecord
        await AuditStore.deleteInspectionRecord( payload )
        navigation.pop( 2 )
    }
   
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

    const onCheckBoxValueChange = async ( ) => {
        await AuditStore.togglePassingValueSelected()
        setIsChecked( !isChecked )
    }

    const onChangeReportingPeriod = ( value ) => {
        const data = [ ...AuditStore.inspection.AuditAndInspectionDetails.ReportingPeriodDueDates ]
        const reversedData = data.reverse()
        const currentSelectedIndex = findIndex( reversedData, function ( o ) { return o.ID === value } );
        remainingDropdownArray = []
        for( let i=0;i<currentSelectedIndex;i++ ) {
            remainingDropdownArray.push( reversedData[i].Value )
        }
        setReportingPeriod( value )   
    }

    const renderOtherData = ( ) => {
        return(
            <Box>
                <Box mt="small">
                    <AuditDetailsRow 
                        title= "Record Number: " 
                        value={AuditStore?.inspection?.AuditAndInspectionDetails?.AuditAndInspectionNumber} 
                    />
                </Box>  
                <Box>
                    <Box>
                        <CheckBox
                            title="Select Passing Values for Incomplete Tasks:"
                            checked={isChecked}
                            onPress={onCheckBoxValueChange}
                            iconRight={true}
                            textStyle={STYLES.checkboxTextStyle}
                            containerStyle={STYLES.checkboxContainerStyle}
                        />
                    </Box> 
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
                                value={reportingPeriod}
                                onValueChange={onChangeReportingPeriod}
                            /> 
                        </Box>
                        : null
                }
                {
                    remainingDropdownArray && remainingDropdownArray.length > 0 && AuditStore.inspection.AuditAndInspectionDetails?.ReportingPeriodDueDates != null
                        ? <Box>
                            <Text numberOfLines={0} style={STYLES.skippedDataLabelStyle}>
                                {
                                    `By doing this, following period(s) will be skipped: ${remainingDropdownArray}`
                                }
                            </Text>
                            
                            <Box mt="regular" marginHorizontal="medium">
                                <TextAreaInput 
                                    label="Reason for Skipping the Last Day of Schedule Period *"
                                    labelStyle={{ color: theme.colors.primary, fontSize: theme.textVariants.heading5?.fontSize, marginLeft: theme.spacing.mini  }}
                                    placeholder="Type Here"
                                    defaultValue={AuditStore.inspection?.AuditAndInspectionDetails?.SkippedReason}                       
                                    onChangeText={ ( text ) => AuditStore.setSkippedReason( text ) }
                                />
                            </Box>
                        </Box>
                        : null
                }
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

    const renderSystemFieldsData = ( ) => {
        if( AuditStore.shouldDisplayWarningMessage && !isEmpty( AuditStore?.inspection?.AuditAndInspectionDetails?.AdhocWarnigMessage ) ) {
            return (
                <Box>
                    <Box flexDirection="row" alignItems="center" marginVertical="regular" marginHorizontal="regular" bg="caribbeanGreenPearl">
                        <Text numberOfLines={0} color="primary" variant="heading4">
                            {
                                AuditStore?.inspection?.AuditAndInspectionDetails?.AdhocWarnigMessage
                            }
                        </Text>
                    </Box>
                    { renderOtherData() }
                </Box>
            )
        }else{
            return (
                renderOtherData()
            )
        }
        
    }

    const ItemSeparatorComponent = ( ) => {
        return (
            <Box height={24} />
        )
    }

    const checkForSkippedReason = ( ) => {
        let result = false
        if( remainingDropdownArray.length === 0 ) {
            result = true
        }
        else if( AuditStore.inspection.AuditAndInspectionDetails?.SkippedReason !== '' ) {
            result = true
        }else{
            result = false
        }
        return result
    }

    const saveAndComeBack = async ( ) => {
        const isValidReportingPeriod = AuditStore.shouldShowReportingPeriod === true && !isEmpty( reportingPeriod )
        if( !isValidReportingPeriod ) {
            Toast.showWithGravity( 'Last day of schedule period is required.', Toast.LONG, Toast.CENTER );
            return null 
        }

        const isValidSkippedReason = checkForSkippedReason()
        if( !isValidSkippedReason ) {
            Toast.showWithGravity( 'Reason for skipping the last day of schedule period is required.', Toast.LONG, Toast.CENTER );
            return null
        }

        const reportingPeriodDueDate = !isEmpty( AuditStore.inspection?.AuditAndInspectionDetails.ReportingPeriodDueDates ) ? AuditStore.inspection?.AuditAndInspectionDetails.ReportingPeriodDueDates.find( item => item.ID === reportingPeriod ) as IReportingPeriodDueDatesModel : {} as IReportingPeriodDueDatesModel
        const payload = {
            UserID: AuthStore.user?.UserID,
            PrimaryUserID: !isEmpty( AuditStore?.inspection?.AuditAndInspectionDetails?.PrimaryUserID ) ? AuditStore?.inspection?.AuditAndInspectionDetails?.PrimaryUserID : AuthStore.user.UserID,
            AccessToken: AuthStore.token,
            AuditAndInspectionID: AuditStore?.inspection?.AuditAndInspectionDetails?.AuditAndInspectionID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
            Type: AuditStore.audit?.TemplateDetails?.Type,
            TypeID: AuditStore.inspection.AuditAndInspectionDetails?.TypeID,
            Notes: AuditStore.inspection?.AuditAndInspectionDetails?.Notes,
            ReportingPeriodDueDateSelected: isEmpty( reportingPeriodDueDate ) ? null : reportingPeriodDueDate.Value as string,
            ReportingPeriodDueDateSelectedID: reportingPeriod,
            NextDueDate: AuditStore.inspection?.AuditAndInspectionDetails?.NextDueDate,
            SkippedReason: AuditStore.inspection?.AuditAndInspectionDetails?.SkippedReason,
            SystemFields: {
                AuditAndInspection_SystemFieldID: AuditStore?.inspection?.SystemFields?.AuditAndInspection_SystemFieldID,
                SystemFields: AuditStore.formattedSystemFieldsData
            },
            GroupsAndAttributes: {
                Groups: AuditStore.formattedGroupsData
            } 
        } as ISaveAuditPayload
        const response = await AuditStore.saveAuditAndInspection( payload )
        if( response === 'success' ) {
            await setTimeout( ( ) => {
                navigation.pop( 2 )
            }, 3000 )
        }
    }

    const onSubmit = async ( ) => {
        const isValidReportingPeriod = AuditStore.checkForValidReportingPeriod( reportingPeriod )
        if( !isValidReportingPeriod ) {
            Toast.showWithGravity( 'Last day of schedule period is required.', Toast.LONG, Toast.CENTER );
            return null 
        }

        if( AuditStore.inspection.AuditAndInspectionDetails?.PrimaryUserList && AuditStore.inspection.AuditAndInspectionDetails?.PrimaryUserList.length > 0 && isEmpty( AuditStore.inspection.AuditAndInspectionDetails?.PrimaryUserID ) ) {
            Toast.showWithGravity( 'Please select primary user list', Toast.LONG, Toast.CENTER );
            return null
        }

        const isValidSkippedReason = checkForSkippedReason()
        if( !isValidSkippedReason ) {
            Toast.showWithGravity( 'Reason for skipping the last day of schedule period is required.', Toast.LONG, Toast.CENTER );
            return null
        }

        const isValidDynamicFields = AuditStore.requiredSystemFieldsData
        if( !isValidDynamicFields ) {
            return null
        }

        const isValidScoresItem = AuditStore.requiredScoreData
        if( !isValidScoresItem ) {
            Toast.showWithGravity( 'Please select a score from the Score column', Toast.LONG, Toast.CENTER );
            return null 
        }

        const checkForHazards = AuditStore.requiredHazardData 
        if( !checkForHazards ) {
            Toast.showWithGravity( 'Hazard is required.', Toast.LONG, Toast.CENTER );
            return null 
        }

        const checkForComments = AuditStore.requiredCommentsData
        if( !checkForComments ) {
            Toast.showWithGravity( 'Comment(s) required.', Toast.LONG, Toast.CENTER );
            return null 
        }

        const reportingPeriodDueDate = !isEmpty( AuditStore.inspection?.AuditAndInspectionDetails.ReportingPeriodDueDates ) ? AuditStore.inspection?.AuditAndInspectionDetails.ReportingPeriodDueDates.find( item => item.ID === reportingPeriod ) as IReportingPeriodDueDatesModel : {} as IReportingPeriodDueDatesModel
        const payload = {
            UserID: AuthStore.user?.UserID,
            PrimaryUserID: !isEmpty( AuditStore?.inspection?.AuditAndInspectionDetails?.PrimaryUserID ) ? AuditStore?.inspection?.AuditAndInspectionDetails?.PrimaryUserID : AuthStore.user.UserID,
            AccessToken: AuthStore.token,
            AuditAndInspectionID: AuditStore?.inspection?.AuditAndInspectionDetails?.AuditAndInspectionID,
            AuditAndInspectionTemplateID: dashboard?.AuditandInspectionTemplateID,
            Type: AuditStore.audit?.TemplateDetails?.Type,
            TypeID: AuditStore.inspection.AuditAndInspectionDetails?.TypeID,
            Notes: AuditStore.inspection?.AuditAndInspectionDetails?.Notes,
            ReportingPeriodDueDateSelected: isEmpty( reportingPeriodDueDate ) ? null : reportingPeriodDueDate.Value as string,
            ReportingPeriodDueDateSelectedID: reportingPeriod,
            NextDueDate: AuditStore.inspection?.AuditAndInspectionDetails?.NextDueDate,
            SkippedReason: AuditStore.inspection?.AuditAndInspectionDetails?.SkippedReason,
            SystemFields: {
                AuditAndInspection_SystemFieldID: AuditStore?.inspection?.SystemFields?.AuditAndInspection_SystemFieldID,
                SystemFields: AuditStore.formattedSystemFieldsData
            },
            GroupsAndAttributes: {
                Groups: AuditStore.formattedGroupsData
            } 
        } as ISaveAuditPayload
        const response = await AuditStore.completeAuditAndInspection( payload )
        // const response = await AuditStore.saveAuditAndInspection( payload )
        if( response === 'success' ) {
            await setTimeout( ( ) => {
                navigation.pop( 2 )
            }, 3000 )
        }
    }


    return (
        <Box flex={1}>
            <FormHeader 
                title={dashboard?.Category}
                navigation={navigation}
                customBackHandler={_handleBackPress}
            />                        
            <Box flex={1}>
                <FlatList 
                    data={AuditStore.dynamicFieldsData}
                    nestedScrollEnabled
                    ListHeaderComponent={renderSystemFieldsData}
                    renderItem={( { item } ) => 
                                
                    {
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
                        onPress={onSubmit}
                    />
                </Box>
                {
                    AuditStore.shouldShowReportingPeriod
                        ? <Box width="50%">
                            <Button 
                                title="Save"
                                onPress={saveAndComeBack}
                            />
                        </Box>
                        : null
                }
            </Box>
        </Box>
    )
} )
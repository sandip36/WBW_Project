import { Box, TouchableBox } from 'components'
import { IUserList } from 'models/models/task-model/user-list-model'
import React, { useState } from 'react'
import { FlatList, ListRenderItem, Modal, StyleProp, ViewStyle } from 'react-native'
import { Avatar, Divider, ListItem, SearchBar } from 'react-native-elements'
import { makeStyles  } from 'theme'

export interface SearchableListProps {
    data: any[],
    customRender?: ListRenderItem<any>,
    isModalVisible?: boolean,
    closeModal?: ( ) => void,
    onUserSelect?: ( item ) => void,
    searchKey?: string,
    key?: string
}

export type SearchableInputStyleProps = {
    containerStyle: StyleProp<ViewStyle>,
    listItemContainerStyle: StyleProp<ViewStyle>,
    iconContainerStyle: StyleProp<ViewStyle>,
    searchBarContainerStyle: StyleProp<ViewStyle>
}

const useStyles = makeStyles<SearchableInputStyleProps>( ( theme ) => ( {
    containerStyle: {
        flex: 1
    },
    listItemContainerStyle: {
        flex: 0.1
    },
    iconContainerStyle: {
        backgroundColor: theme.colors.primary
    },
    searchBarContainerStyle: {
        backgroundColor: theme.colors.primary,
        margin: 0,
        padding: 10,
        borderBottomColor: theme.colors.transparent,
        borderTopColor: theme.colors.transparent
    }
} ) )

export const SearchableList: React.FunctionComponent<SearchableListProps> = ( props ) => {
    const {
        data,
        customRender,
        isModalVisible,
        closeModal,
        onUserSelect,
        searchKey,
        key
    } = props

    const [ actualUserList, setActualUserList ] = useState<IUserList[]>( data )
    const [ filteredUserList, setFilteredUserList ] = useState<IUserList[]>( [] )
    const [ searchedValue, setSearchedValue ] = useState<string>( '' )
    const STYLES = useStyles()

    const defaultRender = ( { item }: { item: IUserList } ) => {
        return (
            <TouchableBox onPress={()=>onUserSelect( item )}>
                <ListItem containerStyle={STYLES.listItemContainerStyle}>
                    <Avatar 
                        rounded size={32} 
                        icon={{ name: 'user', type: 'font-awesome' }} 
                        containerStyle={STYLES.iconContainerStyle} 
                    />
                    <ListItem.Content>
                        <ListItem.Title>{item.FullName}</ListItem.Title>
                        <ListItem.Subtitle>{item.LevelName}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            </TouchableBox>
        )
    }

    const renderItem = customRender || defaultRender

    const searchFilterFunction = ( text ) => {
        // Check if searched text is not blank
        if ( text ) {
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = actualUserList.filter(
                function ( item ) {
                    // Applying filter for the inserted text in search bar
                    const searchOnKey = item?.FullName || item[searchKey]
                    const itemData = searchOnKey
                        ? searchOnKey.toUpperCase()
                        : ''.toUpperCase();
                    const textData = text.toUpperCase();
                    return itemData.indexOf( textData ) > -1;
                }
            );
            setFilteredUserList( newData );
            setSearchedValue( text );
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredUserList( [] );
            setSearchedValue( text );
        }
    };

    return (
        <Modal
            visible={isModalVisible}
            onRequestClose={closeModal}
            style={STYLES.containerStyle}
        >
            <Box>
                <SearchBar
                    placeholder="Type Here..."
                    platform='default'
                    containerStyle={STYLES.searchBarContainerStyle}
                    value={searchedValue}
                    onChangeText={searchFilterFunction}
                />
            </Box>
            <Box flex={1} mt="medium">
                <FlatList 
                    data={filteredUserList.length === 0 ? actualUserList : filteredUserList }
                    renderItem={renderItem}
                    keyExtractor={ ( item, index ) => item?.UserID || item[key] || String( index ) }
                />
            </Box>
        </Modal>
    )
}
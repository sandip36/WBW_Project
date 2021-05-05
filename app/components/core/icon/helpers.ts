import FeatherIcon from "react-native-vector-icons/Feather"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import { IconType } from "./IconTypes"

export const getIconType = ( type: IconType ) => {
    switch ( type ) {
        case 'feather':
            return FeatherIcon
        case 'material':
            return MaterialIcon
        case 'fontawesome':
            return FontAwesome5
        case 'fontawesome5':
            return FontAwesome5
        default:
            return FeatherIcon
    }
}

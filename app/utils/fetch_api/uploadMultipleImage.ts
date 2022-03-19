import { API_URL } from "@env"
import Toast from "react-native-simple-toast"

function createFormDataForAll ( media ) {
    const data = new FormData()
    if ( media && media.length > 0 ) {
        media.map( item => {
            const localUri = item.uri
            const filename = localUri.split( "/" ).pop()
            data.append( filename, {
                name: filename,
                uri: localUri,
                type: item.mime || item.type || "image/jpeg",
            } )
            return media
        } )
    }

    return data
}

const uploadAllImages = async ( props ) => {
    const { images, url } = props
    const formdata = createFormDataForAll( images )
    const requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow',
        headers: {
            Accept: "application/json",
        },
    };
    const result = await fetch( url, requestOptions )
        .then( ( response ) => {
            return response.text()
        } )
        .then( ( res ) => {
            const parsedJson = JSON.parse( res )
            Toast.showWithGravity( parsedJson?.Message || 'File Saved Successfully', Toast.LONG, Toast.CENTER );
            return parsedJson;
        } )
        .catch( error => {
            Toast.showWithGravity( error.message || 'Error while submitting multiple images', Toast.LONG, Toast.CENTER );
            return null;
        } )
    return result;
}

export {
    uploadAllImages
}
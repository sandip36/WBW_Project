import { API_URL } from "@env"
import Toast from "react-native-simple-toast"


function createFormData ( media ) {
    const data = new FormData()
    if ( media ) {
        const localUri = media.uri
        const filename = localUri.split( "/" ).pop()
        data.append( "file", {
            name: filename,
            uri: localUri,
            type: media.type || media.mime || "image/jpeg",
        } )
    }

    return data
}

const imageUpload = async ( props ) => {
    const { image, url } = props
    const formdata = createFormData( image )
    console.log( 'formdata is ',JSON.stringify( formdata ) )
    const requestOptions = {
        method: 'POST',
        body: formdata,
        headers: {
            'Content-Type': 'multipart/form-data',
            Accept: "application/json",
        },
        redirect: 'follow'
    };
    
    console.log( 'url is ',JSON.stringify( url ) )
    const result = await fetch( url, requestOptions )
        .then( ( response ) => {
            console.log( 'response in first then',response )
            return response.text()
        } )
        .then( ( res ) => {
            console.log( 'response in second then ',JSON.stringify( res ) )
            const stringifiedJson = JSON.stringify( res )
            const parsedJson = JSON.parse( stringifiedJson )
            Toast.showWithGravity( result?.Message || 'File Saved Successfully', Toast.LONG, Toast.CENTER );
            return parsedJson;
        } )
        .catch( error => {
            Toast.showWithGravity( error?.message || 'Something went wrong', Toast.LONG, Toast.CENTER );
            return null;
        } )
    return result;
}

export {
    imageUpload
}

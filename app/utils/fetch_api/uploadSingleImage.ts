import Toast from "react-native-simple-toast"


function createFormData ( media ) {
    const data = new FormData()
    if ( media ) {
        const localUri = media.uri
        const filename = localUri.split( "/" ).pop()
        data.append( media?.name?.replace( ".pdf", '' )||"file", {
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
    const requestOptions = {
        method: 'POST',
        body: formdata,
        headers: {
            'Content-Type': 'multipart/form-data',
            Accept: "application/json",
        },
        redirect: 'follow'
    };
    const result = await fetch( url, requestOptions )
        .then( ( response ) => {
            return response.text()
        } )
        .then( ( res ) => {
            const parsedJson = JSON.parse( res )
            Toast.showWithGravity( parsedJson?.Message, Toast.LONG, Toast.CENTER );
            return res;
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

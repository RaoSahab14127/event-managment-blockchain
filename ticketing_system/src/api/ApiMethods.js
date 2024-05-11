import { AppConstants } from "../../helpers/AppConstants";

export const UploadFileApi = async (x) => {
    
 const requestOptions = {
        method: 'POST',
        body: new URLSearchParams({
            'event_id':x.event_id,    
            'des':x.des,
            'title':x.title,    
            'image_url': x.image_url,
 
        })
    };
    
    const response = await fetch(`http://localhost:8800/api/uploads`, requestOptions);
    return await response.json("done");
    
}
export const getFileApi = async (fileId) => {
    const requestOptions = {
        method: 'GET',
    };

    return fetch(`http://localhost:8800/api/uploads/${fileId}`, requestOptions)
        .then(response => response.json())
}
export const EditFileApi = async (fileId) => {
    
    const requestOptions = {
           method: 'PUT',
           body: new URLSearchParams({ 
               'des':fileId.des,
               'title':fileId.title,    
               'image_url': fileId.image_url,
    
           })
       };
       
       const response = await fetch(`http://localhost:8800/api/uploads/${fileId.event_id}`, requestOptions);
       return await response.json("put api is working");
       
   }
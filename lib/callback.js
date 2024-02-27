import axios from "axios";

const requestState = async (url, callback) => {
    const localdata = JSON.parse(localStorage.getItem(url))
    if(localdata != null){
        callback(localdata)
    }
    await axios.get(url).then(res=>{
        if(res.status==200){
            if(typeof callback == 'function'){
                callback(res.data)
            }
            localStorage.setItem(url, JSON.stringify(res.data))
            return res.data;
        }
    })
  }

export { requestState }
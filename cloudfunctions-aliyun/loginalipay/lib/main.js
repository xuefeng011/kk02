var aliplayApi= require("./app")

aliplayApi.accToken({code:"xxxx"}).then(res=>{
    console.log("succ",res)
}).catch(e=>{
    console.log("error",e)
})

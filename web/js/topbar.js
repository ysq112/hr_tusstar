// 注销功能
function logOut () {
  axios
    .put("/logOut")
    .then(function (response){
      location.reload()
    })
    .catch(function (error) {
      console.log(error.message)
    })
}

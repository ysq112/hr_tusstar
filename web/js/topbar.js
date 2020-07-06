// 注销功能
function logOut () {
  axios
    .put("/logOut")
    .then(function (response){
      window.location.href="index.html"
    })
    .catch(function (error) {
      console.log(error.message)
    })
}

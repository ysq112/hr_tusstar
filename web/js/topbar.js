// 注销功能
function logOut ()
{
  var zhuxiao=confirm("确定注销吗？")
  if(zhuxiao==true)
  {
    axios
        .put("/logOut")
        .then(function (response)
        {
          window.location.href="index.html"
        })
        .catch(function (error) {
          console.log(error.message)
        })
  }
}

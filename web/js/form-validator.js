function checkLength(value, minlength, maxlength = null) {
  len = value.toString().length
  if (len >= minlength) {
    if (maxlength !== null) {
      if (len <= maxlength) {
        return ''
      }
      else {
        return '长度不符合要求,要求输入' + minlength + '至' + maxlength + '个字符.'
      }
    }
    else {
      return ''
    }
  }
  else {
    return '至少输入' + minlength + '个字符.'
  }
}

function checkUserName(value,params) {
  // 用户名可以包含字母、数字、下划线
  var re = /^\w*$/
  if (value === '') {
    return '用户名不能为空'
  }
  else {
    // 使用正则表达式判断值是否合法
    if (re.test(value)) {
      // 判断长度是否合法
      return checkLength(value,params.minlength)
    }
    else {
      // 不合法
      return '用户名格式不符合要求,只能包含字母、数字、下划线'
    }
  }
}

function checkAllNumber(value,params) {
  // 要求全为数字
  var re = /^[0-9]*$/
  if (value === '') {
    return '长度不能为空'
  }
  else {
    // 使用正则表达式判断值是否合法
    if (re.test(value)) {
      // 判断长度是否合法
      return checkLength(value,params.minlength)
    }
    else {
      // 不合法
      return '包含非数字字符'
    }
  }
}

function checkChinese(value,params) {
  // 全为中文字符
  var re = /^[\u4e00-\u9fa5]*$/
  if (value === '') {
    return '长度不能为空'
  }
  else {
    // 使用正则表达式判断值是否合法
    if (re.test(value)) {
      // 判断长度是否合法
      return checkLength(value,params.minlength)
    }
    else {
      // 不合法
      return '包含非中文字符'
    }
  }
}

function checkEmail(value) {
  // 邮箱格式
  var re = /^[a-z0-9][\w\.\-]*@[a-z0-9\-]+(\.[a-z]{2,5}){1,2}$/
  if (value === '') {
    return '长度不能为空'
  }
  else {
    // 使用正则表达式判断值是否合法
    if (re.test(value)) {
      return ''
    }
    else {
      // 不合法
      return '邮箱格式不符合要求'
    }
  }
}

function checkPassword(value,params) {
  // 密码可以包含字母、数字、下划线和!-@#$%^&*
  var re = /^[\w!-@#$%^&*]*$/
  if (value === '') {
    return '长度不能为空'
  }
  else {
    // 使用正则表达式判断值是否合法
    if (re.test(value)) {
      // 判断长度是否合法
      return checkLength(value,params.minlength)
    }
    else {
      // 不合法
      return '密码格式不符合要求,只能包含字母、数字、下划线和!-@#$%^&*'
    }
  }
}

function checkPwdConfirm(value) {
  // 确认密码是否和密码一致
  if (value.password === value.repassword) {
    return ''
  }
  else {
    return '两次输入的密码不一致'
  }
}

function checkTick(value) {
  // 确认checkbox是否勾选
  if (value === true) {
    return ''
  }
  else {
    return '请勾选同意协议'
  }
}

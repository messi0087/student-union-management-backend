const validateAuthority = {
    Authority(data) {
      let result = ''
      switch (data) {
        case '老师':
          result = 0;
          break;
        case '主席':
          result = 1;
          break;
        case '中心主任':
          result = 2;
          break;
        case '中心副主任':
          result = 3;
          break;
        case '部长':
          result = 4;
          break;
        case '副部长':
          result = 5;
          break;
        case '干事':
          result = 6;
          break;
      }
      return result
    }
}

module.exports = validateAuthority

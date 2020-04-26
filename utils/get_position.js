const getPosition = {
    Position(data) {
      let result = ''
      switch (data) {
        case 0:
          result = '老师';
          break;
        case 1:
          result = '主席';
          break;
        case 2:
          result = '中心主任';
          break;
        case 3:
          result = '中心副主任';
          break;
        case 4:
          result = '部长';
          break;
        case 5:
          result = '副部长';
          break;
        case 6:
          result = '干事';
          break;
      }
      return result
    }
}

module.exports = getPosition

module.exports = function(num, digits) {
  var i, nStr, _i, _ref;
  if (digits == null) digits = 3;
  nStr = num.toString();
  for (i = _i = 0, _ref = digits - nStr.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
    if (i) nStr = '0' + nStr;
  }
  return nStr;
};

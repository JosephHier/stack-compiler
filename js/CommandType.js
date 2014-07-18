var CommandType = {
  C_ARITHMETIC: 0,
  C_PUSH:       1,
  C_POP:        2,
  C_LABEL:      3,
  C_GOTO:       4,
  C_IF:         5,
  C_FUNCTION:   6,
  C_RETURN:     7,
  C_CALL:       8
};

CommandType.toString = function toString (commandType) {
  switch (commandType) {
  case CommandType.C_ARITHMETIC:
    return 'C_ARITHMETIC';
  case CommandType.C_PUSH:
    return 'C_PUSH';
  case CommandType.C_POP:
    return 'C_POP';
  case CommandType.C_LABEL:
    return 'C_LABEL';
  case CommandType.C_GOTO:
    return 'C_GOTO';
  case CommandType.C_IF:
    return 'C_IF';
  case CommandType.C_FUNCTION:
    return 'C_FUNCTION';
  case CommandType.C_RETURN:
    return 'C_RETURN';
  case CommandType.C_CALL:
    return 'C_CALL';
  default:
    return null;
  }
};

module.exports = CommandType;

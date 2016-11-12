/*
 * Blockly code generator for Gobstones
 */
goog.require('Blockly.Generator');

Blockly.GobstonesLanguage = new Blockly.Generator('GobstonesLanguage');

/**
 * Order of operation ENUMs.
 * https://developer.mozilla.org/en/GobstonesLanguage/Reference/Operators/Operator_Precedence
 */
Blockly.GobstonesLanguage.ORDER_ATOMIC = 0;           // 0 "" ...
Blockly.GobstonesLanguage.ORDER_NEW = 1.1;            // new
Blockly.GobstonesLanguage.ORDER_MEMBER = 1.2;         // . []
Blockly.GobstonesLanguage.ORDER_FUNCTION_CALL = 2;    // ()
Blockly.GobstonesLanguage.ORDER_INCREMENT = 3;        // ++
Blockly.GobstonesLanguage.ORDER_DECREMENT = 3;        // --
Blockly.GobstonesLanguage.ORDER_BITWISE_NOT = 4.1;    // ~
Blockly.GobstonesLanguage.ORDER_UNARY_PLUS = 4.2;     // +
Blockly.GobstonesLanguage.ORDER_UNARY_NEGATION = 4.3; // -
Blockly.GobstonesLanguage.ORDER_LOGICAL_NOT = 4.4;    // !
Blockly.GobstonesLanguage.ORDER_TYPEOF = 4.5;         // typeof
Blockly.GobstonesLanguage.ORDER_VOID = 4.6;           // void
Blockly.GobstonesLanguage.ORDER_DELETE = 4.7;         // delete
Blockly.GobstonesLanguage.ORDER_DIVISION = 5.1;       // /
Blockly.GobstonesLanguage.ORDER_MULTIPLICATION = 5.2; // *
Blockly.GobstonesLanguage.ORDER_MODULUS = 5.3;        // %
Blockly.GobstonesLanguage.ORDER_SUBTRACTION = 6.1;    // -
Blockly.GobstonesLanguage.ORDER_ADDITION = 6.2;       // +
Blockly.GobstonesLanguage.ORDER_BITWISE_SHIFT = 7;    // << >> >>>
Blockly.GobstonesLanguage.ORDER_RELATIONAL = 8;       // < <= > >=
Blockly.GobstonesLanguage.ORDER_IN = 8;               // in
Blockly.GobstonesLanguage.ORDER_INSTANCEOF = 8;       // instanceof
Blockly.GobstonesLanguage.ORDER_EQUALITY = 9;         // == != === !==
Blockly.GobstonesLanguage.ORDER_BITWISE_AND = 10;     // &
Blockly.GobstonesLanguage.ORDER_BITWISE_XOR = 11;     // ^
Blockly.GobstonesLanguage.ORDER_BITWISE_OR = 12;      // |
Blockly.GobstonesLanguage.ORDER_LOGICAL_AND = 13;     // &&
Blockly.GobstonesLanguage.ORDER_LOGICAL_OR = 14;      // ||
Blockly.GobstonesLanguage.ORDER_CONDITIONAL = 15;     // ?:
Blockly.GobstonesLanguage.ORDER_ASSIGNMENT = 16;      // = += -= *= /= %= <<= >>= ...
Blockly.GobstonesLanguage.ORDER_COMMA = 17;           // ,
Blockly.GobstonesLanguage.ORDER_NONE = 99;            // (...)

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.GobstonesLanguage.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.GobstonesLanguage.definitions_) {
    definitions.push(Blockly.GobstonesLanguage.definitions_[name]);
  }
  // Clean up temporary data.
  delete Blockly.GobstonesLanguage.definitions_;
  delete Blockly.GobstonesLanguage.functionNames_;
  Blockly.GobstonesLanguage.variableDB_.reset();
  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.GobstonesLanguage.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped GobstonesLanguage string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} GobstonesLanguage string.
 * @private
 */
Blockly.GobstonesLanguage.quote_ = function(string) {
  // Can't use goog.string.quote since Google's style guide recommends
  // JS string literals use single quotes.
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating GobstonesLanguage from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The GobstonesLanguage code created for this block.
 * @return {string} GobstonesLanguage code with comments and subsequent blocks added.
 * @private
 */
Blockly.GobstonesLanguage.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.wrap(comment, Blockly.GobstonesLanguage.COMMENT_WRAP - 3);
    if (comment) {
      if (block.getProcedureDef) {
        // Use a comment block for function comments.
        commentCode += '/**\n' +
                       Blockly.GobstonesLanguage.prefixLines(comment + '\n', ' * ') +
                       ' */\n';
      } else {
        commentCode += Blockly.GobstonesLanguage.prefixLines(comment + '\n', '// ');
      }
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.GobstonesLanguage.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.GobstonesLanguage.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.GobstonesLanguage.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value while taking into account indexing.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @param {number=} opt_order The highest order acting on this value.
 * @return {string|number}
 */
Blockly.GobstonesLanguage.getAdjusted = function(block, atId, opt_delta, opt_negate,
    opt_order) {
  var delta = opt_delta || 0;
  var order = opt_order || Blockly.GobstonesLanguage.ORDER_NONE;
  if (Blockly.GobstonesLanguage.ONE_BASED_INDEXING) {
    delta--;
  }
  var defaultAtIndex = Blockly.GobstonesLanguage.ONE_BASED_INDEXING ? '1' : '0';
  if (delta > 0) {
    var at = Blockly.GobstonesLanguage.valueToCode(block, atId,
        Blockly.GobstonesLanguage.ORDER_ADDITION) || defaultAtIndex;
  } else if (delta < 0) {
    var at = Blockly.GobstonesLanguage.valueToCode(block, atId,
        Blockly.GobstonesLanguage.ORDER_SUBTRACTION) || defaultAtIndex;
  } else if (opt_negate) {
    var at = Blockly.GobstonesLanguage.valueToCode(block, atId,
        Blockly.GobstonesLanguage.ORDER_UNARY_NEGATION) || defaultAtIndex;
  } else {
    var at = Blockly.GobstonesLanguage.valueToCode(block, atId, order) ||
        defaultAtIndex;
  }

  if (Blockly.isNumber(at)) {
    // If the index is a naked number, adjust it right now.
    at = parseFloat(at) + delta;
    if (opt_negate) {
      at = -at;
    }
  } else {
    // If the index is dynamic, adjust it in code.
    if (delta > 0) {
      at = at + ' + ' + delta;
      var innerOrder = Blockly.GobstonesLanguage.ORDER_ADDITION;
    } else if (delta < 0) {
      at = at + ' - ' + -delta;
      var innerOrder = Blockly.GobstonesLanguage.ORDER_SUBTRACTION;
    }
    if (opt_negate) {
      if (delta) {
        at = '-(' + at + ')';
      } else {
        at = '-' + at;
      }
      var innerOrder = Blockly.GobstonesLanguage.ORDER_UNARY_NEGATION;
    }
    innerOrder = Math.floor(innerOrder);
    order = Math.floor(order);
    if (innerOrder && order >= innerOrder) {
      at = '(' + at + ')';
    }
  }
  return at;
};

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.GobstonesLanguage.init = function(workspace) {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.GobstonesLanguage.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.GobstonesLanguage.functionNames_ = Object.create(null);

  if (!Blockly.GobstonesLanguage.variableDB_) {
    Blockly.GobstonesLanguage.variableDB_ =
        new Blockly.Names(Blockly.GobstonesLanguage.RESERVED_WORDS_);
  } else {
    Blockly.GobstonesLanguage.variableDB_.reset();
  }

  var defvars = [];
  var variables = workspace.variableList;
  /*if (variables.length) {
    for (var i = 0; i < variables.length; i++) {
      defvars[i] = Blockly.GobstonesLanguage.variableDB_.getName(variables[i],
          Blockly.Variables.NAME_TYPE);
    }
    Blockly.GobstonesLanguage.definitions_['variables'] =
        'var ' + defvars.join(', ') + ';';
  }*/
};

Blockly.GobstonesLanguage['Poner'] = function(block) {
  var color = Blockly.GobstonesLanguage.valueToCode(block, 'COLOR',
  Blockly.GobstonesLanguage.ORDER_NONE) || '\'\'';
  var code = 'Poner('+color+')\n';
  return code;
};

Blockly.GobstonesLanguage['Sacar'] = function(block) {
  var color = Blockly.GobstonesLanguage.valueToCode(block, 'COLOR',
  Blockly.GobstonesLanguage.ORDER_NONE) || '\'\'';
  var code = 'Sacar('+color+')\n';
  return code;
};

Blockly.GobstonesLanguage['Mover'] = function(block) {
  var direccion = Blockly.GobstonesLanguage.valueToCode(block, 'DIRECCION',
  Blockly.GobstonesLanguage.ORDER_NONE) || '\'\'';
  var code = 'Mover('+direccion+')\n';
  return code;
};

Blockly.GobstonesLanguage['IrAlBorde'] = function(block) {
  var direccion = Blockly.GobstonesLanguage.valueToCode(block, 'DIRECCION',
  Blockly.GobstonesLanguage.ORDER_NONE) || '\'\'';
  var code = 'IrAlBorde('+direccion+')\n';
  return code;
};

Blockly.GobstonesLanguage['VaciarTablero'] = function(block) {
  var code = 'VaciarTablero()\n';
  return code;
};

Blockly.GobstonesLanguage['Rojo'] = function(block) {
  var code = 'Rojo';
  return [code, Blockly.GobstonesLanguage.ORDER_ADDITION];
};

Blockly.GobstonesLanguage['Verde'] = function(block) {
  var code = 'Verde';
  return [code, Blockly.GobstonesLanguage.ORDER_ADDITION];
};

Blockly.GobstonesLanguage['Este'] = function(block) {
  var code = 'Este';
  return [code, Blockly.GobstonesLanguage.ORDER_ADDITION];
};

Blockly.GobstonesLanguage['Oeste'] = function(block) {
  var code = 'Oeste';
  return [code, Blockly.GobstonesLanguage.ORDER_ADDITION];
};

Blockly.GobstonesLanguage['Norte'] = function(block) {
  var code = 'Norte';
  return [code, Blockly.GobstonesLanguage.ORDER_ADDITION];
};

Blockly.GobstonesLanguage['Sur'] = function(block) {
  var code = 'Sur';
  return [code, Blockly.GobstonesLanguage.ORDER_ADDITION];
};

Blockly.GobstonesLanguage['math_number'] = function(block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  return [code, Blockly.GobstonesLanguage.ORDER_ATOMIC];
};

Blockly.GobstonesLanguage['Program'] = function(block) {
  let program = Blockly.GobstonesLanguage.statementToCode(block, 'program');
  let codigo = `program {\n${program}}`;
  return codigo;
};

Blockly.GobstonesLanguage['Repetir'] = function(block) {
  let body = Blockly.GobstonesLanguage.statementToCode(block, 'block');
  var count = Blockly.GobstonesLanguage.valueToCode(block, 'count',
  Blockly.GobstonesLanguage.ORDER_NONE) || '\'\'';

  let codigo = `repeat(${count}) {\n${body}}\n`;
  return codigo;
};

Blockly.GobstonesLanguage['RepetirHasta'] = function(block) {
  let body = Blockly.GobstonesLanguage.statementToCode(block, 'block');
  var condicion = Blockly.GobstonesLanguage.valueToCode(block, 'condicion',
  Blockly.GobstonesLanguage.ORDER_NONE) || '\'\'';

  let codigo = `while (not (${condicion})) {\n${body}}\n`;
  return codigo;
};

Blockly.GobstonesLanguage['SiEntonces'] = function(block) {
  let body = Blockly.GobstonesLanguage.statementToCode(block, 'block');
  var condicion = Blockly.GobstonesLanguage.valueToCode(block, 'condicion',
  Blockly.GobstonesLanguage.ORDER_NONE) || '\'\'';

  let codigo = `if (${condicion}) {\n${body}}\n`;
  return codigo;
};

Blockly.GobstonesLanguage['SiEntoncesSiNo'] = function(block) {
  let body1 = Blockly.GobstonesLanguage.statementToCode(block, 'block1');
  let body2 = Blockly.GobstonesLanguage.statementToCode(block, 'block2');
  var condicion = Blockly.GobstonesLanguage.valueToCode(block, 'condicion',
  Blockly.GobstonesLanguage.ORDER_NONE) || '\'\'';

  let codigo = `if (${condicion}) {\n${body1}}\nelse {\n${body2}}\n`;
  return codigo;
};

Blockly.GobstonesLanguage['HayBolitas'] = function(block) {
  var color = Blockly.GobstonesLanguage.valueToCode(block, 'COLOR',
  Blockly.GobstonesLanguage.ORDER_NONE) || '\'\'';
  var code = 'hayBolitas('+color+')';
  return [code, Blockly.GobstonesLanguage.ORDER_ADDITION];
};

Blockly.GobstonesLanguage.formatProcName = function(name)
{
  var pname = Blockly.GobstonesLanguage.variableDB_.getName(
    name, Blockly.Procedures.NAME_TYPE);

  pname = pname[0].toUpperCase() + pname.slice(1);
  return pname;
};

Blockly.GobstonesLanguage['procedures_defnoreturn'] = function(block) {
  var name = Blockly.GobstonesLanguage.formatProcName(block.getFieldValue('NAME'));

  var body = Blockly.GobstonesLanguage.statementToCode(block, 'STACK');

  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.GobstonesLanguage.variableDB_.getName(block.arguments_[x],
      Blockly.Variables.NAME_TYPE);
  }
  var args_string = args.map(function(i) { return '"' + i + '"'; }).join(', ');

  var code = 'procedure ' + name + '(' + args.join(', ') + ') {\n' +
    body + '}';

  code = Blockly.GobstonesLanguage.scrub_(block, code);
  Blockly.GobstonesLanguage.definitions_[name] = code;

  return null
};

Blockly.GobstonesLanguage['procedures_callnoreturn'] = function(block) {
  var procName = Blockly.GobstonesLanguage.formatProcName( block.getFieldValue('NAME'));
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.GobstonesLanguage.valueToCode(block, 'ARG' + i,
      Blockly.GobstonesLanguage.ORDER_COMMA) || 'null';
    }
  var code = procName + '(' + args.join(', ') + ')\n';
  return code;
};

Blockly.GobstonesLanguage['variables_get'] = function(block) {
  var code = Blockly.GobstonesLanguage.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.GobstonesLanguage.ORDER_ATOMIC];
};

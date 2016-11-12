/* global Blockly */

var control_color = 60;
var command_color = 200;
var expr_color = 180;

// Guardo un par de bloques utiles el resto los elimino
delete Blockly.Blocks.procedures_defreturn;
delete Blockly.Blocks.procedures_ifreturn;
Blockly.Msg.PROCEDURES_DEFNORETURN_COMMENT = 'Describe el procedimiento...';

Blockly.Blocks.Program = {
  init: function() {
    this.setColour(100);
    this.appendDummyInput().appendField('Al empezar a ejecutar');
    this.appendStatementInput('program');
    this.setDeletable(false);
    this.setEditable(false);
    this.setMovable(false);
  }
};

Blockly.Blocks.Repetir = {
  init: function() {
    this.setColour(control_color);
    this.appendValueInput('count')
      .setCheck('Number')
      .appendField('Repetir');
    this.appendStatementInput('block');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks.RepetirHasta = {
  init: function() {
    this.setColour(control_color);
    this.appendValueInput('condicion')
      .setCheck('Boolean')
      .appendField('Repetir Hasta');
    this.appendStatementInput('block');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks.SiEntonces = {
  init: function() {
    this.setColour(control_color);
    this.appendValueInput('condicion')
      .setCheck('Boolean')
      .appendField('Si');
    this.appendStatementInput('block');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks.SiEntoncesSiNo = {
  init: function() {
    this.setColour(control_color);
    this.appendValueInput('condicion')
      .setCheck('Boolean')
      .appendField('Si');
    this.appendStatementInput('block1');
    this.appendDummyInput()
        .appendField('si no');
    this.appendStatementInput('block2');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};
// ------------------------------------------------------
// Comandos:
// ------------------------------------------------------

Blockly.Blocks.Poner = {
  init: function() {
    this.jsonInit({
      message0: 'Poner %1',
      args0: [
        {
          type: 'input_value',
          name: 'COLOR',
          check: 'Color'
        }
      ],
      previousStatement: true,
      nextStatement: true,
      colour: command_color,
      tooltip: 'Poner color en casillero.',
      inputsInline: true,
    });
  }
};

Blockly.Blocks.Sacar = {
  init: function() {
    this.jsonInit({
      message0: 'Sacar %1',
      args0: [
        {
          type: 'input_value',
          name: 'COLOR',
          check: 'Color'
        }
      ],
      previousStatement: true,
      nextStatement: true,
      colour: command_color,
      tooltip: 'Sacar color de casillero.',
      inputsInline: true,
    });
  }
};

Blockly.Blocks.Mover = {
  init: function() {
    this.jsonInit({
      message0: 'Mover %1',
      args0: [
        {
          type: 'input_value',
          name: 'DIRECCION',
          check: 'Direccion'
        }
      ],
      previousStatement: true,
      nextStatement: true,
      colour: command_color,
      tooltip: 'Mover en una dirección.',
      inputsInline: true,
    });
  }
};

Blockly.Blocks.IrAlBorde = {
  init: function() {
    this.jsonInit({
      message0: 'IrAlBorde %1',
      args0: [
        {
          type: 'input_value',
          name: 'DIRECCION',
          check: 'Direccion'
        }
      ],
      previousStatement: true,
      nextStatement: true,
      colour: command_color,
      tooltip: 'Ir al borde del tablero.',
      inputsInline: true,
    });
  }
};

Blockly.Blocks.VaciarTablero = {
  init: function() {
    this.jsonInit({
      message0: 'VaciarTablero',
      previousStatement: true,
      nextStatement: true,
      colour: command_color,
      tooltip: 'Vaciar el tablero.',
      inputsInline: true,
    });
  }
};

// ------------------------------------------------------
// Expresiones:
// ------------------------------------------------------
function createExpressionBlock(name, type)
{
  return {
    init: function() {
      this.jsonInit({
        message0: name,
        output: type,
        colour: expr_color,
      });
    }
  };
}

function createColorBlock(name)
{
  return createExpressionBlock(name, 'Color');
}

function createDireccionBlock(name)
{
  return createExpressionBlock(name, 'Direccion');
}

function createSensorBlock(name, type)
{
  return createExpressionBlock(name, type);
}


Blockly.Blocks.Rojo = createColorBlock('Rojo');
Blockly.Blocks.Verde = createColorBlock('Verde');

Blockly.Blocks.Este = createDireccionBlock('Este');
Blockly.Blocks.Oeste = createDireccionBlock('Oeste');
Blockly.Blocks.Norte = createDireccionBlock('Norte');
Blockly.Blocks.Sur =  createDireccionBlock('Sur');

Blockly.Blocks.HayBolitas = {
  init: function() {
    this.jsonInit({
      message0: 'Hay bolitas %1',
      args0: [
        {
          type: 'input_value',
          name: 'COLOR',
          check: 'Color'
        }
      ],
      colour: expr_color,
      inputsInline: true,
      output: 'Boolean',
    });
  }
};

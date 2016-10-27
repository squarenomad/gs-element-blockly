Blockly.Blocks['color_rojo'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Rojo',
      "output": "Color",
      "colour": 200,
    });
  }
};

Blockly.Blocks['color_verde'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Verde',
      "output": "Color",
      "colour": 200,
    });
  }
};

Blockly.Blocks['poner_color'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Poner %1',
      "args0": [
        {
          "type": "input_value",
          "name": "COLOR",
          "check": "Color"
        }
      ],
      "previousStatement": true,
      "nextStatement": true,
      "colour": 200,
      "tooltip": "Poner color en casillero.",
      "inputsInline": true,
    });
  }
};

Blockly.Blocks['sacar_color'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Sacar %1',
      "args0": [
        {
          "type": "input_value",
          "name": "COLOR",
          "check": "Color"
        }
      ],
      "previousStatement": true,
      "nextStatement": true,
      "colour": 200,
      "tooltip": "Sacar color de casillero.",
      "inputsInline": true,
    });
  }
};

Blockly.Blocks['mover'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Mover %1',
      "args0": [
        {
          "type": "input_value",
          "name": "DIRECCION",
          "check": "Direccion"
        }
      ],
      "previousStatement": true,
      "nextStatement": true,
      "colour": 120,
      "tooltip": "Mover en una dirección.",
      "inputsInline": true,
    });
  }
};

Blockly.Blocks['direccion_este'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Este',
      "output": "Direccion",
      "colour": 100,
    });
  }
};

Blockly.Blocks['direccion_oeste'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Oeste',
      "output": "Direccion",
      "colour": 100,
    });
  }
};

Blockly.Blocks['direccion_norte'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Norte',
      "output": "Direccion",
      "colour": 100,
    });
  }
};

Blockly.Blocks['direccion_sur'] = {
  init: function() {
    this.jsonInit({
      "message0": 'Sur',
      "output": "Direccion",
      "colour": 100,
    });
  }
};

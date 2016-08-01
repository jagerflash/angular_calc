angular.module('calc').factory('keysService', function(){
    var keyboard = {}; // кнопки
    
    keyboard.DIGIT1 = "1";
    keyboard.DIGIT2 = "2";
    keyboard.DIGIT3 = "3";
    keyboard.DIGIT4 = "4";
    keyboard.DIGIT5 = "5";
    keyboard.DIGIT6 = "6";
    keyboard.DIGIT7 = "7";
    keyboard.DIGIT8 = "8";
    keyboard.DIGIT9 = "9";
    keyboard.DIGIT0 = "0";
    keyboard.OP_DIV = "/";
    keyboard.OP_MUL = "*";
    keyboard.OP_MNS = "-";
    keyboard.OP_PLS = "+";
    keyboard.OP_PNT = ".";
    keyboard.OP_LBR = "(";
    keyboard.OP_RBR = ")";
    keyboard.OP_BCK = "←";
    keyboard.OP_CLR = "C";
    keyboard.OP_EQL = "=";
    keyboard.OP_PST = "%";
    keyboard.OP_SQT = "√";
    keyboard.OP_SQR = "x²";
    keyboard.OP_INV = "+-";
    keyboard.OP_MMS = "M-";
    keyboard.OP_MPL = "M+";
    keyboard.OP_MCL = "MC";
    keyboard.OP_MRD = "MR";
    
    return keyboard;
});
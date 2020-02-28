"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UnaryAffixType;
(function (UnaryAffixType) {
    UnaryAffixType[UnaryAffixType["Postfix"] = 0] = "Postfix";
    UnaryAffixType[UnaryAffixType["Prefix"] = 1] = "Prefix";
})(UnaryAffixType = exports.UnaryAffixType || (exports.UnaryAffixType = {}));
var UnaryOperatorType;
(function (UnaryOperatorType) {
    UnaryOperatorType[UnaryOperatorType["Increment"] = 0] = "Increment";
    UnaryOperatorType[UnaryOperatorType["Decrement"] = 1] = "Decrement";
    UnaryOperatorType[UnaryOperatorType["Invert"] = 2] = "Invert";
    UnaryOperatorType[UnaryOperatorType["Negative"] = 3] = "Negative";
    UnaryOperatorType[UnaryOperatorType["Positive"] = 4] = "Positive";
    UnaryOperatorType[UnaryOperatorType["Complement"] = 5] = "Complement"; // ~
})(UnaryOperatorType = exports.UnaryOperatorType || (exports.UnaryOperatorType = {}));
//# sourceMappingURL=iunaryexpression.js.map
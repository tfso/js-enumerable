/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

"use strict";

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleIndices = { Start: 0 },
      peg$startRuleIndex   = 0,

      peg$consts = [
        function(args, expr) {
            	return {
        			  type: 'LambdaExpression',
                arguments: [args],
                expression: expr
              }
            },
        function(first, rest) {
              return buildTree(first, rest, function(result, element) {
                return {
                  type: 'LogicalExpression',
                  operator: '||',
                  left:  result,
                  right: element[1]
                };
              });
            },
        function(first, rest) {
              return buildTree(first, rest, function(result, element) {
                return {
                  type: 'LogicalExpression',
                  operator: '&&',
                  left: result,
                  right: element[1]
                };
              });
            },
        function(first, rest) {
              return buildTree(first, rest, function(result, element) {
                let map = { 'eq': '==', 'ne': '!=' }
                
                return {
                  type: 'RelationalExpression',
                  operator: map[element[0][0].toLowerCase()],
                  left:  result,
                  right: element[1]
                };
              });
            },
        function(first, rest) {
              return buildTree(first, rest, function(result, element) {
              	let map = { 'le': '<=', 'ge': '>=', 'lt': '<', 'gt': '>' }
          
                return {
                  type: 'RelationalExpression',
                  operator: map[element[0][0].toLowerCase()],
                  left:  result,
                  right: element[1]
                };
              });
            },
        "in",
        peg$literalExpectation("IN", true),
        function(first, rest) {
              return buildTree(first, rest, function(result, element) {
                return {
                  type: 'RelationalExpression',
                  operator: 'in',
                  left:  result,
                  right: element[1]
                };
              });
            },
        function(first, rest) {
              return buildTree(first, rest, function(result, element) {
              	let map = { 'add': '+', 'sub': '-' }
              
                return {
                  type: 'BinaryExpression',
                  operator: map[element[0][0].toLowerCase()],
                  left:  result,
                  right: element[1]
                };
              });
            },
        function(first, rest) {
              return buildTree(first, rest, function(result, element) {
                let map = { 'mul': '*', 'div': '/', 'mod': '%' }
                
                return {
                  type: 'BinaryExpression',
                  operator: map[element[0][0].toLowerCase()],
                  left:  result,
                  right: element[1]
                };
              });
            },
        function(operator, operand) {
              return operand.type === 'NumberLiteral' && (operator === '-' || operator === '+')
                ? 
                { 
                  type: 'NumberLiteral', 
                  value: (operator === '-' ? operator : '') + operand.value
                }
                :
                {
                  type: 'UnaryExpression', 
                  operator: operator, 
                  argument:  operand
                };
            },
        function(expr) { return expr; },
        function(qual, args) { 
              return {
              	type: 'CallExpression', 
                object: qual,
                arguments: args
              };
            },
        function(qual, expr) { 
              return { 
            	type: 'ArrayExpression', 
                array: qual, 
                index: expr 
              };
            },
        function(first, i) { return i; },
        function(first, list) { 
              if(list) {
                return {
                  type: 'MemberExpression',
                  object: first,
                  property: list
                }
              }
              return first;
            },
        function(op) { 
            	let map = { 'not': '!', '+': '+', '-': '-' }
            	return map[op[0].toLowerCase()]; 
            },
        function(first, rest) { return buildList(first, rest, 1); },
        function(args) { return args || []; },
        function(exp) { return exp; },
        /^[ \t\r\n\f]/,
        peg$classExpectation([" ", "\t", "\r", "\n", "\f"], false, false),
        function(first, last) { return { type: 'Identifier', name: first + last.join('') }; },
        /^[a-z]/,
        peg$classExpectation([["a", "z"]], false, false),
        /^[A-Z]/,
        peg$classExpectation([["A", "Z"]], false, false),
        /^[_$]/,
        peg$classExpectation(["_", "$"], false, false),
        /^[0-9]/,
        peg$classExpectation([["0", "9"]], false, false),
        "true",
        peg$literalExpectation("true", false),
        function() { return { type: 'BooleanLiteral', value: true }; },
        "false",
        peg$literalExpectation("false", false),
        function() { return { type: 'BooleanLiteral', value: false }; },
        "null",
        peg$literalExpectation("null", false),
        function() { return { type: 'NullLiteral' }; },
        function(literal) { return literal; },
        /^[lL]/,
        peg$classExpectation(["l", "L"], false, false),
        function() { return { type: 'NumberLiteral', value: text() }; },
        "0",
        peg$literalExpectation("0", false),
        /^[1-9]/,
        peg$classExpectation([["1", "9"]], false, false),
        /^[_]/,
        peg$classExpectation(["_"], false, false),
        "0x",
        peg$literalExpectation("0x", false),
        "0X",
        peg$literalExpectation("0X", false),
        "0b",
        peg$literalExpectation("0b", false),
        "0B",
        peg$literalExpectation("0B", false),
        /^[01]/,
        peg$classExpectation(["0", "1"], false, false),
        /^[0-7]/,
        peg$classExpectation([["0", "7"]], false, false),
        "-",
        peg$literalExpectation("-", false),
        "T",
        peg$literalExpectation("T", false),
        ":",
        peg$literalExpectation(":", false),
        ".",
        peg$literalExpectation(".", false),
        "Z",
        peg$literalExpectation("Z", false),
        function(value) { return { type: 'DateTimeLiteral', value: flattenArray(value).join('') }; },
        "datetime",
        peg$literalExpectation("datetime", true),
        "'",
        peg$literalExpectation("'", false),
        function(first, value, last) { return { type: 'DateTimeLiteral', value: flattenArray(value).join('') }; },
        function(value) { return { type: 'DateLiteral', value: flattenArray(value).join('') }; },
        "date",
        peg$literalExpectation("date", true),
        function(first, value, last) { return { type: 'DateLiteral', value: flattenArray(value).join('') }; },
        /^[fFdD]/,
        peg$classExpectation(["f", "F", "d", "D"], false, false),
        /^[eE]/,
        peg$classExpectation(["e", "E"], false, false),
        /^[+\-]/,
        peg$classExpectation(["+", "-"], false, false),
        /^[pP]/,
        peg$classExpectation(["p", "P"], false, false),
        /^[a-f]/,
        peg$classExpectation([["a", "f"]], false, false),
        /^[A-F]/,
        peg$classExpectation([["A", "F"]], false, false),
        /^['\\\n\r]/,
        peg$classExpectation(["'", "\\", "\n", "\r"], false, false),
        peg$anyExpectation(),
        function(chars) { return { type: 'Literal', value: chars.map(l => l[0] == undefined ? l[1] : l[0] + l[1]).join('').replace(/\\(["'\\])|'(')/g, '$1$2') } },
        function(first, rest) { return buildList(first, rest, 2)},
        function(elements) { return { type: 'ArrayLiteral', elements: elements } },
        "''",
        peg$literalExpectation("''", false),
        "\\",
        peg$literalExpectation("\\", false),
        /^[btnfr"'\\]/,
        peg$classExpectation(["b", "t", "n", "f", "r", "\"", "'", "\\"], false, false),
        /^[0-3]/,
        peg$classExpectation([["0", "3"]], false, false),
        "u",
        peg$literalExpectation("u", false),
        "add",
        peg$literalExpectation("add", true),
        "and",
        peg$literalExpectation("and", true),
        ",",
        peg$literalExpectation(",", false),
        "div",
        peg$literalExpectation("div", true),
        "/",
        peg$literalExpectation("/", false),
        "eq",
        peg$literalExpectation("eq", true),
        "ge",
        peg$literalExpectation("ge", true),
        "gt",
        peg$literalExpectation("gt", true),
        "[",
        peg$literalExpectation("[", false),
        "le",
        peg$literalExpectation("le", true),
        "(",
        peg$literalExpectation("(", false),
        "lt",
        peg$literalExpectation("lt", true),
        "mod",
        peg$literalExpectation("mod", true),
        "ne",
        peg$literalExpectation("ne", true),
        "not",
        peg$literalExpectation("not", true),
        "or",
        peg$literalExpectation("or", true),
        "+",
        peg$literalExpectation("+", false),
        "]",
        peg$literalExpectation("]", false),
        ")",
        peg$literalExpectation(")", false),
        "sub",
        peg$literalExpectation("sub", true),
        "mul",
        peg$literalExpectation("mul", true)
      ],

      peg$bytecode = [
        peg$decode(";\""),
        peg$decode("%;2/M#;1/D$;N/;$;1/2$;\"/)$8%: %\"$ )(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%;#/\x85#$%%;^/,#;1/#$+\")(\"'#&'#/,#;#/#$+\")(\"'#&'#0I*%%;^/,#;1/#$+\")(\"'#&'#/,#;#/#$+\")(\"'#&'#&/)$8\":!\"\"! )(\"'#&'#"),
        peg$decode("%;$/\x85#$%%;M/,#;1/#$+\")(\"'#&'#/,#;$/#$+\")(\"'#&'#0I*%%;M/,#;1/#$+\")(\"'#&'#/,#;$/#$+\")(\"'#&'#&/)$8\":\"\"\"! )(\"'#&'#"),
        peg$decode("%;%/\xB7#$%%;R/,#;1/#$+\")(\"'#&'#.6 &%;\\/,#;1/#$+\")(\"'#&'#/,#;%/#$+\")(\"'#&'#0b*%%;R/,#;1/#$+\")(\"'#&'#.6 &%;\\/,#;1/#$+\")(\"'#&'#/,#;%/#$+\")(\"'#&'#&/)$8\":#\"\"! )(\"'#&'#"),
        peg$decode("%;&/\u011B#$%%;W/,#;1/#$+\")(\"'#&'#.h &%;S/,#;1/#$+\")(\"'#&'#.O &%;Y/,#;1/#$+\")(\"'#&'#.6 &%;T/,#;1/#$+\")(\"'#&'#/,#;&/#$+\")(\"'#&'#0\x94*%%;W/,#;1/#$+\")(\"'#&'#.h &%;S/,#;1/#$+\")(\"'#&'#.O &%;Y/,#;1/#$+\")(\"'#&'#.6 &%;T/,#;1/#$+\")(\"'#&'#/,#;&/#$+\")(\"'#&'#&/)$8\":$\"\"! )(\"'#&'#"),
        peg$decode("%;'/\x91#$%%3%\"\"5\"7&/,#;1/#$+\")(\"'#&'#/,#;'/#$+\")(\"'#&'#0O*%%3%\"\"5\"7&/,#;1/#$+\")(\"'#&'#/,#;'/#$+\")(\"'#&'#&/)$8\":'\"\"! )(\"'#&'#"),
        peg$decode("%;(/\xB7#$%%;L/,#;1/#$+\")(\"'#&'#.6 &%;b/,#;1/#$+\")(\"'#&'#/,#;(/#$+\")(\"'#&'#0b*%%;L/,#;1/#$+\")(\"'#&'#.6 &%;b/,#;1/#$+\")(\"'#&'#/,#;(/#$+\")(\"'#&'#&/)$8\":(\"\"! )(\"'#&'#"),
        peg$decode("%;)/\xE9#$%%;c/,#;1/#$+\")(\"'#&'#.O &%;P/,#;1/#$+\")(\"'#&'#.6 &%;[/,#;1/#$+\")(\"'#&'#/,#;)/#$+\")(\"'#&'#0{*%%;c/,#;1/#$+\")(\"'#&'#.O &%;P/,#;1/#$+\")(\"'#&'#.6 &%;[/,#;1/#$+\")(\"'#&'#/,#;)/#$+\")(\"'#&'#&/)$8\":)\"\"! )(\"'#&'#"),
        peg$decode("%;-/2#;*/)$8\":*\"\"! )(\"'#&'#.# &;*"),
        peg$decode(";+.5 &;;./ &;<.) &;,.# &;5"),
        peg$decode("%;X/L#;1/C$;\"/:$;a/1$;1/($8%:+%!\")(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%%<;K=.##&&!&'#/;#;2/2$;./)$8#:,#\"! )(#'#(\"'#&'#.\xC7 &%%<;K=.##&&!&'#/_#;2/V$;V/M$;1/D$;\"/;$;`/2$;1/)$8':-'\"%\")(''#(&'#(%'#($'#(#'#(\"'#&'#.o &%%<;K=.##&&!&'#/Y#;2/P$%;Q/2#;,/)$8\":.\"\"# )(\"'#&'#.\" &\"/)$8#:/#\"! )(#'#(\"'#&'#"),
        peg$decode("%%;]/,#;1/#$+\")(\"'#&'#.O &%;_/,#;1/#$+\")(\"'#&'#.6 &%;Z/,#;1/#$+\")(\"'#&'#/' 8!:0!! )"),
        peg$decode("%;X/\xCF#;1/\xC6$%;!.# &;\"/\x91#$%%;O/,#;1/#$+\")(\"'#&'#/2#;!.# &;\"/#$+\")(\"'#&'#0O*%%;O/,#;1/#$+\")(\"'#&'#/2#;!.# &;\"/#$+\")(\"'#&'#&/)$8\":1\"\"! )(\"'#&'#.\" &\"/:$;a/1$;1/($8%:2%!\")(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%;V/>#;1/5$;`/,$;1/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%;V/L#;1/C$;\"/:$;`/1$;1/($8%:3%!\")(%'#($'#(#'#(\"'#&'#"),
        peg$decode("$$44\"\"5!75/,#0)*44\"\"5!75&&&#0<*$44\"\"5!75/,#0)*44\"\"5!75&&&#&"),
        peg$decode("%;3/B#$;40#*;4&/2$;1/)$8#:6#\"\"!)(#'#(\"'#&'#"),
        peg$decode("47\"\"5!78.5 &49\"\"5!7:.) &4;\"\"5!7<"),
        peg$decode("47\"\"5!78.A &49\"\"5!7:.5 &4=\"\"5!7>.) &4;\"\"5!7<"),
        peg$decode("%;=.\xBC &;6.\xB6 &;F.\xB0 &;G.\xAA &%2?\"\"6?7@/<#%<;4=.##&&!&'#/'$8\":A\" )(\"'#&'#.{ &%2B\"\"6B7C/<#%<;4=.##&&!&'#/'$8\":D\" )(\"'#&'#.L &%2E\"\"6E7F/<#%<;4=.##&&!&'#/'$8\":G\" )(\"'#&'#/1#;1/($8\":H\"!!)(\"'#&'#"),
        peg$decode("%;8./ &;9.) &;:.# &;7/;#4I\"\"5!7J.\" &\"/'$8\":K\" )(\"'#&'#"),
        peg$decode("2L\"\"6L7M.\x9B &%4N\"\"5!7O/\x8B#$%$4P\"\"5!7Q0)*4P\"\"5!7Q&/2#4=\"\"5!7>/#$+\")(\"'#&'#0O*%$4P\"\"5!7Q0)*4P\"\"5!7Q&/2#4=\"\"5!7>/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%2R\"\"6R7S.) &2T\"\"6T7U/,#;D/#$+\")(\"'#&'#"),
        peg$decode("%2V\"\"6V7W.) &2X\"\"6X7Y/\x9A#4Z\"\"5!7[/\x8B$$%$4P\"\"5!7Q0)*4P\"\"5!7Q&/2#4Z\"\"5!7[/#$+\")(\"'#&'#0O*%$4P\"\"5!7Q0)*4P\"\"5!7Q&/2#4Z\"\"5!7[/#$+\")(\"'#&'#&/#$+#)(#'#(\"'#&'#"),
        peg$decode("%2L\"\"6L7M/\x91#$%$4P\"\"5!7Q0)*4P\"\"5!7Q&/2#4\\\"\"5!7]/#$+\")(\"'#&'#/R#0O*%$4P\"\"5!7Q0)*4P\"\"5!7Q&/2#4\\\"\"5!7]/#$+\")(\"'#&'#&&&#/#$+\")(\"'#&'#"),
        peg$decode("%%4=\"\"5!7>/\u0198#4=\"\"5!7>/\u0189$4=\"\"5!7>/\u017A$4=\"\"5!7>/\u016B$2^\"\"6^7_/\u015C$4=\"\"5!7>/\u014D$4=\"\"5!7>/\u013E$2^\"\"6^7_/\u012F$4=\"\"5!7>/\u0120$4=\"\"5!7>/\u0111$%2`\"\"6`7a/\xE4#4=\"\"5!7>/\xD5$4=\"\"5!7>/\xC6$2b\"\"6b7c/\xB7$4=\"\"5!7>/\xA8$4=\"\"5!7>/\x99$%2b\"\"6b7c/{#4=\"\"5!7>/l$4=\"\"5!7>/]$%2d\"\"6d7e/?#$4=\"\"5!7>0)*4=\"\"5!7>&/#$+\")(\"'#&'#.\" &\"/#$+$)($'#(#'#(\"'#&'#.\" &\"/#$+')(''#(&'#(%'#($'#(#'#(\"'#&'#/7$2f\"\"6f7g.\" &\"/#$+,)(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#/1#;1/($8\":h\"!!)(\"'#&'#.\u01F4 &%3i\"\"5(7j/\u01E4#2k\"\"6k7l/\u01D5$%4=\"\"5!7>/\u019D#4=\"\"5!7>/\u018E$4=\"\"5!7>/\u017F$4=\"\"5!7>/\u0170$2^\"\"6^7_/\u0161$4=\"\"5!7>/\u0152$4=\"\"5!7>/\u0143$2^\"\"6^7_/\u0134$4=\"\"5!7>/\u0125$4=\"\"5!7>/\u0116$%2`\"\"6`7a/\xE4#4=\"\"5!7>/\xD5$4=\"\"5!7>/\xC6$2b\"\"6b7c/\xB7$4=\"\"5!7>/\xA8$4=\"\"5!7>/\x99$%2b\"\"6b7c/{#4=\"\"5!7>/l$4=\"\"5!7>/]$%2d\"\"6d7e/?#$4=\"\"5!7>0)*4=\"\"5!7>&/#$+\")(\"'#&'#.\" &\"/#$+$)($'#(#'#(\"'#&'#.\" &\"/#$+')(''#(&'#(%'#($'#(#'#(\"'#&'#.\" &\"/7$2f\"\"6f7g.\" &\"/#$+,)(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#/B$2k\"\"6k7l/3$;1/*$8%:m%#$\"!)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%%4=\"\"5!7>/\xBE#4=\"\"5!7>/\xAF$4=\"\"5!7>/\xA0$4=\"\"5!7>/\x91$2^\"\"6^7_/\x82$4=\"\"5!7>/s$4=\"\"5!7>/d$2^\"\"6^7_/U$4=\"\"5!7>/F$4=\"\"5!7>/7$2f\"\"6f7g.\" &\"/#$++)(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#/1#;1/($8\":n\"!!)(\"'#&'#.\u0115 &%3o\"\"5$7p/\u0105#2k\"\"6k7l/\xF6$%4=\"\"5!7>/\xBE#4=\"\"5!7>/\xAF$4=\"\"5!7>/\xA0$4=\"\"5!7>/\x91$2^\"\"6^7_/\x82$4=\"\"5!7>/s$4=\"\"5!7>/d$2^\"\"6^7_/U$4=\"\"5!7>/F$4=\"\"5!7>/7$2f\"\"6f7g.\" &\"/#$++)(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#/B$2k\"\"6k7l/3$;1/*$8%:q%#$\"!)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%;@.# &;>/& 8!:K! )"),
        peg$decode("%;C/b#2d\"\"6d7e/S$;C.\" &\"/E$;?.\" &\"/7$4r\"\"5!7s.\" &\"/#$+%)(%'#($'#(#'#(\"'#&'#.\xB8 &%2d\"\"6d7e/N#;C/E$;?.\" &\"/7$4r\"\"5!7s.\" &\"/#$+$)($'#(#'#(\"'#&'#.w &%;C/@#;?/7$4r\"\"5!7s.\" &\"/#$+#)(#'#(\"'#&'#.J &%;C/@#;?.\" &\"/2$4r\"\"5!7s/#$+#)(#'#(\"'#&'#"),
        peg$decode("%4t\"\"5!7u/@#4v\"\"5!7w.\" &\"/,$;C/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;A/@#;B/7$4r\"\"5!7s.\" &\"/#$+#)(#'#(\"'#&'#"),
        peg$decode("%2R\"\"6R7S.) &2T\"\"6T7U/I#;D.\" &\"/;$2d\"\"6d7e/,$;D/#$+$)($'#(#'#(\"'#&'#.A &%;8/7#2d\"\"6d7e.\" &\"/#$+\")(\"'#&'#"),
        peg$decode("%4x\"\"5!7y/@#4v\"\"5!7w.\" &\"/,$;C/#$+#)(#'#(\"'#&'#"),
        peg$decode("%4=\"\"5!7>/\x8B#$%$4P\"\"5!7Q0)*4P\"\"5!7Q&/2#4=\"\"5!7>/#$+\")(\"'#&'#0O*%$4P\"\"5!7Q0)*4P\"\"5!7Q&/2#4=\"\"5!7>/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%;E/\x7F#$%$4P\"\"5!7Q0)*4P\"\"5!7Q&/,#;E/#$+\")(\"'#&'#0I*%$4P\"\"5!7Q0)*4P\"\"5!7Q&/,#;E/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("4z\"\"5!7{.5 &4|\"\"5!7}.) &4=\"\"5!7>"),
        peg$decode("%2k\"\"6k7l/\xA7#$;H.M &%%<4~\"\"5!7\x7F=.##&&!&'#/1#1\"\"5!7\x80/#$+\")(\"'#&'#0S*;H.M &%%<4~\"\"5!7\x7F=.##&&!&'#/1#1\"\"5!7\x80/#$+\")(\"'#&'#&/7$2k\"\"6k7l/($8#:\x81#!!)(#'#(\"'#&'#"),
        peg$decode("%;X/\xD3#;1/\xCA$%;\"/q#$%;O/5#;1/,$;\"/#$+#)(#'#(\"'#&'#0?*%;O/5#;1/,$;\"/#$+#)(#'#(\"'#&'#&/)$8\":\x82\"\"! )(\"'#&'#.\" &\"/d$%;O/,#;1/#$+\")(\"'#&'#.\" &\"/C$;1/:$;a/1$;1/($8':\x83'!$)(''#(&'#(%'#($'#(#'#(\"'#&'#"),
        peg$decode("2\x84\"\"6\x847\x85.N &%2\x86\"\"6\x867\x87/>#4\x88\"\"5!7\x89.) &;I.# &;J/#$+\")(\"'#&'#"),
        peg$decode("%4\x8A\"\"5!7\x8B/A#4\\\"\"5!7]/2$4\\\"\"5!7]/#$+#)(#'#(\"'#&'#.N &%4\\\"\"5!7]/2#4\\\"\"5!7]/#$+\")(\"'#&'#.) &4\\\"\"5!7]"),
        peg$decode("%$2\x8C\"\"6\x8C7\x8D/,#0)*2\x8C\"\"6\x8C7\x8D&&&#/G#;E/>$;E/5$;E/,$;E/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%2?\"\"6?7@/8#%<;4=.##&&!&'#/#$+\")(\"'#&'#.s &%2B\"\"6B7C/8#%<;4=.##&&!&'#/#$+\")(\"'#&'#.H &%2E\"\"6E7F/8#%<;4=.##&&!&'#/#$+\")(\"'#&'#"),
        peg$decode("3\x8E\"\"5#7\x8F"),
        peg$decode("3\x90\"\"5#7\x91"),
        peg$decode("2b\"\"6b7c"),
        peg$decode("2\x92\"\"6\x927\x93"),
        peg$decode("3\x94\"\"5#7\x95"),
        peg$decode("2\x96\"\"6\x967\x97"),
        peg$decode("3\x98\"\"5\"7\x99"),
        peg$decode("3\x9A\"\"5\"7\x9B"),
        peg$decode("3\x9C\"\"5\"7\x9D"),
        peg$decode("2^\"\"6^7_"),
        peg$decode("2\x9E\"\"6\x9E7\x9F"),
        peg$decode("3\xA0\"\"5\"7\xA1"),
        peg$decode("2\xA2\"\"6\xA27\xA3"),
        peg$decode("3\xA4\"\"5\"7\xA5"),
        peg$decode("2^\"\"6^7_"),
        peg$decode("3\xA6\"\"5#7\xA7"),
        peg$decode("3\xA8\"\"5\"7\xA9"),
        peg$decode("3\xAA\"\"5#7\xAB"),
        peg$decode("3\xAC\"\"5\"7\xAD"),
        peg$decode("2\xAE\"\"6\xAE7\xAF"),
        peg$decode("2\xB0\"\"6\xB07\xB1"),
        peg$decode("2\xB2\"\"6\xB27\xB3"),
        peg$decode("3\xB4\"\"5#7\xB5"),
        peg$decode("3\xB6\"\"5#7\xB7")
      ],

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleIndices)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleIndex = peg$startRuleIndices[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$decode(s) {
    var bc = new Array(s.length), i;

    for (i = 0; i < s.length; i++) {
      bc[i] = s.charCodeAt(i) - 32;
    }

    return bc;
  }

  function peg$parseRule(index) {
    var bc    = peg$bytecode[index],
        ip    = 0,
        ips   = [],
        end   = bc.length,
        ends  = [],
        stack = [],
        params, i;

    while (true) {
      while (ip < end) {
        switch (bc[ip]) {
          case 0:
            stack.push(peg$consts[bc[ip + 1]]);
            ip += 2;
            break;

          case 1:
            stack.push(void 0);
            ip++;
            break;

          case 2:
            stack.push(null);
            ip++;
            break;

          case 3:
            stack.push(peg$FAILED);
            ip++;
            break;

          case 4:
            stack.push([]);
            ip++;
            break;

          case 5:
            stack.push(peg$currPos);
            ip++;
            break;

          case 6:
            stack.pop();
            ip++;
            break;

          case 7:
            peg$currPos = stack.pop();
            ip++;
            break;

          case 8:
            stack.length -= bc[ip + 1];
            ip += 2;
            break;

          case 9:
            stack.splice(-2, 1);
            ip++;
            break;

          case 10:
            stack[stack.length - 2].push(stack.pop());
            ip++;
            break;

          case 11:
            stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
            ip += 2;
            break;

          case 12:
            stack.push(input.substring(stack.pop(), peg$currPos));
            ip++;
            break;

          case 13:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1]) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 14:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1] === peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 15:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1] !== peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 16:
            if (stack[stack.length - 1] !== peg$FAILED) {
              ends.push(end);
              ips.push(ip);

              end = ip + 2 + bc[ip + 1];
              ip += 2;
            } else {
              ip += 2 + bc[ip + 1];
            }

            break;

          case 17:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (input.length > peg$currPos) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 18:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 19:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 20:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 21:
            stack.push(input.substr(peg$currPos, bc[ip + 1]));
            peg$currPos += bc[ip + 1];
            ip += 2;
            break;

          case 22:
            stack.push(peg$consts[bc[ip + 1]]);
            peg$currPos += peg$consts[bc[ip + 1]].length;
            ip += 2;
            break;

          case 23:
            stack.push(peg$FAILED);
            if (peg$silentFails === 0) {
              peg$fail(peg$consts[bc[ip + 1]]);
            }
            ip += 2;
            break;

          case 24:
            peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];
            ip += 2;
            break;

          case 25:
            peg$savedPos = peg$currPos;
            ip++;
            break;

          case 26:
            params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);
            for (i = 0; i < bc[ip + 3]; i++) {
              params[i] = stack[stack.length - 1 - params[i]];
            }

            stack.splice(
              stack.length - bc[ip + 2],
              bc[ip + 2],
              peg$consts[bc[ip + 1]].apply(null, params)
            );

            ip += 4 + bc[ip + 3];
            break;

          case 27:
            stack.push(peg$parseRule(bc[ip + 1]));
            ip += 2;
            break;

          case 28:
            peg$silentFails++;
            ip++;
            break;

          case 29:
            peg$silentFails--;
            ip++;
            break;

          default:
            throw new Error("Invalid opcode: " + bc[ip] + ".");
        }
      }

      if (ends.length > 0) {
        end = ends.pop();
        ip = ips.pop();
      } else {
        break;
      }
    }

    return stack[0];
  }


    function buildList(first, rest, index) {
      var result = new Array(rest.length), i;

      for (i = 0; i < rest.length; i++) {
        result[i] = rest[i][index];
      }
      
      return [first].concat(result);
    }

    function buildTree(first, rest, builder) {
      var result = first, i;

      for (i = 0; i < rest.length; i++) {
        result = builder(result, rest[i]);
      }

      return result;
    }
    
    function flattenArray(value) {
    	return Array.isArray(value) ? [].concat.apply([], value.map(function(v) { return flattenArray(v) })) : value
    }


  peg$result = peg$parseRule(peg$startRuleIndex);

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};
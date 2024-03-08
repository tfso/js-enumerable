
//===========================================================================
//  OData Expression Grammar
//   by Nicolai Gjærum
// 
//  This grammar is based on "Parsing Expression Grammar of Java" by Roman R
//  Redziejowski. It is heavily modified and stripped down to support OData
//  expressions only (the part inside $filter).
//
//---------------------------------------------------------------------------
//
//  Parsing Expression Grammar of Java for jsjavaparser
//   Copyright (C) 2006, 2009, 2010, 2011, 2013
//   by Roman R Redziejowski(www.romanredz.se).
//
//  The author gives unlimited permission to copy and distribute
//  this file, with or without modifications, as long as this notice
//  is preserved, and any changes are properly documented.
//
//  This file is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
//---------------------------------------------------------------------------

{
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
}

/* ---- Syntactic Grammar ----- */

Start = Expression

LambdaExpression
	= args:Identifier __ COLON __ expr:LogicalOrExpression
    {
    	return {
			  type: 'LambdaExpression',
        arguments: [args],
        expression: expr
      }
    }

Expression
    = LogicalOrExpression

LogicalOrExpression
    = first:LogicalAndExpression rest:((OROR __) LogicalAndExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'LogicalExpression',
          operator: '||',
          left:  result,
          right: element[1]
        };
      });
    }

LogicalAndExpression
    = first:EqualityExpression rest:((ANDAND __) EqualityExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'LogicalExpression',
          operator: '&&',
          left: result,
          right: element[1]
        };
      });
    }

EqualityExpression
    = first:RelationalExpression rest:((EQUAL __ /  NOTEQUAL __) RelationalExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        let map = { 'eq': '==', 'ne': '!=' }
        
        return {
          type: 'RelationalExpression',
          operator: map[element[0][0].toLowerCase()],
          left:  result,
          right: element[1]
        };
      });
    }

RelationalExpression
    = first:InExpression rest:((LE __ / GE __ / LT __ / GT __) InExpression )*
    {
      return buildTree(first, rest, function(result, element) {
      	let map = { 'le': '<=', 'ge': '>=', 'lt': '<', 'gt': '>' }
  
        return {
          type: 'RelationalExpression',
          operator: map[element[0][0].toLowerCase()],
          left:  result,
          right: element[1]
        };
      });
    }

InExpression 
    = first:AdditiveExpression rest:(('IN'i __) AdditiveExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'RelationalExpression',
          operator: 'in',
          left:  result,
          right: element[1]
        };
      });
    }

AdditiveExpression
    = first:MultiplicativeExpression rest:((ADD __ / SUB __) MultiplicativeExpression)*
    {
      return buildTree(first, rest, function(result, element) {
      	let map = { 'add': '+', 'sub': '-' }
      
        return {
          type: 'BinaryExpression',
          operator: map[element[0][0].toLowerCase()],
          left:  result,
          right: element[1]
        };
      });
    }

MultiplicativeExpression
    = first:UnaryExpression rest:((MUL __ / DIV __ / MOD __) UnaryExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        let map = { 'mul': '*', 'div': '/', 'mod': '%' }
        
        return {
          type: 'BinaryExpression',
          operator: map[element[0][0].toLowerCase()],
          left:  result,
          right: element[1]
        };
      });
    }

UnaryExpression
    = operator:PrefixOp operand:Primary
    {
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
    }
    / Primary

Primary
    = ParExpression
    / DateTimeLiteral
    / DateLiteral
    / QualifiedIdentifier
    / Literal
    
ParExpression
    = LPAR __ expr:Expression RPAR __
    { return expr; }

QualifiedIdentifier
    = !ReservedWord qual:Identifier args:Arguments
    { 
      return {
      	type: 'CallExpression', 
        object: qual,
        arguments: args
      };
    }
    / !ReservedWord qual:Identifier LBRK __ expr:Expression RBRK __
    { 
      return { 
    	type: 'ArrayExpression', 
        array: qual, 
        index: expr 
      };
    }
    / !ReservedWord first:Identifier list:(DOT i:QualifiedIdentifier { return i; })?
    { 
      if(list) {
        return {
          type: 'MemberExpression',
          object: first,
          property: list
        }
      }
      return first;
    }
    
PrefixOp
    = op:(
      NOT __
    / PLUS __
    / MINUS __
    ) 
    { 
    	let map = { 'not': '!', '+': '+', '-': '-' }
    	return map[op[0].toLowerCase()]; 
    }

Arguments
    = LPAR __ args:(first:(LambdaExpression / Expression) rest:((COMMA __) (LambdaExpression / Expression))* { return buildList(first, rest, 1); })? RPAR __
    { return args || []; }

VariableInitializer
    = Expression

Dim
    = LBRK __ RBRK __

DimExpr
    = LBRK __ exp:Expression RBRK __
    { return exp; }

/* ---- Lexical Structure ----- */

__
    = ( 
      [ \t\r\n\u000C]+          // WhiteSpace
      )* ;

Identifier
    = first:Letter last:LetterOrDigit* __
    { return { type: 'Identifier', name: first + last.join('') }; }

Letter = [a-z] / [A-Z] / [_$] ;

LetterOrDigit = [a-z] / [A-Z] / [0-9] / [_$] ;

Literal
    = literal:(
      FloatLiteral
      / IntegerLiteral          // May be a prefix of FloatLiteral
      / StringLiteral
      / ArrayLiteral
      / "true"  !LetterOrDigit
      { return { type: 'BooleanLiteral', value: true }; }
      / "false" !LetterOrDigit
      { return { type: 'BooleanLiteral', value: false }; }
      / "null"  !LetterOrDigit
      { return { type: 'NullLiteral' }; }
      ) __
    { return literal; }

IntegerLiteral
    = ( HexNumeral
      / BinaryNumeral
      / OctalNumeral            // May be a prefix of HexNumeral or BinaryNumeral
      / DecimalNumeral          // May be a prefix of OctalNumeral
      ) [lL]?
    { return { type: 'NumberLiteral', value: text() }; }

DecimalNumeral
    = "0"
    / [1-9]([_]*[0-9])*

HexNumeral
    = ("0x" / "0X") HexDigits

BinaryNumeral
    = ("0b" / "0B") [01]([_]*[01])*

OctalNumeral
    = "0" ([_]*[0-7])+

DateTimeLiteral
	= value:([0-9][0-9][0-9][0-9] "-" [0-9][0-9] "-" [0-9][0-9] ("T" [0-9][0-9] ":" [0-9][0-9] (":" [0-9][0-9] ("." [0-9]*)?)?) "Z"?) __
    { return { type: 'DateTimeLiteral', value: flattenArray(value).join('') }; }
    / first:"datetime"i "\'" value:([0-9][0-9][0-9][0-9] "-" [0-9][0-9] "-" [0-9][0-9] ("T" [0-9][0-9] ":" [0-9][0-9] (":" [0-9][0-9] ("." [0-9]*)?)?)? "Z"?) last:"\'" __
    { return { type: 'DateTimeLiteral', value: flattenArray(value).join('') }; }

DateLiteral
	= value:([0-9][0-9][0-9][0-9] "-" [0-9][0-9] "-" [0-9][0-9] "Z"?) __
    { return { type: 'DateLiteral', value: flattenArray(value).join('') }; }
    / first:"date"i "\'" value:([0-9][0-9][0-9][0-9] "-" [0-9][0-9] "-" [0-9][0-9] "Z"?) last:"\'" __
    { return { type: 'DateLiteral', value: flattenArray(value).join('') }; }

FloatLiteral
    = ( HexFloat / DecimalFloat )
    { return { type: 'NumberLiteral', value: text() }; }

DecimalFloat
    = Digits "." Digits?  Exponent? [fFdD]?
    / "." Digits Exponent? [fFdD]?
    / Digits Exponent [fFdD]?
    / Digits Exponent? [fFdD]

Exponent
    = [eE] [+\-]? Digits

HexFloat
    = HexSignificand BinaryExponent [fFdD]?

HexSignificand
    = ("0x" / "0X") HexDigits? "." HexDigits
    / HexNumeral "."?                           // May be a prefix of above

BinaryExponent
    = [pP] [+\-]? Digits

Digits
    = [0-9]([_]*[0-9])*

HexDigits
    = HexDigit ([_]*HexDigit)*

HexDigit
    = [a-f] / [A-F] / [0-9]

StringLiteral
    = "'" chars:(Escape / !['\n\r] . )* "'"                   
    { return { type: 'Literal', value: chars.map(l => l[0] || l[1]).join('') } }

ArrayLiteral
    = LPAR __ elements:(first:Expression rest:(COMMA __ Expression)* { return buildList(first, rest, 2)})? (COMMA __)? __ RPAR __
    { return { type: 'ArrayLiteral', elements: elements } }

Escape
    = "''" 
    / "\\"
    / "\\" ([btnfr"'\\] / OctalEscape / UnicodeEscape)

OctalEscape
    = [0-3][0-7][0-7]
    / [0-7][0-7]
    / [0-7]

UnicodeEscape
    = "u"+ HexDigit HexDigit HexDigit HexDigit

ReservedWord
	= "true" !LetterOrDigit
    / "false" !LetterOrDigit
    / "null" !LetterOrDigit
    
/* ---- Separators, Operators ----- */

ADD             =   "add"i
ANDAND          =   "and"i
COLON           =   ":"
COMMA           =   ","
DIV             =   "div"i
DOT             =   "/"
EQUAL           =   "eq"i
GE              =   "ge"i
GT              =   "gt"i
HYPHEN          =   "-"
LBRK            =   "["
LE              =   "le"i
LPAR            =   "("
LT              =   "lt"i
MINUS           =   "-"
MOD             =   "mod"i
NOTEQUAL        =   "ne"i
NOT             =   "not"i
OROR            =   "or"i
PLUS            =   "+"
RBRK            =   "]"
RPAR            =   ")"
SUB             =   "sub"i
MUL             =   "mul"i
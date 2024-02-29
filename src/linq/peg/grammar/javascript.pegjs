//===========================================================================
//  Javascript Expression Grammar
//   by Nicolai Gjærum
// 
//  This grammar is based on "Parsing Expression Grammar of Java" by Roman R
//  Redziejowski. It is heavily modified and stripped down to support Javascript
//  expressions only
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
}

/* ---- Syntactic Grammar ----- */

Start = ArrowExpression

ArrowExpression
	= args:Identifier __ ARROW __ expr:Expression
    {
    	return {
        	type: 'LambdaExpression',
          	arguments: [args],
          	expression: expr
        }
    }
    / LPAR __ RPAR __ ARROW __ expr:Expression
    {
    	return {
        	type: 'LambdaExpression',
          	arguments: [],
          	expression: expr
        }
    }
	/ LPAR args:(first:Identifier rest:((COMMA __) Identifier)* { return buildList(first, rest, 1); }) RPAR __ ARROW __ expr:ConditionalExpression
    {
    	return {
        	type: 'LambdaExpression',
          	arguments: args,
          	expression: expr
        }
    }
    / Expression

Expression
    = ConditionalExpression

ConditionalExpression
    = test:LogicalOrExpression __ QMARK __ left:ConditionalExpression __ COLON __ right:ConditionalExpression
      {
    	return { 
        	type: 'ConditionalExpression',
            test: test,
            left: left,
            right: right
        }
      }
      / LogicalOrExpression

LogicalOrExpression
    = first:LogicalAndExpression rest:((OROR __) LogicalAndExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'LogicalExpression',
          operator: element[0][0].toLowerCase(),
          left: result,
          right: element[1]
        };
      });
    }

LogicalAndExpression
    = first:BitwiseOrExpression rest:((ANDAND __) BitwiseOrExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'LogicalExpression',
          operator: element[0][0].toLowerCase(),
          left:  result,
          right: element[1]
        };
      });
    }
    
BitwiseOrExpression
	= first: BitwiseXOrExpression rest:((OR __) BitwiseXOrExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'BitwiseExpression',
          operator: element[0][0].toLowerCase(),
          left:  result,
          right: element[1]
        };
      });
    }
    
BitwiseXOrExpression
	= first: BitwiseAndExpression rest:((XOR __) BitwiseAndExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'BitwiseExpression',
          operator: element[0][0].toLowerCase(),
          left:  result,
          right: element[1]
        };
      });
    }
    
BitwiseAndExpression
	= first: EqualityExpression rest:((AND __) EqualityExpression)*
	{
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'BitwiseExpression',
          operator: element[0][0].toLowerCase(),
          left:  result,
          right: element[1]
        };
      });
    }
    
EqualityExpression
    = first:RelationalExpression rest:((EQUAL __ / EQUALSTRICT __ / NOTEQUAL __ / NOTEQUALSTRICT __) RelationalExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'RelationalExpression',
          operator: element[0][0],
          left:  result,
          right: element[1]
        };
      });
    }

RelationalExpression
    = first:ShiftExpression rest:((LE __ / GE __ / LT __ / GT __) ShiftExpression )*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'RelationalExpression',
          operator: element[0][0].toLowerCase(),
          left:  result,
          right: element[1]
        };
      });
    }
    
ShiftExpression
	= first:AdditiveExpression rest:((RSHIFTZEROFILL __ / LSHIFT __ / RSHIFT __) AdditiveExpression )*
	{
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'ShiftExpression',
          operator: element[0][0].toLowerCase(),
          left:  result,
          right: element[1]
        };
      });
    }
    
AdditiveExpression
    = first:MultiplicativeExpression rest:((ADD __ / SUB __) MultiplicativeExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'BinaryExpression',
          operator: element[0][0].toLowerCase(),
          left:  result,
          right: element[1]
        };
      });
    }

MultiplicativeExpression
    = first:UnaryExpression rest:((MUL __ / DIV __ / MOD __) UnaryExpression)*
    {
      return buildTree(first, rest, function(result, element) {
        return {
          type: 'BinaryExpression',
          operator: element[0][0].toLowerCase(),
          left:  result,
          right: element[1]
        };
      });
    }

UnaryExpression
    = operator:PrefixOp operand:PostfixExpression
    { return operand.type === 'NumberLiteral' && (operator === '-' || operator === '+')
        ? 
        { 
          type: 'NumberLiteral', 
          value: (operator === '-' ? operator : '') + operand.value
        }
        :
        (operator === '-' || operator === '+') && operand.type === 'PostfixExpression' && operand.argument.type === 'NumberLiteral'
        ?
        Object.assign(operand, {argument: { 
        	type: 'NumberLiteral',
            value: (operator === '-' ? operator : '') + operand.argument.value
      	}})
        :
        {
          type: 'UnaryExpression', 
          operator: operator, 
          argument:  operand
        };
    }
    / PostfixExpression
    
PostfixExpression
    = operand:Primary operator:(INCREMENT / DECREMENT)? __
    { return operator 
		? 
        {
        	type: 'PostfixExpression',
            operator: operator,
            argument: operand
        }
        :
        operand
    }

Primary
    = ParExpression
    / QualifiedIdentifier
    / TemplateLiteral
    / Literal

ParExpression
    = LPAR __ expr:Expression RPAR __
    { return expr; }

QualifiedIdentifier
    = !ReservedWord left:(ArrayLiteral / Identifier) DOT 'includes' LPAR __ right:(Primary) __ RPAR
    { 
    	return {
        	type: 'RelationalExpression',
            operator: 'in',
            left: left,
            right: right
        }
    }    
    / !ReservedWord qual:Identifier args:Arguments
    { 
      return {
      	type: 'CallExpression', 
        object: qual,
        arguments: args
      };
    }    
    / !ReservedWord qual:(Identifier / Literal) LBRK __ expr:Expression RBRK __
    { 
      return { 
    	type: 'ArrayExpression',
        object: qual,
        index: expr
      };
    }
    / !ReservedWord first:(Identifier / StringLiteral / TemplateLiteral) rest:(DOT QualifiedIdentifier)*
    {
       return buildTree(first, rest, function(result, element) {
        return {
          type: 'MemberExpression',
          object:  result,
          property: element[1]
        };
      });
    }
    / !ReservedWord Identifier
        
PrefixOp
    = op:(
      NOT
    / INCREMENT __
    / DECREMENT __
    / PLUS __
    / MINUS __
    / BNOT __
    ) { return op[0].toLowerCase(); }

Arguments
    = LPAR __ args:(first:(ArrowExpression / Expression) rest:((COMMA __) (ArrowExpression / Expression))* { return buildList(first, rest, 1); })? RPAR __
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

TemplateLiteral
	= "\`" capture:(  TemplateExpression / Escape / "\\$" ![{] . / "$" ![{] . / "\\${" . / "$\\{" . / "\\$\\{" . / ![$`\\] . )* "\`"                   
    { return { 
        type: 'TemplateLiteral', 
        values: capture.reduce((r, v) => {
            if(Array.isArray(v)) {
            	if(typeof(r[r.length - 1]) != 'string')
                	r.push('')  
            	r[r.length - 1] += v[0] == undefined ? v[1] : v[0] + (v[1] == undefined ? v[2] : v[1])
            } else {
            	r.push(v);
            }
            return r;
        }, []).map(v => typeof v == 'string' ? { type: 'Literal', value: v } : v )
      }
    }

TemplateExpression
	= "$" LCBRK __ expression:(Expression) RCBRK
    { return {
    	type: 'TemplateExpression',
        value: expression
      }
    }

Literal
    = literal:( 
      ObjectLiteral
      / FloatLiteral
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

ObjectLiteral
	= LCBRK __ properties:(first:ObjectProperty rest:(COMMA __ ObjectProperty)* { return buildList(first, rest, 2)})? (COMMA __)? __ RCBRK __
    { return { type: 'ObjectLiteral', properties: properties } }
    
ObjectProperty 
	= __ key:(Identifier / IntegerLiteral / StringLiteral) __ ":" __ value:(Expression) __
    { return { type: 'Property', key: key, value: value} }

ArrayLiteral
	= LBRK __ elements:(first:Expression rest:(COMMA __ Expression)* { return buildList(first, rest, 2)})? (COMMA __)? __ RBRK __
    { return { type: 'ArrayLiteral', elements: elements } }

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
    = "\'" chars:(Escape / !['\\\n\r] . )* "\'"
    { return { type: 'Literal', value: chars.map(l => l[0] == undefined ? l[1] : l[0] + l[1]).join('') } }
    / "\"" chars:(Escape / !["\\\n\r] . )* "\""
    { return { type: 'Literal', value: chars.map(l => l[0] == undefined ? l[1] : l[0] + l[1]).join('') } }

Escape
    = "\\" ([btnfr"'`\\] / OctalEscape / UnicodeEscape)

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

ARROW	       		=   "=>"i
ADD             =   "+"i
AND             =   "&"i
ANDAND          =   "&&"i
COLON           =   ":"
COMMA           =   ","
DIV             =   "/"i
DOT             =   "."
EQUAL           =   "=="i
EQUALSTRICT     =   "==="i
GE              =   ">="i
GT              =   ">"i
HYPHEN          =   "-"
LBRK            =   "["
LCBRK           =   "{"
LE              =   "<="i
LPAR            =   "("
LT              =   "<"i
LSHIFT          =   "<<"i
RSHIFT          =   ">>"i
RSHIFTZEROFILL	=   ">>>"i
MINUS           =   "-"
MOD             =   "%"i
NOTEQUAL        =   "!="i
NOTEQUALSTRICT  =   "!=="i
NOT             =   "!"i
BNOT            =   "~"i
OR              =   "|"i
OROR            =   "||"i
XOR             =   "^"i
PLUS            =   "+"
INCREMENT       =   "++"
DECREMENT       =   "--"
RBRK            =   "]"
RCBRK           =   "}"
RPAR            =   ")"
SUB             =   "-"i
MUL             =   "*"i
QMARK           =   "?"i
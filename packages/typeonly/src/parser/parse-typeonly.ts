import antlr4, { CommonTokenStream, InputStream, type Recognizer } from "antlr4";
import AstExtractor from "./AstExtractor.js";

const TypeOnlyLexer = (await import("../../antlr-parser/TypeOnlyLexer.js" as string)).default;
const TypeOnlyParser = (await import("../../antlr-parser/TypeOnlyParser.js" as string)).default;

export function parseTypeOnlyToAst(source: string) {
  const chars = new InputStream(source);
  const lexer = new TypeOnlyLexer(chars);
  const tokenStream = new CommonTokenStream(lexer);
  const parser = new TypeOnlyParser(tokenStream);

  parser.buildParseTrees = true;

  // console.log(debugTokensToText(tokenStream.tokens))
  // function debugTokensToText(tokens) {
  //   if (!tokens)
  //     return "-no-tokens-"
  //   return tokens.map(({ tokenIndex, type, start, stop }) => {
  //     return `[${tokenIndex}] ${type}: ${source.substring(start, stop + 1).replace(/\n/g, "\u23ce")}`
  //   }).join("\n")
  // }

  const errors: string[] = [];
  const errorListener = {
    syntaxError(
      _recognizer: any,
      _offendingSymbol: any,
      line: number,
      column: number,
      msg: string,
      _e: any,
    ) {
      errors.push(`Syntax error at line ${line}:${column}, ${msg}`);
    },

    reportAmbiguity(
      _recognizer: Recognizer<any>,
      _dfa: any,
      _startIndex: number,
      _stopIndex: number,
      _exact: boolean,
      _ambigAlts: any,
      _configs: any,
    ) {},

    reportAttemptingFullContext(
      _recognizer: Recognizer<any>,
      _dfa: any,
      _startIndex: number,
      _stopIndex: number,
      _conflictingAlts: any,
      _configs: any,
    ) {},

    reportContextSensitivity(
      _recognizer: Recognizer<any>,
      _dfa: any,
      _startIndex: number,
      _stopIndex: number,
      _prediction: number,
      _configs: any,
    ) {},
  };
  lexer.removeErrorListeners();
  lexer.addErrorListener(errorListener);
  parser.removeErrorListeners();
  parser.addErrorListener(errorListener);

  const treeRoot = parser.declarations();

  if (errors.length > 0) throw new Error(errors.join("\n"));

  const extractor = new AstExtractor({
    source,
    tokenStream,
    tokenTypes: {
      SEMICOLON: TypeOnlyParser.SEMI_COLON,
      COMMA: TypeOnlyParser.COMMA,
      MULTILINE_COMMENT: TypeOnlyParser.MULTILINE_COMMENT,
      SINGLE_LINE_COMMENT: TypeOnlyParser.SINGLE_LINE_COMMENT,
      NEWLINE: TypeOnlyParser.NL,
    },
  });

  (antlr4 as any).tree.ParseTreeWalker.DEFAULT.walk(extractor, treeRoot);

  if (!extractor.ast) throw new Error("missing AST");

  return extractor.ast;
}

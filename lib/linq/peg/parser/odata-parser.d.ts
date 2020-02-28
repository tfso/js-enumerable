declare let parser: {
    SyntaxError: (message: any, expected: any, found: any, location: any) => void;
    parse: (input: any, options?: any) => any;
};
export default parser;

import * as fs from 'fs';
import * as ts from 'typescript';

import { Comment, ImportElement, ImportNode, ParsedImportValues } from './models/models-public';

export interface AstParser {
    parseImports(fullFilePath: string, _sourceText?: string): ParsedImportValues;
}

export class SimpleImportAstParser implements AstParser {

    public parseImports(fullFilePath: string, _sourceText?: string): ParsedImportValues {
        if (_sourceText !== null && _sourceText !== undefined && _sourceText.trim() === '') {
            return { importElements: [], usedTypeReferences: [] };
        }
        const sourceText = _sourceText || fs.readFileSync(fullFilePath).toString();
        const sourceFile = this.createSourceFile(fullFilePath, sourceText);
        const importsAndTypes = this.delintImportsAndTypes(sourceFile, sourceText);
        return {
            importElements: importsAndTypes.importNodes.map(x => this.parseImport(x, sourceFile)).filter(x => x !== null),
            usedTypeReferences: importsAndTypes.usedTypeReferences
        };
    }

    private createSourceFile(fullFilePath: string, sourceText: string) {
        return ts.createSourceFile(fullFilePath, sourceText, ts.ScriptTarget.Latest, false);
    }

    private delintImportsAndTypes(sourceFile: ts.SourceFile, sourceText?: string): { importNodes: ImportNode[], usedTypeReferences: string[] } {
        const importNodes: ImportNode[] = [];
        const usedTypeReferences: string[] = [];
        const sourceFileText = sourceText || sourceFile.getText();
        const delintNode = (node: ts.Node) => {
            let isSkipChildNode = false;
            switch (node.kind) {
                case ts.SyntaxKind.ImportDeclaration:
                    const lines = this.getCodeLineNumbers(node, sourceFile);
                    importNodes.push({
                        importDeclaration: (node as ts.ImportDeclaration),
                        start: lines.importStartLine,
                        end: lines.importEndLine,
                        importComment: this.getComments(sourceFileText, node)
                    });
                    this.getCodeLineNumbers(node, sourceFile);
                    //if we get import declaration then we do not want to do further delinting on the children of the node
                    isSkipChildNode = true;
                    break;
                case ts.SyntaxKind.Identifier:
                    //adding all identifiers(except from the ImportDeclarations). This is quite verbose, but seems to do the trick.
                    usedTypeReferences.push((node as ts.Identifier).getText(sourceFile));
                    break;
                default:
                    break;
            }
            if (!isSkipChildNode) {
                ts.forEachChild(node, delintNode);
            }
        };
        delintNode(sourceFile);
        return { importNodes, usedTypeReferences };
    }

    private getComments(sourceFileText: string, node: ts.Node) {
        const leadingComments = (ts.getLeadingCommentRanges(sourceFileText, node.getFullStart()) || [])
            .map(range => this.getComment(range, sourceFileText));
        const trailingComments = (ts.getTrailingCommentRanges(sourceFileText, node.getEnd()) || [])
            .map(range => this.getComment(range, sourceFileText));
        return { leadingComments, trailingComments };
    }

    private getComment(range: ts.CommentRange, sourceFileText: string) {
        const text = sourceFileText.slice(range.pos, range.end).replace(/\r/g, '');
        const comment: Comment = {
            range,
            text,
            isTripleSlashDirective: text.match(/\/\/\/\s?</g) != null
        };
        return comment;
    }

    private getCodeLineNumbers(node: ts.Node, sourceFile: ts.SourceFile) {
        const importStartLine = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
        const importEndLine = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
        return { importStartLine: importStartLine, importEndLine: importEndLine };
    }

    private parseImport(importNode: ImportNode, sourceFile: ts.SourceFile): ImportElement {
        const moduleSpecifierName = importNode.importDeclaration.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral
            ? (importNode.importDeclaration.moduleSpecifier as ts.StringLiteral).text
            : importNode.importDeclaration.moduleSpecifier.getFullText(sourceFile).trim();
        const result: ImportElement = {
            moduleSpecifierName: moduleSpecifierName,
            startPosition: importNode.start,
            endPosition: importNode.end,
            hasFromKeyWord: false,
            namedBindings: [],
            importComment: importNode.importComment
        };

        const importClause = importNode.importDeclaration.importClause;
        if (!importClause) {
            return result;
        }
        if (importClause.name) {
            result.hasFromKeyWord = true;
            result.defaultImportName = importClause.name.text;
        }
        if (!importClause.namedBindings) {
            return result;
        }
        result.hasFromKeyWord = true;

        if (importClause.namedBindings.kind === ts.SyntaxKind.NamespaceImport) {
            const nsImport = importClause.namedBindings as ts.NamespaceImport;
            result.namedBindings.push({ aliasName: nsImport.name.text, name: '*' });
            return result;
        }

        if (importClause.namedBindings.kind === ts.SyntaxKind.NamedImports) {
            const nImport = importClause.namedBindings as ts.NamedImports;
            nImport.elements.forEach(y => {
                const propertyName = y.propertyName ? y.propertyName.text : y.name.text;
                const aliasName = !y.propertyName ? null : y.name.text;
                result.namedBindings.push({ aliasName: aliasName, name: propertyName });
            });
            return result;
        }
        console.warn('unsupported import: ', JSON.stringify(importClause));
        return null;
    }
}
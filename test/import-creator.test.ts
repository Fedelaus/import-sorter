import 'mocha';
import * as expect from 'expect.js';
import { ImportCreator, ImportElementGroup, ImportStringConfiguration } from '../src/core';

interface ImportCreatorTest {
    testName: string;
    config: ImportStringConfiguration;
    elementGroups: ImportElementGroup[];
    expected: string;
}

suite('Import Creator Tests', () => {

    const testCases: ImportCreatorTest[] = [
        {
            testName: 'test0',
            config: {
                tabSize: 4,
                numberOfEmptyLinesAfterAllImports: 0,
                quoteMark: 'single',
                trailingComma: 'none',
                maximumNumberOfImportExpressionsPerLine: {
                    count: 23,
                    type: 'maxLineLength'
                },
                spacingPerImportExpression: {
                    afterStartingBracket: 1,
                    beforeEndingBracket: 1,
                    beforeComma: 0,
                    afterComma: 1
                }
            },
            elementGroups: [
                {
                    elements: [
                        {
                            moduleSpecifierName: 'createString.ts',
                            startPosition: { line: 0, character: 0 },
                            endPosition: { line: 0, character: 53 },
                            hasFromKeyWord: true,
                            defaultImportName: 't',
                            namedBindings: [
                                { name: 'B', aliasName: null },
                                { name: 'a', aliasName: 'cc' },
                                { name: 'ac', aliasName: null }
                            ]
                        }],
                    numberOfEmptyLinesAfterGroup: 3
                }
            ],
            expected: "import t, {\n    B, a as cc, ac\n} from \'createString.ts\';"
        },
        {
            testName: 'test1 - trailing comma',
            config: {
                tabSize: 4,
                numberOfEmptyLinesAfterAllImports: 0,
                quoteMark: 'single',
                trailingComma: 'none',
                maximumNumberOfImportExpressionsPerLine: {
                    count: 70,
                    type: 'maxLineLength'
                },
                spacingPerImportExpression: {
                    afterStartingBracket: 1,
                    beforeEndingBracket: 1,
                    beforeComma: 0,
                    afterComma: 1
                }
            },
            elementGroups: [
                {
                    elements: [
                        {
                            moduleSpecifierName: '@angular/core',
                            startPosition: { line: 0, character: 0 },
                            endPosition: { line: 0, character: 70 },
                            hasFromKeyWord: true,
                            namedBindings: [
                                { name: 'ChangeDetectionStrategy', aliasName: null },
                                { name: 'DebugElement', aliasName: null }
                            ]
                        }],
                    numberOfEmptyLinesAfterGroup: 0
                }
            ],
            expected: "import { ChangeDetectionStrategy, DebugElement } from '@angular/core';"
        },
        {
            testName: 'test2 - trailing comma',
            config: {
                tabSize: 4,
                numberOfEmptyLinesAfterAllImports: 0,
                quoteMark: 'single',
                trailingComma: 'none',
                maximumNumberOfImportExpressionsPerLine: {
                    count: 69,
                    type: 'maxLineLength'
                },
                spacingPerImportExpression: {
                    afterStartingBracket: 1,
                    beforeEndingBracket: 1,
                    beforeComma: 0,
                    afterComma: 1
                }
            },
            elementGroups: [
                {
                    elements: [
                        {
                            moduleSpecifierName: '@angular/core',
                            startPosition: { line: 0, character: 0 },
                            endPosition: { line: 0, character: 70 },
                            hasFromKeyWord: true,
                            namedBindings: [
                                { name: 'ChangeDetectionStrategy', aliasName: null },
                                { name: 'DebugElement', aliasName: null }
                            ]
                        }],
                    numberOfEmptyLinesAfterGroup: 0
                }
            ],
            expected: "import {\n    ChangeDetectionStrategy, DebugElement\n} from \'@angular/core\';"
        },
        {
            testName: 'test3 - trailing comma',
            config: {
                tabSize: 4,
                numberOfEmptyLinesAfterAllImports: 0,
                quoteMark: 'single',
                trailingComma: 'always',
                maximumNumberOfImportExpressionsPerLine: {
                    count: 71,
                    type: 'maxLineLength'
                },
                spacingPerImportExpression: {
                    afterStartingBracket: 1,
                    beforeEndingBracket: 1,
                    beforeComma: 0,
                    afterComma: 1
                }
            },
            elementGroups: [
                {
                    elements: [
                        {
                            moduleSpecifierName: '@angular/core',
                            startPosition: { line: 0, character: 0 },
                            endPosition: { line: 0, character: 70 },
                            hasFromKeyWord: true,
                            namedBindings: [
                                { name: 'ChangeDetectionStrategy', aliasName: null },
                                { name: 'DebugElement', aliasName: null }
                            ]
                        }],
                    numberOfEmptyLinesAfterGroup: 0
                }
            ],
            expected: "import { ChangeDetectionStrategy, DebugElement, } from '@angular/core';"
        },
        {
            testName: 'test4 - trailing comma',
            config: {
                tabSize: 4,
                numberOfEmptyLinesAfterAllImports: 0,
                quoteMark: 'single',
                trailingComma: 'always',
                maximumNumberOfImportExpressionsPerLine: {
                    count: 70,
                    type: 'maxLineLength'
                },
                spacingPerImportExpression: {
                    afterStartingBracket: 1,
                    beforeEndingBracket: 1,
                    beforeComma: 0,
                    afterComma: 1
                }
            },
            elementGroups: [
                {
                    elements: [
                        {
                            moduleSpecifierName: '@angular/core',
                            startPosition: { line: 0, character: 0 },
                            endPosition: { line: 0, character: 70 },
                            hasFromKeyWord: true,
                            namedBindings: [
                                { name: 'ChangeDetectionStrategy', aliasName: null },
                                { name: 'DebugElement', aliasName: null }
                            ]
                        }],
                    numberOfEmptyLinesAfterGroup: 0
                }
            ],
            expected: "import {\n    ChangeDetectionStrategy, DebugElement,\n} from \'@angular/core\';"
        },
        {
            testName: 'test5 - trailing comma',
            config: {
                tabSize: 4,
                numberOfEmptyLinesAfterAllImports: 0,
                quoteMark: 'single',
                trailingComma: 'multiLine',
                maximumNumberOfImportExpressionsPerLine: {
                    count: 70,
                    type: 'maxLineLength'
                },
                spacingPerImportExpression: {
                    afterStartingBracket: 1,
                    beforeEndingBracket: 1,
                    beforeComma: 0,
                    afterComma: 1
                }
            },
            elementGroups: [
                {
                    elements: [
                        {
                            moduleSpecifierName: '@angular/core',
                            startPosition: { line: 0, character: 0 },
                            endPosition: { line: 0, character: 70 },
                            hasFromKeyWord: true,
                            namedBindings: [
                                { name: 'ChangeDetectionStrategy', aliasName: null },
                                { name: 'DebugElement', aliasName: null }
                            ]
                        }],
                    numberOfEmptyLinesAfterGroup: 0
                }
            ],
            expected: "import { ChangeDetectionStrategy, DebugElement } from '@angular/core';"
        },
        {
            testName: 'test6 - trailing comma',
            config: {
                tabSize: 4,
                numberOfEmptyLinesAfterAllImports: 0,
                quoteMark: 'single',
                trailingComma: 'multiLine',
                maximumNumberOfImportExpressionsPerLine: {
                    count: 69,
                    type: 'maxLineLength'
                },
                spacingPerImportExpression: {
                    afterStartingBracket: 1,
                    beforeEndingBracket: 1,
                    beforeComma: 0,
                    afterComma: 1
                }
            },
            elementGroups: [
                {
                    elements: [
                        {
                            moduleSpecifierName: '@angular/core',
                            startPosition: { line: 0, character: 0 },
                            endPosition: { line: 0, character: 70 },
                            hasFromKeyWord: true,
                            namedBindings: [
                                { name: 'ChangeDetectionStrategy', aliasName: null },
                                { name: 'DebugElement', aliasName: null }
                            ]
                        }],
                    numberOfEmptyLinesAfterGroup: 0
                }
            ],
            expected: "import {\n    ChangeDetectionStrategy, DebugElement,\n} from \'@angular/core\';"
        },
    ];

    const getImportText = (groups: ImportElementGroup[], config: ImportStringConfiguration) => {
        const creator = new ImportCreator();
        creator.initialise(config);
        return creator.createImportText(groups);
    };

    const importCreatorTest = (testName, config, groups, expected) => {
        test(`ImportCreator : ${testName} produces correct string`, () => {
            const importText = getImportText(groups, config);
            expect(importText).to.eql(expected);
        });
    };

    testCases.forEach(testElement => {
        importCreatorTest(testElement.testName, testElement.config, testElement.elementGroups, testElement.expected);
    });
});
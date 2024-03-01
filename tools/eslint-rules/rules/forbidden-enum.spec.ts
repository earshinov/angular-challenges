import { TSESLint } from '@typescript-eslint/utils';
import { rule, RULE_NAME } from './forbidden-enum';

const ruleTester = new TSESLint.RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run(RULE_NAME, rule, {
  valid: [],
  invalid: [
    {
      code: 'enum Test { A, B }',
      output: 'type Test = "A" | "B";',
      errors: [{ messageId: 'prefer-union-type' }],
    },
    {
      code: 'enum NumberEnum { A = 1, B = 2 }',
      output: 'type NumberEnum = "A" | "B";',
      errors: [{ messageId: 'prefer-union-type' }],
    },
    {
      code: 'enum StringEnum { A = "A", B = "B" }',
      output: 'type StringEnum = "A" | "B";',
      errors: [{ messageId: 'prefer-union-type' }],
    },
    {
      code: 'const enum ConstEnum { A = 1, B = 2 }',
      output: 'type ConstEnum = "A" | "B";',
      errors: [{ messageId: 'prefer-union-type' }],
    },
  ],
});

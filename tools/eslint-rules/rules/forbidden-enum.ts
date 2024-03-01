/**
 * This file sets you up with structure needed for an ESLint rule.
 *
 * It leverages utilities from @typescript-eslint to allow TypeScript to
 * provide autocompletions etc for the configuration.
 *
 * Your rule's custom logic will live within the create() method below
 * and you can learn more about writing ESLint rules on the official guide:
 *
 * https://eslint.org/docs/developer-guide/working-with-rules
 *
 * You can also view many examples of existing rules here:
 *
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/rules
 */

import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils';

// NOTE: The rule will be available in ESLint configs as "@nx/workspace/forbidden-enum"
export const RULE_NAME = 'forbidden-enum';

const MESSAGES = {
  'prefer-union-type': 'Prefer union types to enums',
} as const;

export const rule = ESLintUtils.RuleCreator(() => __filename)<
  [],
  keyof typeof MESSAGES
>({
  name: RULE_NAME,
  meta: {
    type: 'problem',
    docs: {
      description: ``,
      recommended: 'recommended',
    },
    schema: [],
    messages: MESSAGES,
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      'TSEnumDeclaration:exit'(node) {
        context.report({
          node,
          messageId: 'prefer-union-type',
          fix(fixer) {
            const replacement = `type ${node.id.name} = ${node.members.map((member) => quote((member.id as TSESTree.Identifier).name)).join(' | ')};`;
            return [fixer.replaceText(node, replacement)];
          },
        });
      },
    };
  },
});

function quote(s: string): string {
  return `"${s}"`;
}

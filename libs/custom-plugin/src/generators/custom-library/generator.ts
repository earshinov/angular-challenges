import * as path from 'path';

import { libraryGenerator } from '@nx/angular/generators';
import { Schema } from '@nx/angular/src/generators/library/schema';
import { Tree, generateFiles, joinPathFragments } from '@nx/devkit';
import { updateOverrideInLintConfig } from '@nx/eslint/src/generators/utils/eslint-file';

export default async function generator(tree: Tree, options: Schema) {
  const libraryGenResponse = await libraryGenerator(tree, options);

  const projectName = options.name;
  const projectRoot = joinPathFragments('libs', projectName);

  // Add ESLint rule "@typescript-eslint/member-ordering": "off"
  if (options.linter === 'eslint')
    updateOverrideInLintConfig(
      tree,
      projectRoot,
      (override) =>
        (typeof override.files === 'string'
          ? [override.files]
          : override.files
        ).some((patterns) => patterns.includes('*.ts')),
      (json) => ({
        ...json,
        rules: {
          ...json.rules,
          '@typescript-eslint/member-ordering': 'off',
        },
      }),
    );

  if (options.unitTestRunner === 'jest') {
    const configFilename = joinPathFragments(projectRoot, 'jest.config.ts');

    generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
      name: options.name,
      relativeRoot: `../`.repeat(n_occurrences(configFilename, '/')),
    });
  }

  // Can contain (and actually contains) a callback to be called after the generator completes.
  // The actual callback runs package installation.
  return libraryGenResponse;
}

function n_occurrences(a: string, b: string): number {
  if (!b.length) return a.length;
  let n = 0;
  for (let pos = 0; (pos = a.indexOf(b, pos)) >= 0; pos += b.length, ++n);
  return n;
}

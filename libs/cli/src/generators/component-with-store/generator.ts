import { Tree, formatFiles, generateFiles } from '@nx/devkit';
import { join } from 'path';

import { Schema } from './schema';

const r = /_|-|(?=[A-Z])/g;

function capitalize(s: string): string {
  return s[0].toUpperCase() + s.substring(1);
}
function lowerCase(s: string[]): string {
  return s.join('_');
}
function dashedName(s: string[]): string {
  return s.join('-');
}
function snakeCase(s: string[]): string {
  return s[0] + pascalCase(s.slice(1));
}
function pascalCase(s: string[]): string {
  return s.map(capitalize).join('');
}

type Names<P extends string> = {
  [p in P as `${p}_${'pascal' | 'lower' | 'dashed' | 'snake'}`]: string;
};

function names<P extends string>(prefix: P, s: string | string[]): Names<P> {
  const ss = typeof s === 'string' ? s.split(r).map((s) => s.toLowerCase()) : s;
  return {
    [`${prefix}_pascal`]: pascalCase(ss),
    [`${prefix}_lower`]: lowerCase(ss),
    [`${prefix}_dashed`]: dashedName(ss),
    [`${prefix}_snake`]: snakeCase(ss),
  } as unknown as Names<P>;
}

function plural(s: string) {
  return `${s}s`;
}

export default async function (tree: Tree, options: Schema) {
  const {
    name = 'User',
    createService = true,
    inlineTemplate = false,
  } = options;

  const templateOptions = {
    tmpl: '',
    createService,
    inlineTemplate,
    ...names('name', name),
    ...names('name_plural', plural(name)),
  };

  generateFiles(tree, join(__dirname, 'files'), '.', templateOptions);
  if (inlineTemplate)
    tree.delete(`./${templateOptions.name_lower}.component.html`);
  if (!createService) tree.delete(`./${templateOptions.name_lower}.service.ts`);

  await formatFiles(tree);
}

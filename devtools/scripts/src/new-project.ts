import path from 'path';
import { execSync } from 'child_process';
import fse from 'fs-extra';
import handlebars from 'handlebars';
import { input, select } from '@inquirer/prompts';

const templateRootPath = './.template';

const rootPath = '../..';

function getAllTplFiles(dir: string): string[] {
  const files = fse.readdirSync(dir);
  const result = [];

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fse.statSync(filePath);

    if (stat.isDirectory()) {
      result.push(...getAllTplFiles(filePath));
    } else if (stat.isFile() && filePath.endsWith('.tpl')) {
      result.push(filePath);
    }
  });

  return result;
}

async function main() {
  const allCategory = fse
    .readdirSync(path.join(rootPath, 'packages'))
    .filter((dir) => fse.statSync(path.join(rootPath, 'packages', dir)).isDirectory());
  const choiceCategory = await select({
    message: 'Select the category of the library',
    choices: allCategory.map((category) => ({ name: category, value: category })),
  });
  const projectName = await input({ message: 'Input the name of the library' });

  if (!projectName) {
    console.error('The name of the library cannot be empty');
    process.exit(1);
  }

  const projectPath = path.join(rootPath, 'packages', choiceCategory, projectName);

  fse.ensureDirSync(projectPath);

  const allTemplates = getAllTplFiles(templateRootPath);

  await Promise.all(
    allTemplates.map(async (tplPath) => {
      const targetPath = path.join(projectPath, path.relative(templateRootPath, tplPath).replace(/\.tpl$/, ''));

      await fse.ensureDir(path.dirname(targetPath));

      const content = await fse.readFile(tplPath, 'utf-8');

      try {
        const fileContent = handlebars.compile(content, { noEscape: true })({
          projectCategory: choiceCategory,
          projectName,
        });

        await fse.writeFile(targetPath, fileContent);
      } catch (e) {
        console.error(`Failed to compile template file: ${tplPath}`);
        console.error(e);
      }
    }),
  );
  execSync('pnpm i', { cwd: rootPath, stdio: 'inherit' });
  console.log('Project created successfully');
}

main();

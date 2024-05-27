import { Writable } from 'stream';
import conventionalChangelog from 'conventional-changelog';
import { writeFile, existsSync, readFile } from 'fs-extra';

export async function buildChangelog() {
  console.log('updating changelog...');
  const content = await getContent();

  const nowContent = existsSync('CHANGELOG.md') ? await readFile('CHANGELOG.md', 'utf-8') : '';
  const newContent = content + nowContent;

  await writeFile('CHANGELOG.md', newContent);
}

async function getContent() {
  return new Promise<string>((resolve) => {
    let content = '';
    const writableStream = new Writable({
      write(chunk, encoding, callback) {
        content += chunk.toString();
        callback();
      },
    });

    const fileStream = conventionalChangelog({}).pipe(writableStream);

    fileStream.on('close', () => resolve(content));
  });
}

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const srcRoot = path.join(__dirname, 'src');

function isRunnableFile(fileName: string): boolean {
  const lower = fileName.toLowerCase();
  return (
    (lower.endsWith('.ts') || lower.endsWith('.js')) && !lower.endsWith('.d.ts')
  );
}

function getLeafFolders(rootDir: string): string[] {
  const folders: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    const subDirs = entries.filter((entry) => entry.isDirectory());
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => isRunnableFile(name));

    if (files.length > 0) {
      folders.push(path.relative(rootDir, currentDir));
    }

    for (const subDir of subDirs) {
      walk(path.join(currentDir, subDir.name));
    }
  }

  walk(rootDir);

  return folders.sort((a, b) => a.localeCompare(b));
}

function getRunnableFiles(folderPath: string): string[] {
  return fs
    .readdirSync(folderPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => isRunnableFile(name))
    .sort((a, b) => a.localeCompare(b));
}

function promptChoiceNumeric(
  label: string,
  options: string[],
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (options.length === 0) {
      reject(new Error(`No options available for ${label}.`));
      return;
    }

    console.log(`\nSelect ${label}:`);
    const indexWidth = String(options.length).length;
    options.forEach((option, index) => {
      const linePrefix = `${String(index + 1).padStart(indexWidth, ' ')}.`;
      console.log(`  ${linePrefix} ${option}`);
    });

    const ask = () => {
      rl.question(`Enter choice (1-${options.length}): `, (answer) => {
        const selectedIndex = Number(answer.trim()) - 1;

        if (
          Number.isNaN(selectedIndex) ||
          selectedIndex < 0 ||
          selectedIndex >= options.length
        ) {
          console.log('Invalid choice. Please enter a valid number.');
          ask();
          return;
        }

        resolve(options[selectedIndex]);
      });
    };

    ask();
  });
}

async function promptChoice(label: string, options: string[]): Promise<string> {
  return promptChoiceNumeric(label, options);
}

function runScript(scriptPath: string): Promise<number | null> {
  return new Promise((resolve) => {
    const child = spawn('ts-node', [scriptPath], {
      stdio: 'inherit',
      shell: true,
    });

    child.on('exit', (code) => {
      resolve(code);
    });
  });
}

function promptContinue(): Promise<boolean> {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question('Continue to run another file? (Y/N): ', (answer) => {
        const normalized = answer.trim().toLowerCase();

        if (normalized === 'y' || normalized === 'yes') {
          resolve(true);
          return;
        }

        if (normalized === 'n' || normalized === 'no') {
          resolve(false);
          return;
        }

        console.log('Please enter Y or N.');
        ask();
      });
    };

    ask();
  });
}

async function main() {
  if (!fs.existsSync(srcRoot)) {
    throw new Error(`Cannot find src folder at: ${srcRoot}`);
  }

  let shouldContinue = true;

  while (shouldContinue) {
    const folders = getLeafFolders(srcRoot);
    const testFolder = await promptChoice('a folder', folders);

    const selectedFolderPath = path.join(srcRoot, testFolder);
    const files = getRunnableFiles(selectedFolderPath);
    const testFile = await promptChoice('a file', files);

    const scriptPath = path.join(selectedFolderPath, testFile);
    console.log(`Running test script: ${scriptPath}...\n`);

    const exitCode = await runScript(scriptPath);
    console.log(`Test script exited with code ${exitCode}`);

    shouldContinue = await promptContinue();
    if (shouldContinue) {
      console.log('Starting next selection...\n');
    }
  }

  console.log('Done.');
}

main()
  .catch((error: Error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });

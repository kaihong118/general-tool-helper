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

    rl.question(`Enter choice (1-${options.length}): `, (answer) => {
      const selectedIndex = Number(answer.trim()) - 1;

      if (
        Number.isNaN(selectedIndex) ||
        selectedIndex < 0 ||
        selectedIndex >= options.length
      ) {
        reject(new Error('Invalid choice.'));
        return;
      }

      resolve(options[selectedIndex]);
    });
  });
}

function promptChoiceArrow(label: string, options: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      reject(new Error('Arrow-key picker requires a TTY terminal.'));
      return;
    }

    if (options.length === 0) {
      reject(new Error(`No options available for ${label}.`));
      return;
    }

    readline.emitKeypressEvents(process.stdin);

    const VISIBLE_ITEMS = 12;
    const ANSI = {
      reset: '\u001b[0m',
      bold: '\u001b[1m',
      dim: '\u001b[2m',
      cyan: '\u001b[36m',
      green: '\u001b[32m',
      inverse: '\u001b[7m',
    };

    let selectedIndex = 0;
    const wasRawMode = Boolean((process.stdin as NodeJS.ReadStream).isRaw);
    let didRender = false;

    const cleanup = () => {
      process.stdin.off('keypress', onKeyPress);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(wasRawMode);
      }
      process.stdin.pause();

      if (didRender) {
        process.stdout.write('\u001b[?25h');
      }
    };

    const getWindowStart = () => {
      if (options.length <= VISIBLE_ITEMS) {
        return 0;
      }

      const half = Math.floor(VISIBLE_ITEMS / 2);
      if (selectedIndex <= half) {
        return 0;
      }

      if (selectedIndex >= options.length - half - 1) {
        return options.length - VISIBLE_ITEMS;
      }

      return selectedIndex - half;
    };

    const render = () => {
      const start = getWindowStart();
      const end = Math.min(start + VISIBLE_ITEMS, options.length);
      const visibleOptions = options.slice(start, end);

      process.stdout.write('\u001b[?25l');
      process.stdout.write('\u001b[2J\u001b[H');

      console.log(
        `${ANSI.bold}${ANSI.cyan}Select ${label}${ANSI.reset} ${ANSI.dim}(${options.length} options)${ANSI.reset}`,
      );
      console.log(
        `${ANSI.dim}Use Up/Down to move, Enter to confirm, Ctrl+C to cancel.${ANSI.reset}`,
      );
      console.log('-'.repeat(64));

      visibleOptions.forEach((option, visibleIndex) => {
        const realIndex = start + visibleIndex;
        const linePrefix = `${String(realIndex + 1).padStart(3, ' ')}.`;

        if (realIndex === selectedIndex) {
          console.log(`${ANSI.inverse}${linePrefix} ${option}${ANSI.reset}`);
          return;
        }

        console.log(`${linePrefix} ${option}`);
      });

      if (start > 0 || end < options.length) {
        console.log('-'.repeat(64));
        console.log(
          `${ANSI.dim}Showing ${start + 1}-${end} of ${options.length}.${ANSI.reset}`,
        );
      }

      console.log(
        `\n${ANSI.green}Current:${ANSI.reset} ${selectedIndex + 1}/${options.length}  ${options[selectedIndex]}`,
      );

      didRender = true;
    };

    const onKeyPress = (_: string, key: readline.Key) => {
      if (key.name === 'up') {
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        render();
        return;
      }

      if (key.name === 'down') {
        selectedIndex = (selectedIndex + 1) % options.length;
        render();
        return;
      }

      if (key.name === 'return') {
        const picked = options[selectedIndex];
        cleanup();
        console.log(`\nSelected: ${picked}\n`);
        resolve(picked);
        return;
      }

      if (key.ctrl && key.name === 'c') {
        cleanup();
        reject(new Error('Cancelled by user.'));
      }
    };

    process.stdin.on('keypress', onKeyPress);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    render();
  });
}

async function promptChoice(label: string, options: string[]): Promise<string> {
  if (process.stdin.isTTY && process.stdout.isTTY) {
    return promptChoiceArrow(label, options);
  }

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

import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline/promises';

function getArg(prefix: string): string | undefined {
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value?.slice(prefix.length);
}

function cleanInput(value: string): string {
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function toJsonPath(value: string): string {
  const trimmed = cleanInput(value);
  if (!trimmed) {
    throw new Error('JSON input is empty.');
  }

  if (trimmed.endsWith('.json')) {
    return trimmed;
  }

  if (trimmed.includes('/')) {
    return `${trimmed}.json`;
  }

  return `format/${trimmed}.json`;
}

function toXmlPath(value: string): string {
  const trimmed = cleanInput(value);
  if (!trimmed) {
    throw new Error('XML input is empty.');
  }

  if (trimmed.endsWith('.xml')) {
    return trimmed;
  }

  if (trimmed.includes('/')) {
    return `${trimmed}.xml`;
  }

  return `format/${trimmed}.xml`;
}

async function getInputs(): Promise<{ jsonInput: string; xmlInput?: string }> {
  const jsonFromArg = getArg('--json=');
  const xmlFromArg = getArg('--xml=');
  const fileFromArg = getArg('--file=');

  if (jsonFromArg || xmlFromArg) {
    return { jsonInput: jsonFromArg || '', xmlInput: xmlFromArg };
  }

  if (fileFromArg) {
    return {
      jsonInput: `format/${fileFromArg}.json`,
      xmlInput: `format/${fileFromArg}.xml`,
    };
  }

  const envFile = process.env.file || process.env.npm_config_file;
  if (envFile) {
    return {
      jsonInput: `format/${envFile}.json`,
      xmlInput: `format/${envFile}.xml`,
    };
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const jsonInput = await rl.question(
      'Enter JSON file (e.g., format/format.json or format/format1): ',
    );
    const xmlInput = await rl.question(
      'Enter XML file (optional, press Enter to auto-generate): ',
    );
    return { jsonInput, xmlInput };
  } finally {
    rl.close();
  }
}

async function main(): Promise<void> {
  const root = process.cwd();
  const { jsonInput, xmlInput } = await getInputs();

  const jsonRelativePath = toJsonPath(jsonInput);
  const jsonPath = path.resolve(root, jsonRelativePath);

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`JSON file not found: ${jsonRelativePath}`);
  }

  const defaultXmlInput = jsonRelativePath.replace(/\.json$/i, '.xml');
  const xmlRelativePath =
    xmlInput && cleanInput(xmlInput) ? toXmlPath(xmlInput) : defaultXmlInput;
  const xmlPath = path.resolve(root, xmlRelativePath);

  const payload = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as {
    rawRequest?: unknown;
  };

  if (
    typeof payload.rawRequest !== 'string' ||
    payload.rawRequest.trim() === ''
  ) {
    throw new Error(`rawRequest is missing or empty in ${jsonRelativePath}`);
  }

  fs.mkdirSync(path.dirname(xmlPath), { recursive: true });
  fs.writeFileSync(xmlPath, payload.rawRequest, 'utf8');
  console.log(`Written ${path.relative(root, xmlPath)}`);

  execFileSync(
    'npx',
    [
      'prettier',
      '--plugin=@prettier/plugin-xml',
      '--parser',
      'xml',
      '--write',
      xmlPath,
    ],
    { stdio: 'inherit' },
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`xmlParser error: ${message}`);
  process.exit(1);
});

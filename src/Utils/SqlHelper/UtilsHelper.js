import fs from 'fs';
import readline from 'readline';
export default class UtilHelper {
    constructor() {
        //Empty Constructor
    }
    /**
     * Generate SQL string by replacing placeholders in the template with actual values.
     * @param template Raw SQL
     * @param params {key}: {value}
     * @returns Generated SQL string
     */
    static generateSQL(template, params) {
        return template.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
            const val = params[key];
            if (val === undefined) {
                throw new Error(`Missing value for placeholder ":${key}"`);
            }
            return String(val);
        });
    }
    /**
     * Ask a question in the command line and get user input.
     * @param question Question
     * @returns User input as a string
     */
    static askQuestion(question) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    }
    /**
     * Write data to a file with specified encoding.
     * @param filePath File Path
     * @param data File Content
     * @param encoding BufferEncoding
     */
    static writeFile(filePath, data, encoding = 'utf8') {
        fs.writeFileSync(filePath, data, encoding);
    }
}

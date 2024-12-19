import * as fs from 'fs';

interface RepolinterResult {
    results: Array<{
        ruleInfo: {
            name: string,
            level: string
            ruleConfig: {
                ['file-name']: string;
                ['file-content']: string;
            };
        };
        status: string;
        lintResult?: {
            message?: string;
            passed?: boolean;
        };
    }>;
}

export function getFileChanges(jsonResult: string): { [key: string]: string } {
    try {
        const data: RepolinterResult = JSON.parse(jsonResult);
        const files: { [key: string]: string } = {};

        for (const result of data.results) {
            const fileName = result.ruleInfo.ruleConfig['file-name'];
            if (fileName && fs.existsSync(fileName)) {
                files[fileName] = fs.readFileSync(fileName, 'utf-8');
            }
        }

        for (const result of data.results) {
            if (result.lintResult?.message?.startsWith("Did not find") || 
                (result.status === "NOT_PASSED_ERROR" && result.lintResult?.passed === false)) {
                
                const fileName = result.ruleInfo.ruleConfig['file-name'];
                const newContent = result.ruleInfo.ruleConfig['file-content'] || '';

                if (fileName) {
                    files[fileName] = files[fileName]
                        ? `${files[fileName]} \n ${newContent}`
                        : newContent;
                }
            }
        }

        return files;
    } catch (error) {
        console.error('Error parsing repolinter results:', error);
        return {};
    }
}

export function getLabelStrings(jsonResult: string): [string] { 
    var labels: [string] = [""]
    const defaultLabels: [string] = ["OSPO"]
    const data: RepolinterResult = JSON.parse(jsonResult)

    for(const result of data.results) {
        if (result.ruleInfo.name == "readme-contains-governance" && result.ruleInfo.level == "error")  {
            labels.push("Tier 4")
        } 
        else if (result.ruleInfo.name == "readme-contains-documentation-index" && result.ruleInfo.level == "error") {
            labels.push("Tier 3")
        } 
        else if (result.ruleInfo.name == "community-guidelines-file-exists" && result.ruleInfo.level == "error") {
            labels.push("Tier 2")
        } 
        else if (result.ruleInfo.name == "license-file-exists" && result.ruleInfo.level == "error") {
            labels.push("Tier 1")
        } 
        else {
            labels.push("Tier 0")
        }
    }

    labels.push(...defaultLabels)
    return labels
}
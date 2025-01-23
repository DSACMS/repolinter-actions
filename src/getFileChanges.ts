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
        console.log('\n🚀 === DEBUG START ===');
        
        const data: RepolinterResult = JSON.parse(jsonResult);
        const files: { [key: string]: string } = {};
        
        console.log('\n📚 === Reading Existing Files ===');
        for (const result of data.results) {
            const fileName = result.ruleInfo.ruleConfig['file-name'];
            console.log(`\n🔍 Checking file: ${fileName}`);
            
            if (fs.existsSync(fileName)) {
                const existingContent = fs.readFileSync(fileName, 'utf-8');
                console.log(`📄 Existing content in ${fileName}:`, existingContent);
                files[fileName] = existingContent; 
            } else {
                console.log(`❌ ${fileName} does not exist - will be created`);
                files[fileName] = '';  
            }
        }

        console.log('\n⚙️  === Processing Rules and Adding Missing Content ===');
        for (const result of data.results) {
            const fileName = result.ruleInfo.ruleConfig['file-name'];
            console.log(`\n🎯 Processing rules for: ${fileName}`);
            console.log('📊 Rule status:', result.status);
            console.log('🔎 Lint result:', result.lintResult);

            if (result.lintResult?.message?.startsWith("Did not find") || 
                (result.status === "NOT_PASSED_ERROR" && result.lintResult?.passed === false)) {
                
                const newContent = result.ruleInfo.ruleConfig['file-content'] || '';
                console.log('📝 Current file content:', files[fileName]);
                console.log('➕ Content to be added:', newContent);

                if (!files[fileName].includes(newContent)) {
                    files[fileName] = (files[fileName] || '') + `\n${newContent}`;
                    console.log('✨ Updated content:', files[fileName]);
                } else {
                    console.log('⏩ Content already exists - skipping');
                }
            }
        }

        console.log('\n🎉 === Final File Contents ===');
        Object.entries(files).forEach(([filename, content]) => {
            console.log(`\n📋 ${filename}:`, content);
        });
        
        return files;
    } catch (error) {
        console.error('❌ Error in getFileChanges:', error);
        return {};
    }
}
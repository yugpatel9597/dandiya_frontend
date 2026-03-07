const fs = require('fs');
const path = require('path');

const searchDir = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchDir(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.html') || file.endsWith('.json') || file.endsWith('.css')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.toLowerCase().includes('dandiya')) {
                console.log(fullPath);
            }
        }
    }
};

searchDir('c:\\Users\\ADMIN\\Desktop\\E-commerce');

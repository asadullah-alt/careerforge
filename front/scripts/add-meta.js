const fs = require('fs');
const path = require('path');

const srcAppDir = path.join(__dirname, '../src/app');

function getTitleAndDescription(folder) {
    let title = folder.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    title = title.replace(/\[.*\]/g, '').trim() || 'Job Search Details';
    let description = `Explore the ${title} page on Bhai Kaam Do. Simplifying your job search with AI-driven insights and tools.`;
    return { title: `${title} | Bhai Kaam Do`, description };
}

function walkSync(currentDirPath) {
    fs.readdirSync(currentDirPath).forEach((name) => {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const pagePath = path.join(filePath, 'page.tsx');
            if (fs.existsSync(pagePath)) {
                const layoutPath = path.join(filePath, 'layout.tsx');
                if (!fs.existsSync(layoutPath)) {
                    const folderName = path.basename(filePath);
                    const { title, description } = getTitleAndDescription(folderName);
                    const layoutContent = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${title.replace(/'/g, "\\'")}',
  description: '${description.replace(/'/g, "\\'")}',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;
                    fs.writeFileSync(layoutPath, layoutContent);
                    console.log(`Created layout.tsx for ${folderName}`);
                }
            }
            walkSync(filePath);
        }
    });
}

walkSync(srcAppDir);

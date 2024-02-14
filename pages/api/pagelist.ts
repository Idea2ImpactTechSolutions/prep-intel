import { NextApiRequest, NextApiResponse } from 'next'
let cachedFiles = null;

export default async function Handler(req: NextApiRequest, res: NextApiResponse) {
  const fs = require('fs').promises;
  const path = require('path');
  
  // Collapse anonymous nextjs route/path steps
  const hiddenStep = /\([^)]+\)\//g; 

  async function findFiles(dir, fileList = []) {
      const files = await fs.readdir(dir, { withFileTypes: true });
      for (const file of files) {
          const filePath = path.join(dir, file.name);
          if (file.isDirectory()) {
              await findFiles(filePath, fileList);
          } else if (file.name === 'page.tsx') {
              // Manipulate filePath as needed
              let relativePath = path.relative('.', filePath); // Remove './' prefix
              relativePath = relativePath.replace(/\\/g, '/'); // Ensure forward slashes
              relativePath = relativePath.replace(/^app\//, ''); // Remove 'app/' prefix
              relativePath = relativePath.replace(/\/page\.tsx$/, ''); // Remove '/page.tsx' suffix

              if (relativePath != 'page.tsx')
                fileList.push('/' + relativePath.replace(hiddenStep, ""));
          }
      }
      return fileList;
  }

  if (process.env.NODE_ENV !== 'development') {
    // Not in development, return 404 or redirect
    return res.status(404).json({ error: 'Not found' });
  }

  if (cachedFiles == null) {
    const startingDirectory = '.';
    cachedFiles = await findFiles(startingDirectory);
  }

  // Handle the dev-only API route
  res.status(200).json(cachedFiles);
}

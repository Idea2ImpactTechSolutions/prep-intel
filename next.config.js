/** @type {import('next').NextConfig} */

// next.config.js
module.exports = {
    output: "standalone",
    experimental: {
        serverComponentsExternalPackages: ['sequelize', 'sequelize-typescript'],
    }
};
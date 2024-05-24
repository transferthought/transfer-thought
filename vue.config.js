const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = {
    configureWebpack: {
        plugins: [new CaseSensitivePathsPlugin()],
        output: {
            // Ensuring the output file names are distinctly named
            filename: 'js/[name].[contenthash].js',
        },
    },
    chainWebpack: (config) => {
        config.plugins.delete('prefetch');
        // GraphQL Loader
        config.module
            .rule('html')
            .test(/\.(html)$/)
            .use('html-loader')
            .loader('html-loader')
            .end();
        // const svgRule = config.module.rule('svg');

        // svgRule.uses.clear();

        // svgRule
        //     .use('babel-loader')
        //     .loader('babel-loader')
        //     .end()
        //     .use('vue-svg-loader')
        //     .loader('vue-svg-loader');
    },
    transpileDependencies: ['vuetify'],
};

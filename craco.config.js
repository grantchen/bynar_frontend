const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
module.exports = {
    webpack: {
        plugins: {
            add: [
                new webpack.DefinePlugin({
                    process: {
                        env: {
                            // IBM Masthead search config env vars
                            SEARCH_REDIRECT_ENDPOINT: JSON.stringify('/search'),
                            SEARCH_TYPEAHEAD_API: JSON.stringify('https://bynar-rjcb5uzfiq-ew.a.run.app'),
                            SEARCH_TYPEAHEAD_VERSION: JSON.stringify('v1'),
                        }
                    },
                }),
                // Enable compression
                new CompressionPlugin({
                    test: /\.js$|\.html$|.\css/, // Type of file to compress
                    threshold: 10240, // Compress data over 10k
                    // deleteOriginalAssets: process.env.NODE_ENV === 'production' // Remove source files when building production packages
                })
            ]
        }
    }
}

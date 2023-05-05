const webpack = require('webpack');
module.exports={ 
    webpack: {
      plugins: {
        add: [
          new webpack.DefinePlugin({
            process: {env: {}}
          })
        ]
      },
      fallback: {
        'react/jsx-runtime': 'react/jsx-runtime.js',
        'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
      },
    }
  }
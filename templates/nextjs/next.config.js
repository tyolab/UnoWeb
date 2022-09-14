const path = require('path')

// webpack 5
let config_webpack5 = (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
        let new_config = {
            ...config,
            resolve: {
            ...config.resolve,
                fallback: {
                    "fs": false,
                    "path": false,
                    "os": false,
                }
            },
            module: {
            ...config.module,
            },
        };
        return new_config;
    };

// webpack 4
let config_webpack4 =  (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
}


let configuration = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    webpack: config_webpack5,
    // for NEXT <= 12.0.0
    // experimental: {
    images: {
        unoptimized: true
    }
    // }
}
module.exports = configuration
// module.exports = withSass(configuration)
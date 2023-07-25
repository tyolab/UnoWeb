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
    // i18n support is not compatible with next export
    // uncomment the following lines if you want to use i18n and with dynamic pages
    // i18n: {
    //     /**
    //      * Provide the locales you want to support in your application
    //      */
    //     locales: ["en"/* , "zh" */],
    //     /**
    //      * This is the default locale you want to be used when visiting
    //      * a non-locale prefixed path.
    //      */
    //     defaultLocale: "en",
    //   },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    webpack: config_webpack5,
    // for NEXT <= 12.0.0
    // experimental: {
    images: {
        unoptimized: true
    },
    trailingSlash: true,
    // }
}
module.exports = configuration
// module.exports = withSass(configuration)
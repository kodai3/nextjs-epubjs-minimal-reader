module.exports = {
    webpack: (config) => {
        config.module.rules.push({
            test: /\.(epub|png|jpe?g|gif)$/i,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    },
                },
            ],

        })
        return config
    },
}
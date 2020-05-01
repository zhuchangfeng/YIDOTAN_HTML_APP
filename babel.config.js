module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "modules": false,
                "targets": {
                    "browsers": [
                        "> 1%",
                        "last 2 versions",
                        "not ie <= 8"
                    ]
                }
            }
        ]
    ],
    "plugins": [
        "transform-vue-jsx",
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-optional-chaining", [
            "import",
            {
                "libraryName": "vant",
                "libraryDirectory": "es",
                "style": true
            }
        ]
    ]
}
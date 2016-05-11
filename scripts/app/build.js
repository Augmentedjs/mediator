({
    baseUrl: ".",
    paths: {
        backbone: "../lib/backbone-min",
        underscore: "../lib/lodash.min",
        jquery: "../lib/jquery.min",
        identicon: "../lib/identicon",
        pnglib: "../lib/pnglib",
        augmented: "../lib/augmented",
        augmentedPresentation: "../lib/augmentedPresentation"
    },
    include: ["identicon", "pnglib"],
    name: "mediatorRequire",
    out: "mediatorRequire-built.js",
    optimize: "uglify2",
    preserveLicenseComments: false,
    generateSourceMaps: true,
    useStrict: true
})

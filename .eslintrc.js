module.exports = {
    "extends": ["airbnb-base", "plugin:@typescript-eslint/recommended"],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "env": {
        "jest": true
    },
    rules: {
        "max-classes-per-file": ["error", 2],
        "class-methods-use-this": "off",
        "import/no-unresolved": "off",
        "no-console": "off",
        "@typescript-eslint/indent": ["error", 2],
    }
};

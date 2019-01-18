module.exports = {
  "extends": [
    "airbnb",
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  "plugins": [
    "react",
    "import"
  ],
  "rules": {
    "arrow-body-style": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "no-console": "off",
    "no-multi-spaces": "off",
    "no-underscore-dangle": "off",
    "no-restricted-globals": "off",
    "object-curly-newline": "off",
    "jsx-a11y/label-has-for": "off",
    "class-methods-use-this": "off",
    "react/jsx-one-expression-per-line": "off",
    "import/named": "off",
    "no-await-in-loop": "off",
  },
  "globals": {
    "Web3": true,
    "$": true,
    "TruffleContract": true,
    "document": true,
    "history": true,
    "web3": true,
    "window": true,
    "describe": true,
    "it": true,
    "expect": true,
    "test": true,
    "contract": true,
    "artifacts": true,
    "before": true,
    "beforeEach": true,
    "after": true,
    "afterEach": true,
    "assert": true,
    "alert": true,
  },
  "settings": {
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
                                         // default to "createReactClass"
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
                           // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      "flowVersion": "0.53" // Flow version
    },
    "propWrapperFunctions": [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        "forbidExtraProps",
        {"property": "freeze", "object": "Object"},
        {"property": "myFavoriteWrapper"}
    ]
  }
};

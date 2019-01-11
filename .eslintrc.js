module.exports = {
  "extends": "airbnb",
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
  }
};

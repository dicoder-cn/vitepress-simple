// .eslintrc.cjs
module.exports = {
  rules: {
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal"],
        "newlines-between": "never",
        alphabetize: {
          order: "asc",
          caseInsensitive: true
        }
      }
    ],
    "max-len": ["error", { code: 200 }],
    "prettier/prettier": [
      "error",
      {
        printWidth: 200,
        trailingComma: "none"
      }
    ]
  }
};

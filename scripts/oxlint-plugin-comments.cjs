const DIRECTIVE_PATTERNS = [
  /^eslint-(disable|enable)/,
  /^oxlint-(disable|enable)/,
  /^@ts-(expect-error|ignore|nocheck|check)/,
  /^prettier-ignore/,
  /^(istanbul|c8|v8|node:coverage)\b/,
  /^@vitest-/,
  /^@vite-ignore/,
  /^webpack[A-Z]/,
  /^<reference\b/,
  /^@(license|preserve|jsx|jsxImportSource|jsxRuntime)/,
];

const isDirective = (comment) => {
  const body = comment.value.replace(/^\/|^\*+/, "").trim();

  return DIRECTIVE_PATTERNS.some((pattern) => pattern.test(body));
};

const isJsdoc = (comment) =>
  comment.type === "Block" && /^\*[^*]/.test(comment.value);

module.exports = {
  meta: { name: "comments" },
  rules: {
    "no-comments": {
      create(context) {
        const allowJsdoc = context.options[0]?.allowJsdoc === true;

        return {
          Program() {
            for (const comment of context.sourceCode.getAllComments()) {
              if (comment.type === "Shebang") continue;
              if (isDirective(comment)) continue;
              if (allowJsdoc && isJsdoc(comment)) continue;

              context.report({ loc: comment.loc, messageId: "comment" });
            }
          },
        };
      },
      meta: {
        docs: {
          description:
            "Disallow comments other than tool directives and, when allowed, JSDoc",
        },
        messages: {
          comment:
            "Say it in the code: a name, a type, a test or the commit message.",
        },
        schema: [
          {
            additionalProperties: false,
            properties: { allowJsdoc: { type: "boolean" } },
            type: "object",
          },
        ],
        type: "problem",
      },
    },
  },
};

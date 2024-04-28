const yaml = require('js-yaml');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'lint YAML inside JSDoc',
      category: 'Possible Errors',
    },
    fixable: 'code',
  },
  create: function (context) {
    return {
      Program(node) {
        const sourceCode = context.getSourceCode();
        const comments = sourceCode.getAllComments();

        comments.forEach(comment => {
          const targetToken = "@openapi"

          if (comment.type === 'Block' && comment.value.includes(targetToken)) {
            let text = comment.value;
            if (!text.includes(targetToken)) {
              return
            }

            text = text.substring(text.indexOf(targetToken) + targetToken.length).trim();

            const lines = text.split('\n');
            const yamlContent =  lines.map(l => l.substring(2)).join('\n')

            try {
              yaml.load(yamlContent); // Parse the accumulated YAML content
            } catch (error) {
              context.report({
                node: comment,
                message: 'Invalid YAML: ' + error.message + "\n" + yamlContent,
              });
            }
          }
        });
      },
    };
  },
};

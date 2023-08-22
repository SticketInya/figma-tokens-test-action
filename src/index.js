const core = require('@actions/core');
const fs = require('fs');

function formatCssFile(selector, tokens) {
  const lines = [`${selector} {`];
  for (const token in tokens) {
    if (token[0] === '$') {
      // Skip themes and metadata
      continue;
    }
    const setTitle = `\n/* ${token}*/`;
    lines.push(setTitle);

    Object.entries(tokens[token]).map(([key, val]) => {
      const setVariable = `--${key}:${val['value']};`;
      lines.push(setVariable);
    });
  }
  lines.push('}');

  return lines.join('\n');
}

if (require.main === module) {
  try {
    const destination = core.getInput('destination');
    const source = core.getInput('source');
    const base_selector = core.getInput('base-selector');
    const blob = fs.readFileSync(source);
    const tokens = JSON.parse(blob);
    const file_contents = formatCssFile(base_selector, tokens);
    fs.writeFileSync(destination, file_contents);
  } catch (error) {
    core.setFailed(error.message);
  }
}

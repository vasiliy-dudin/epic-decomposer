import yaml from 'js-yaml';

async function loadData() {
  const response = await fetch('./src/data.yaml');
  const text = await response.text();
  return yaml.load(text);
}

export default loadData;

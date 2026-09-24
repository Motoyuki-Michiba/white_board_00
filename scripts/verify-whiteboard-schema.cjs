const { spawnSync } = require('child_process');

const cli = 'C:\\Users\\michiba.motoyuki\\AppData\\Local\\npm-cache\\_npx\\a64cee6843b5ff58\\node_modules\\@microsoft\\dataverse\\bin\\dataverse.js';
const environment = 'https://org0e46434e.crm7.dynamics.com';
const attributes = [
  'mtl_title',
  'mtl_message',
  'mtl_category',
  'mtl_priority',
  'mtl_ispinned',
  'mtl_publishfrom',
  'mtl_expireson',
  'mtl_status',
  'mtl_attachment'
];

for (const attribute of attributes) {
  const path = `/api/data/v9.2/EntityDefinitions(LogicalName='mtl_whiteboardpost')/Attributes(LogicalName='${attribute}')?$select=LogicalName,SchemaName,AttributeType`;
  const result = spawnSync('node', [
    cli, 'api', 'request', '--target', 'dataverse', '--environment', environment,
    '--method', 'GET', '--path', path, '--include'
  ], { encoding: 'utf8' });

  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

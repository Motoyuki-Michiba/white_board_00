const { spawnSync } = require('child_process');

const cli = 'C:\\Users\\michiba.motoyuki\\AppData\\Local\\npm-cache\\_npx\\a64cee6843b5ff58\\node_modules\\@microsoft\\dataverse\\bin\\dataverse.js';
const environment = 'https://org0e46434e.crm7.dynamics.com';
const solutionHeader = 'MSCRM.SolutionUniqueName:WhiteBoard00Solution';

function label(text) {
  return {
    '@odata.type': 'Microsoft.Dynamics.CRM.Label',
    LocalizedLabels: [{
      '@odata.type': 'Microsoft.Dynamics.CRM.LocalizedLabel',
      Label: text,
      LanguageCode: 1033,
      IsManaged: false
    }]
  };
}

const table = {
  '@odata.type': 'Microsoft.Dynamics.CRM.EntityMetadata',
  SchemaName: 'mtl_WhiteBoardPost',
  DisplayName: label('White Board Post'),
  DisplayCollectionName: label('White Board Posts'),
  Description: label('Information-sharing posts for the Estimation team White Board application.'),
  OwnershipType: 'UserOwned',
  IsActivity: false,
  HasActivities: false,
  HasNotes: false,
  Attributes: [{
    '@odata.type': 'Microsoft.Dynamics.CRM.StringAttributeMetadata',
    AttributeType: 'String',
    AttributeTypeName: { Value: 'StringType' },
    SchemaName: 'mtl_Title',
    DisplayName: label('Title'),
    Description: label('Short, required summary of the post.'),
    IsPrimaryName: true,
    RequiredLevel: {
      Value: 'ApplicationRequired',
      CanBeChanged: true,
      ManagedPropertyLogicalName: 'canmodifyrequirementlevelsettings'
    },
    FormatName: { Value: 'Text' },
    MaxLength: 250
  }]
};

const result = spawnSync('node', [
  cli, 'api', 'request', '--target', 'dataverse', '--environment', environment,
  '--method', 'POST', '--path', '/api/data/v9.2/EntityDefinitions',
  '--header', solutionHeader, '--body', JSON.stringify(table), '--include'
], { encoding: 'utf8' });

process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
if (result.error) {
  throw result.error;
}
process.exit(result.status ?? 1);

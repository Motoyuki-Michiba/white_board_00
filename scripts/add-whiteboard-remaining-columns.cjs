const { spawnSync } = require('child_process');

const cli = 'C:\\Users\\michiba.motoyuki\\AppData\\Local\\npm-cache\\_npx\\a64cee6843b5ff58\\node_modules\\@microsoft\\dataverse\\bin\\dataverse.js';
const environment = 'https://org0e46434e.crm7.dynamics.com';
const solutionHeader = 'MSCRM.SolutionUniqueName:WhiteBoard00Solution';
const attributePath = "/api/data/v9.2/EntityDefinitions(LogicalName='mtl_whiteboardpost')/Attributes";

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

function required() {
  return {
    Value: 'ApplicationRequired',
    CanBeChanged: true,
    ManagedPropertyLogicalName: 'canmodifyrequirementlevelsettings'
  };
}

function choice(name, displayName, description, options) {
  return {
    '@odata.type': 'Microsoft.Dynamics.CRM.PicklistAttributeMetadata',
    AttributeType: 'Picklist',
    AttributeTypeName: { Value: 'PicklistType' },
    SchemaName: name,
    DisplayName: label(displayName),
    Description: label(description),
    RequiredLevel: required(),
    OptionSet: {
      '@odata.type': 'Microsoft.Dynamics.CRM.OptionSetMetadata',
      IsGlobal: false,
      OptionSetType: 'Picklist',
      Options: options.map(([value, text]) => ({
        '@odata.type': 'Microsoft.Dynamics.CRM.OptionMetadata',
        Value: value,
        Label: label(text)
      }))
    }
  };
}

const columns = [
  {
    '@odata.type': 'Microsoft.Dynamics.CRM.BooleanAttributeMetadata',
    AttributeType: 'Boolean',
    AttributeTypeName: { Value: 'BooleanType' },
    SchemaName: 'mtl_IsPinned',
    DisplayName: label('Is Pinned'),
    Description: label('Whether the post remains at the top of the board.'),
    DefaultValue: false,
    OptionSet: {
      FalseOption: { Value: 0, Label: label('No') },
      TrueOption: { Value: 1, Label: label('Yes') }
    }
  },
  {
    '@odata.type': 'Microsoft.Dynamics.CRM.DateTimeAttributeMetadata',
    AttributeType: 'DateTime',
    AttributeTypeName: { Value: 'DateTimeType' },
    SchemaName: 'mtl_PublishFrom',
    DisplayName: label('Publish From'),
    Description: label('Optional date and time from which the post is visible.'),
    Format: 'DateAndTime',
    DateTimeBehavior: { Value: 'UserLocal' }
  },
  {
    '@odata.type': 'Microsoft.Dynamics.CRM.DateTimeAttributeMetadata',
    AttributeType: 'DateTime',
    AttributeTypeName: { Value: 'DateTimeType' },
    SchemaName: 'mtl_ExpiresOn',
    DisplayName: label('Expires On'),
    Description: label('Optional date and time after which the post is hidden.'),
    Format: 'DateAndTime',
    DateTimeBehavior: { Value: 'UserLocal' }
  },
  choice('mtl_Status', 'Status', 'Lifecycle status of the post.', [
    [423520000, 'Draft'],
    [423520001, 'Published'],
    [423520002, 'Archived']
  ]),
  {
    '@odata.type': 'Microsoft.Dynamics.CRM.FileAttributeMetadata',
    AttributeType: 'Virtual',
    AttributeTypeName: { Value: 'FileType' },
    SchemaName: 'mtl_Attachment',
    DisplayName: label('Attachment'),
    Description: label('Optional supporting file for the post.'),
    MaxSizeInKB: 10240
  }
];

for (const column of columns) {
  const result = spawnSync('node', [
    cli, 'api', 'request', '--target', 'dataverse', '--environment', environment,
    '--method', 'POST', '--path', attributePath,
    '--header', solutionHeader, '--body', JSON.stringify(column), '--include'
  ], { encoding: 'utf8' });

  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

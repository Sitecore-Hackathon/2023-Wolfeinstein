import { Text, RichText, Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type CodeMigratorProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    copy: Field<string>;
  };
};

const CodeMigrator = ({ fields }: CodeMigratorProps): JSX.Element => (
  <div className="test">
    <div><span>Hi</span></div>
    <Text tag="h2" className="contentTitle" field={fields.heading} />
    <RichText className="contentDescription" field={fields.copy} />
  </div>
);

export default withDatasourceCheck()<CodeMigratorProps>(CodeMigrator);

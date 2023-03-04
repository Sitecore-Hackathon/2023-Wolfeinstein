import { Field, RichText, Text, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import { ComponentProps } from 'lib/component-props';
import DragAndDrop from 'components/DragAndDrop';

type CodeMigratorProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    copy: Field<string>;
  };
};

const CodeMigrator = ({ fields }: CodeMigratorProps): JSX.Element => (
  <>
    <Text tag="h2" className="contentTitle" field={fields.heading} />
    <RichText className="contentDescription" field={fields.copy} />
    <div className="drag-and-drop__section">
      <DragAndDrop />
    </div>
  </>
);

export default withDatasourceCheck()<CodeMigratorProps>(CodeMigrator);

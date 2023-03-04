import { Field, withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

import DragAndDrop from 'components/DragAndDrop';
import { ComponentProps } from 'lib/component-props';

type CodeMigratorProps = ComponentProps & {
  fields: {
    heading: Field<string>;
    copy: Field<string>;
  };
};

const CodeMigrator = (): JSX.Element => (
  <>
    <DragAndDrop />
  </>
);

export default withDatasourceCheck()<CodeMigratorProps>(CodeMigrator);

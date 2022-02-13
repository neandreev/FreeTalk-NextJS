import { FC } from 'react';

import { Table } from 'antd';

export const AppTable: FC<{ columns: Array<Object>, data: Array<Object>,rowSelection: Object}> = ({ columns, data, rowSelection }) => {

  return (
    <div>
      <Table columns={columns} dataSource={data} pagination={false} rowSelection={rowSelection} />
    </div>
  );
}

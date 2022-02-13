import { FC } from 'react';

import { Table as AntTable } from 'antd';

export const Table: FC<{ columns: Array<Object>, data: Array<Object>,rowSelection: Object}> = ({ columns, data, rowSelection }) => {

	return (
		<div>
			<AntTable columns={columns} dataSource={data} pagination={false} rowSelection={rowSelection} />
		</div>
	);
}

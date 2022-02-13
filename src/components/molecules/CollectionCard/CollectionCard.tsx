import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from 'antd';

import { ICollection } from '../../../interfaces/collection';

export const CollectionCard: FC<ICollection> = ({ id, title, coverUrl }) => {
	const navigate = useNavigate();

	const handleOnClick = () => {
		navigate(`collection-detail/${id}`);
	};

	return (
		<div onClick={handleOnClick}>
			<Card
				hoverable
				cover={<img alt="example" src={coverUrl} />}
			>
				{ title }
			</Card>
		</div>
	);
};

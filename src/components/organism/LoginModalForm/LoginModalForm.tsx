import { FC, useCallback } from 'react';

import { Tabs, Modal } from 'antd';

import { AuthorizationForm } from '../../molecules/AuthorizationForm';

const { TabPane } = Tabs;

interface ILoginModalForm {
	isModalVisible: boolean;
	handleCloseModal: () => void;
}

export const LoginModalForm: FC<ILoginModalForm> = ({
	isModalVisible,
	handleCloseModal,
}) => {
	const handleCancel = useCallback(() => {
		handleCloseModal();
	}, [handleCloseModal]);

	return (
		<Modal
			visible={isModalVisible}
			onCancel={handleCancel}
			footer={[]}
			style={{ padding: 0 }}
		>
			<Tabs defaultActiveKey='1'>
				<TabPane tab='Вход' key='1'>
					<AuthorizationForm type="signin" onSuccess={handleCancel} />
				</TabPane>
				<TabPane tab='Создайте аккаунт' key='2'>
					<AuthorizationForm type="signup" onSuccess={handleCancel} />
				</TabPane>
			</Tabs>
		</Modal>
	);
};

import { FC,useCallback, useEffect } from 'react';

import { Card, Input, Form, Button, Spin } from 'antd';

import {ICardTranslateReq, ITranslateFormValues} from "../../../interfaces/translate";

import styles from './CardTranslateReq.module.css';

export const CardTranslateReq: FC<ICardTranslateReq> = ({
	title,
	isFetching,
	onTranslateRequest,
}) => {
	const [form] = Form.useForm();

	const onFinish = useCallback(
		(values: ITranslateFormValues) => {
			onTranslateRequest && onTranslateRequest(values.TranslateRequest);
		},
		[onTranslateRequest]
	);

	useEffect(() => {
		form.resetFields();
	}, [title]);

	return (
		<Card title={title} style={{ width: 300 }}>
			<Form form={form} onFinish={onFinish} className={styles.form}>
				<Form.Item name='TranslateRequest'>
					<Input
						placeholder='Введите слово'
						className={styles.inputRequest + ' ' + styles.textCenter}
					/>
				</Form.Item>
				{isFetching ? (
					<Spin />
				) : (
					<Button type='primary' htmlType='submit'>
						Перевести
					</Button>
				)}
			</Form>
		</Card>
	);
};

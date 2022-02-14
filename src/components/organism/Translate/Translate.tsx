import { FC, useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useAddUserWordMutation } from '../../../features/database/users';

import { CardTranslateRes } from '../../molecules/CardTranslateRes';
import { CardTranslateReq } from '../../molecules/CardTranslateReq/';

import { Button, message } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

import { translateAPI } from '../../../api/translateAPI';

import style from './Translate.module.css';

interface TranslateResponse {
	word: string;
	translation: string;
	category: string;
	isLearned: boolean;
	timeToTrain: number;
	completedTrains: number;
}

export const Translate: FC = () => {
	const auth = useAuth();
	const { user } = auth!;
	const [addWord] = useAddUserWordMutation();
	const [translateRequest, setTranslateRequest] = useState('');
	const [translateResponse, setTranslateResponse] =
		useState<TranslateResponse | null>(null);
	const [isFetching, setIsFetching] = useState(false);
	const [fromLang, setFromLang] = useState('RU');
	const [toLang, setToLang] = useState('EN');

	const handleTranslateRequest = useCallback((word: string) => {
		setTranslateRequest(word);
	}, []);

	const handleAddWordToDictionary = useCallback(() => {
		if (!user) {
			message.warning('Авторизуйтесь для добавления слова в словарь');
			return;
		}

		if (user && translateResponse) {
			addWord({ word: translateResponse, userId: user.uid });
		}
	}, [translateResponse, user]);

	const handleSwapLang = useCallback(() => {
		setFromLang(toLang);
		setToLang(fromLang);
		setTranslateRequest('');
		setTranslateResponse(null);
	}, [toLang, fromLang]);

	useEffect(() => {
		async function getTranslate() {
			setIsFetching(true);
			const response =
				fromLang === 'RU'
					? await translateAPI.getTranslateRuToEn(translateRequest)
					: await translateAPI.getTranslateEnToRu(translateRequest);
			setTranslateResponse(response!);
			setIsFetching(false);
		}

		translateRequest.length !== 0 && getTranslate();
	}, [translateRequest]);

	return (
		<div className={style.wrapper + ' ' + 'page'}>
			<CardTranslateReq
				title={fromLang}
				onTranslateRequest={handleTranslateRequest}
				isFetching={isFetching}
			/>
			<Button
				shape='circle'
				onClick={handleSwapLang}
				icon={<SwapOutlined />}
				size='large'
			/>
			<CardTranslateRes
				title={toLang}
				translateResponse={translateResponse ? translateResponse.translation : ''}
				onAddWordToDictionary={handleAddWordToDictionary}
			/>
		</div>
	);
};

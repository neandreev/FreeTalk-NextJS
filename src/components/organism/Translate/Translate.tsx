import {FC, useCallback, useEffect, useState } from 'react';

import { CardTranslateRes } from '../../molecules/CardTranslateRes';
import { CardTranslateReq } from '../../molecules/CardTranslateReq/';

import { Button } from 'antd';
import { SwapOutlined } from '@ant-design/icons';

import {translateAPI} from "../../../api/translateAPI";

import style from './Translate.module.css';

export const Translate: FC = () => {
	const [translateRequest, setTranslateRequest] = useState('');
	const [translateResponse, setTranslateResponse] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	const [fromLang, setFromLang] = useState('RU');
	const [toLang, setToLang] = useState('EN');

	const handleTranslateRequest = useCallback((word: string) => {
		setTranslateRequest(word);
	}, []);

	const handleSwapLang = useCallback(() => {
		setFromLang(toLang);
		setToLang(fromLang);
		setTranslateRequest('');
		setTranslateResponse('');
	}, [toLang, fromLang]);

	useEffect(() => {
		async function getTranslate() {
			let translate;
			setIsFetching(true);
			if (fromLang === 'RU' && translateRequest) {
				translate = await translateAPI.getTranslateRuToEn(translateRequest);
			}
			if (fromLang === 'EN' && translateRequest) {
				translate = await translateAPI.getTranslateEnToRu(translateRequest);
			}
			setIsFetching(false);
			setTranslateResponse(translate);
		}

		getTranslate();
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
			<CardTranslateRes title={toLang} translateResponse={translateResponse} />
		</div>
	);
};

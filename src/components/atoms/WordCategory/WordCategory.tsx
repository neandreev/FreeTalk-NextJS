import _capitalize from 'lodash-es/capitalize';
import { FC, useEffect, useRef, useState } from 'react';

import { Input, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { LearningWord } from '@prisma/client';

import style from './WordCategory.module.css';

interface IWordCategory {
	record: LearningWord;
	handleUpdateWord: (wordKey: number, category: string) => void;
}

export const WordCategory: FC<IWordCategory> = ({
	record,
	handleUpdateWord,
}) => {
	const [inputVisible, setInputVisible] = useState(false);
	const [inputValue, setInputValue] = useState(record.category);
	const inputRef = useRef<any>(null);

	useEffect(() => {
		if (inputRef && inputRef.current) {
			inputRef.current.focus();
		}
	}, [inputVisible]);

	const handleUpdate = () => {
		if (inputValue !== '') {
			handleUpdateWord(record.id, _capitalize(inputValue));
		} else {
			setInputValue(record.category);
		}
		setInputVisible(false);
	};

	return (
		<>
			{inputVisible ? (
				<Input
					ref={inputRef}
					type='text'
					size='small'
					value={inputValue}
					className={style.wordCategory_input}
					onChange={(e) => setInputValue(e.target.value)}
					onBlur={handleUpdate}
					onPressEnter={handleUpdate}
				/>
			) : (
				<Tag
					icon={<EditOutlined style={{ color: 'var(--green)' }} />}
					className={style.wordCategory_tag}
					onClick={() => {
						setInputVisible(true);
					}}
				>
					<span>{_capitalize(record.category)}</span>
				</Tag>
			)}
		</>
	);
};

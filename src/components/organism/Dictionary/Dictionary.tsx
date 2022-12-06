import _uniqBy from 'lodash-es/uniqBy';
import _find from 'lodash-es/find';
import cn from 'classnames';
import plural from 'plural-ru';
import { useSession } from 'next-auth/react';
import { FC, useEffect } from 'react';
import { hyphenateSync as hyphenateRuSync } from 'hyphen/ru';
import { hyphenateSync as hyphenateEnSync } from 'hyphen/en';

import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import calendar from 'dayjs/plugin/calendar';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Grid, Row, Space, Table } from 'antd';
import { TableRowSelection } from 'antd/lib/table/interface';
import { ColumnsType } from 'antd/lib/table';

import { LearningWord } from '@prisma/client';
import { useStore } from '@/store/store';
import trpc from '../../../utils/trpc';

import ExpandableInfo from '../../atoms/ExpandableInfo';
import WordCategory from '../../atoms/WordCategory';

import style from './Dictionary.module.css';

dayjs.locale('ru');
dayjs.extend(localizedFormat);
dayjs.extend(calendar);

const { useBreakpoint } = Grid;

const getWordsAmountPlural = (count: number) =>
  plural(count, '%d слово', '%d слова', '%d слов');

const getWordsRepeatsPlural = (count: number) =>
  plural(count, '%d раз', '%d раза', '%d раз');

const isWordLearnedSorter = (a: LearningWord, b: LearningWord) => {
  if (a.learned && b.learned) return 0;
  if (a.learned) return -1;
  return 1;
};

const rowRender = (
  handleUpdateWordCategory: (id: number, category: string) => void,
  handleLearnWords: (wordKey: number[], multiple?: boolean) => void
) => {
  const info = (record: LearningWord) => (
    <ExpandableInfo
      record={record}
      onUpdateCategory={handleUpdateWordCategory}
      onUpdateStatus={handleLearnWords}
    />
  );

  return info;
};

const Dictionary: FC = () => {
  const breakpoint = useBreakpoint();

  const selectedRowKeys = useStore(({ selectedRows }) => selectedRows);
  const setSelectedRows = useStore(({ setSelectedRows }) => setSelectedRows);
  const utils = trpc.useContext();
  const session = useSession();

  const email = session.data?.user?.email || null;
  const wordsQuery = trpc.useQuery(['words', email]);
  const words = wordsQuery.data || [];

  const deleteMutation = trpc.useMutation('delete-words', {
    onSuccess() {
      utils.invalidateQueries('words');
    },
  });
  const updateCategoryMutation = trpc.useMutation('update-word-category', {
    onSuccess() {
      utils.invalidateQueries('words');
    },
  });
  const updateStatusMutation = trpc.useMutation('update-words-status', {
    async onMutate({ ids, learned }) {
      await utils.cancelQuery(['words']);
      const previousWords = utils.getQueryData(['words', email]) || [];
      const newWords = previousWords.map((word) =>
        ids.includes(word.id) ? { ...word, learned } : word
      );
      utils.setQueryData(['words', email], newWords);

      return { previousWords };
    },
    onError(err, updateData, context) {
      const previousWords = context?.previousWords || [];
      utils.setQueryData(['words', email], previousWords);
    },
    onSettled() {
      utils.invalidateQueries(['words', email]);
    },
  });

  const filterCategories = _uniqBy(words, 'category').map((word) => ({
    text: word.category,
    value: word.category,
  }));

  const onFilter = (value: string | number | boolean, record: LearningWord) =>
    record.category.indexOf(value as string) === 0;

  const handleRemoveWords = (wordKeys: number[]) => {
    const newSelectedRows = selectedRowKeys.filter(
      (key) => !wordKeys.includes(key)
    );
    setSelectedRows(newSelectedRows);
    deleteMutation.mutate(wordKeys);
  };

  const handleUpdateWordCategory = (id: number, category: string) => {
    updateCategoryMutation.mutate({ id, category });
  };

  const handleLearnWords = (wordKey: number[], multiple?: boolean) => {
    if (multiple) {
      updateStatusMutation.mutate({ ids: wordKey, learned: true });
      setSelectedRows([]);
    } else {
      const word = _find(words, { id: wordKey[0] }) as LearningWord;
      updateStatusMutation.mutate({ ids: wordKey, learned: !word.learned });
    }
  };

  useEffect(
    () => () => {
      setSelectedRows([]);
    },
    [setSelectedRows]
  );

  const columns: ColumnsType<LearningWord> = [
    {
      title: 'Слово',
      dataIndex: 'translation',
      key: 'translation',
      render: (value: string, record: LearningWord) => (
        <span>{hyphenateEnSync(record.en)}</span>
      ),
      sorter: (a, b) => a.en.localeCompare(b.en),
    },
    {
      title: 'Перевод',
      dataIndex: 'word',
      key: 'word',
      render: (value: string, record: LearningWord) => (
        <span>{hyphenateRuSync(record.ru)}</span>
      ),
      sorter: (a, b) => a.en.localeCompare(b.en),
    },
    {
      title: 'Категория',
      dataIndex: 'category',
      width: '100px',
      filters: filterCategories,
      onFilter,
      render: (text: string, record: LearningWord) => (
        <WordCategory
          record={record}
          handleUpdateWord={handleUpdateWordCategory}
        />
      ),
      showSorterTooltip: {
        title: 'Сортировать категории слов в алфавитном порядке',
      },
      sorter: (a, b) => a.category.localeCompare(b.category),
      responsive: ['md'],
    },
    {
      key: 'isLearned',
      title: 'Изучено',
      width: '30px',
      className: 'centered',
      render: (text: string, record: LearningWord) => (
        <Checkbox
          checked={record.learned}
          onClick={() => handleLearnWords([record.id])}
        />
      ),
      showSorterTooltip: {
        title: 'Сортировать слова в порядке изученности',
      },
      sorter: isWordLearnedSorter,
      responsive: ['md'],
    },
    {
      title: 'Повторено',
      dataIndex: 'completedTrains',
      width: '110px',
      key: 'completedTrains',
      sortDirections: ['descend', 'ascend'],
      render: (text: string, record: LearningWord) => {
        if (record.learned) return null;
        const completedTrainsStyles = cn({
          [style.green]: record.completedTrains >= 7,
        });
        return (
          <span className={completedTrainsStyles}>
            {getWordsRepeatsPlural(record.completedTrains)}
          </span>
        );
      },
      sorter: (a, b) => a.completedTrains - b.completedTrains,
      responsive: ['lg'],
    },
    {
      title: 'Доступно в тренировке',
      key: 'timeToTrain',
      width: '130px',
      render: (text: string, record: LearningWord) => {
        if (record.learned) return null;
        const timeToTrainFormat = dayjs(record.timeToTrain * 1000).format(
          'DD-MM-YYYY'
        );

        const isAvailableForTraining = record.timeToTrain * 1000 < Date.now();
        const timeToTrainStyles = cn({
          [style.green]: isAvailableForTraining,
        });

        return <span className={timeToTrainStyles}>{timeToTrainFormat}</span>;
      },
      showSorterTooltip: {
        title: 'Сортировать слова в порядке доступности для тренировки',
      },
      sorter: (a, b) => a.timeToTrain - b.timeToTrain,
      responsive: ['lg'],
    },
    {
      key: 'actions',
      className: 'centered',
      render: (text: string, record: LearningWord) => (
        <DeleteOutlined
          className=""
          onClick={() => handleRemoveWords([record.id])}
        />
      ),
      responsive: ['sm'],
    },
  ];

  const rowSelection: TableRowSelection<LearningWord> = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys as number[]);
    },
  };

  const tableHeader = () => (
    <Space style={{ lineHeight: 1.3 }}>
      <Button
        onClick={() => handleRemoveWords(selectedRowKeys)}
        disabled={selectedRowKeys.length === 0}
        className="app-btn _green _hover-red"
      >
        <DeleteOutlined style={{ color: 'white' }} />
      </Button>

      <Button
        className="app-btn _green"
        disabled={selectedRowKeys.length === 0}
        onClick={() => handleLearnWords(selectedRowKeys, true)}
      >
        Изучить слова
      </Button>
      {selectedRowKeys.length > 0 && (
        <span>Вы выбрали {getWordsAmountPlural(selectedRowKeys.length)}</span>
      )}
    </Space>
  );

  return (
    <div className="dictionary">
      <Row justify="center">
        <Col lg={20} md={22} span={24}>
          <h1 className={`page__title ${style.title}`}>Словарь</h1>
          <hr />
          <Table
            title={tableHeader}
            rowKey="id"
            expandable={{
              expandedRowRender: rowRender(
                handleUpdateWordCategory,
                handleLearnWords
              ),
              rowExpandable: (record) =>
                ((!breakpoint.lg as boolean) && !record.learned) ||
                (!breakpoint.md as boolean),
              showExpandColumn: !breakpoint.lg as boolean,
            }}
            rowSelection={rowSelection}
            dataSource={words}
            columns={columns}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dictionary;

import { FC } from 'react';

import { Card } from 'antd';

import Image from 'next/image';
import styles from './Description.module.css';

import Translate from '../../../assets/books-in-english-1.webp';
import Dictionary from '../../../assets/how-to-choose-english-dictionary.webp';
import Training from '../../../assets/english-for-trainers-and-athletes.webp';
import Collections from '../../../assets/surround-yourself-with-english.webp';

const DESC_DATA = [
  {
    title: 'Расширенный перевод',
    description: 'Подберем похожие слова дополнительно к основному переводу.',
    imgURL: Translate,
    imgALT: 'translate',
  },
  {
    title: 'Онлайн словарь',
    description:
      'Персональный словарь всегда с вами и доступен с любого устройства.',
    imgURL: Dictionary,
    imgALT: 'dictionary',
  },
  {
    title: 'Тренировки',
    description: 'Поможем вам быстро выучить новые слова и повторить старые.',
    imgURL: Training,
    imgALT: 'training',
  },
  {
    title: 'Коллекции',
    description: 'Мы собрали для вас слова по темам и регулярно их обновляем.',
    imgURL: Collections,
    imgALT: 'collections',
  },
];

const Description: FC = () => (
  <div className={styles.description}>
    <h3 className={`page__title ${styles.title}`}>
      Изучайте английский вместе с FreeTalk
    </h3>
    <div className={styles.cardsWrapper}>
      {DESC_DATA.map((item) => (
        <Card
          key={item.title}
          hoverable
          cover={
            <Image
              className="card-cover"
              alt={item.imgALT}
              src={item.imgURL}
              priority
            />
          }
          className={`card-description ${styles.card}`}
        >
          <h4 className={styles.cardTitle}>{item.title}</h4>
          <p className={styles.cardDescription}>{item.description}</p>
        </Card>
      ))}
    </div>
  </div>
);

export default Description;

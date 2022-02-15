import { ICollection } from "../interfaces/collection"

export const collections: Array<ICollection> = [
  {
    id: '1c',
    title: 'Family',
    coverUrl: 'https://in2english.net/wp-content/uploads/2020/03/my-family2.jpg',
    words: [
      {
        id: '1c1w',
        word: 'Mother',
        translation: 'Мама',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '1c2w',
        word: 'Father',
        translation: 'Папа',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '1c3w',
        word: 'Sister',
        translation: 'Сестра',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '1c4w',
        word: 'Brother',
        translation: 'Брат',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '1c5w',
        word: 'Aunt',
        translation: 'Тётя',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '1c6w',
        word: 'Uncle',
        translation: 'Дядя',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      }
    ]
  },
  {
    id: '2c',
    title: 'Travel',
    coverUrl: 'https://www.state.gov/wp-content/uploads/2020/11/shutterstock_186964970-scaled.jpg',
    words: [
      {
        id: '2c1w',
        word: 'Airport',
        translation: 'Аэропорт',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '2c2w',
        word: 'Plane',
        translation: 'Самолёт',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '2c3w',
        word: 'Journey',
        translation: 'Поездка',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '2c4w',
        word: 'Bike',
        translation: 'Велосипед',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '2c5w',
        word: 'Ocean',
        translation: 'Океан',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '2c6w',
        word: 'Sea',
        translation: 'Море',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      }
    ]
  },
  {
    id: '3c',
    title: 'Fruit',
    coverUrl: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/assortment-of-colorful-ripe-tropical-fruits-top-royalty-free-image-995518546-1564092355.jpg',
    words: [
      {
        id: '3c1w',
        word: 'Apple',
        translation: 'Яблоко',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '3c2w',
        word: 'Coconut',
        translation: 'Кокос',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '3c3w',
        word: 'Mango',
        translation: 'Манго',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '3c4w',
        word: 'Pineapple',
        translation: 'Ананас',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '3c5w',
        word: 'Grape',
        translation: 'Виноград',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      },
      {
        id: '3c6w',
        word: 'Cherry',
        translation: 'Вишня',
        category: '',
        isLearned: false,
        timeToTrain: 0,
        completedTrains: 0
      }
    ]
  }
];

export const fetchCollections = () => {
  return new Promise<Array<ICollection>>((resolve) => {
    setTimeout(() => {
      resolve(collections);
    }, 1000);
  });
};

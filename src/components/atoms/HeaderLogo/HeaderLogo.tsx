import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FreeTalk from '../../../assets/FreeTalk.svg';
import FreeTalkMobile from '../../../assets/FreeTalkMobile.svg';

import style from './HeaderLogo.module.css';

const HeaderLogo: FC = () => {
	return (
		<div className={style.logoWrapper}>
			<Link href='/'>
				<div>
					<Image src={FreeTalk} height='63px' width='200px' className={style.logo} />
					<Image src={FreeTalkMobile} height='63px' width='93px' className={style.logoMobile} />
				</div>
			</Link>
		</div>
	);
};

export { HeaderLogo };

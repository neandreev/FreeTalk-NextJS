import { FC } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as FreeTalk } from '../../../assets/FreeTalk.svg';
import { ReactComponent as FreeTalkMobile } from '../../../assets/FreeTalkMobile.svg';

import style from './HeaderLogo.module.css';

const HeaderLogo: FC = () => (
	<div className={style.logoWrapper}>
		<Link to='/'>
			<FreeTalk height='63px' widht='200px' className={style.logo} />
			<FreeTalkMobile height='63px' widht='93px' className={style.logoMobile} />
		</Link>
	</div>
);

export { HeaderLogo };

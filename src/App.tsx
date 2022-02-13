import {FC} from 'react';

import {AppRoutes} from './routes';

import {Header} from "./components/organism/Header";
import {Footer} from "./components/organism/Footer";

import {Layout} from 'antd';

import './styles/page.css';

export const App: FC = () => {
	return (
		<div className="App">
			<Layout>
			<Header/>
			<AppRoutes/>
			<Footer/>
			</Layout>
		</div>
	);
};

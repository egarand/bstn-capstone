import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Layout.scss";

function Layout() {
	return (<>
		<Header/>
		<main className="layout">
			<div className="layout__inner">
				<Outlet/>
			</div>
		</main>
		<Footer/>
	</>);
}

export default Layout;

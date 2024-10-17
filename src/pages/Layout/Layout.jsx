import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Layout.scss";

function Layout() {
	return (<>
		<Header/>
		<main>
			<Outlet/>
		</main>
		<Footer/>
	</>);
}

export default Layout;

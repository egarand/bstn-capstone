import { Routes, Route } from "react-router-dom";
import "./App.scss";
import { AccessibleNavProvider } from "./navigation-accessibility";
import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import ContributePage from "./pages/ContributePage/ContributePage";
import ExplorePage from "./pages/ExplorePage/ExplorePage";
import LocationDetailPage from "./pages/LocationDetailPage/LocationDetailPage";
import ChecklistPage from "./pages/ChecklistPage/ChecklistPage";
import SpeciesDetailPage from "./pages/SpeciesDetailPage/SpeciesDetailPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import BookmarksPage from "./pages/BookmarksPage/BookmarksPage";

function App() {
	return (
	<AccessibleNavProvider>
		<Routes>
			<Route element={<Layout/>}>
				<Route path="/" element={<HomePage/>}/>
				<Route path="/contribute" element={<ContributePage/>}/>

				<Route path="/explore" element={<ExplorePage/>}/>

				<Route path="/location/:osm_info">
					<Route index element={<LocationDetailPage/>}/>
					<Route path="checklist" element={<ChecklistPage/>}/>
				</Route>

				<Route path="/species/:inat_id" element={<SpeciesDetailPage/>}/>

				<Route path="/register" element={<RegisterPage/>}/>
				<Route path="/login" element={<LoginPage/>}/>
				<Route path="/bookmarks" element={<BookmarksPage/>}/>
			</Route>
		</Routes>
	</AccessibleNavProvider>
	);
}

export default App;

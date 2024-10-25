import { Routes, Route } from "react-router-dom";

import { useRequestCancellationOnNav } from "./utils/api";
import { AccessibleNavProvider } from "./navigation-accessibility";
import AuthProvider from "./components/AuthProvider/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Layout from "./pages/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import ContributePage from "./pages/ContributePage/ContributePage";
import ExplorePage from "./pages/ExplorePage/ExplorePage";
import LocationDetailPage from "./pages/LocationDetailPage/LocationDetailPage";
import ChecklistPage from "./pages/ChecklistPage/ChecklistPage";
import SpeciesDetailPage from "./pages/SpeciesDetailPage/SpeciesDetailPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import BookmarksPage from "./pages/BookmarksPage/BookmarksPage";

import "./App.scss";

function App() {
	useRequestCancellationOnNav();
	return (
	<AccessibleNavProvider skipLinkClass="skip-link">
	<AuthProvider>
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

				<Route path="/register" element={<AuthPage/>}/>
				<Route path="/login" element={<AuthPage/>}/>
				<Route element={<ProtectedRoute/>}>
					<Route path="/bookmarks" element={<BookmarksPage/>}/>
				</Route>
			</Route>
		</Routes>
	</AuthProvider>
	</AccessibleNavProvider>
	);
}

export default App;

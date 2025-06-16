import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import SignIn from "./pages/SignIn/SignIn";
import Favorites from "./pages/Favorites/Favorites";
import Register from "./pages/Register/Register";
import About from "./pages/About/About";
import CreateCard from './pages/CreateCard/CreateCard';
import BusinessPage from "./pages/home/BusinessPage";

function App() {

  return (
    <>

      <Header />
      <Routes>

        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/Favorites" element={<Favorites />} />
        <Route path="/register" element={<Register />} />
        <Route path="/About" element={<About />} />
        <Route path="/CreateCard" element={<CreateCard />} />
        <Route path="/business/:id" element={<BusinessPage />} />
        <Route path="/*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;



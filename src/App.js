import "./style/index.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Add from "./pages/Add";
import Edit from "./pages/Edit";
import MovieDetails from "./pages/MovieDetails";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact="true" element={<Home />} />
          <Route path="/add" exact="true" element={<Add />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route component={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
    return (
        <Router>
            <div className="App">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />}></Route>
                        <Route path="/sign-up" element={<SignUp />}></Route>
                        <Route path="/login" element={<Login />}></Route>
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;

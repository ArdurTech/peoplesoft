import "./components/styles/App.module.css";
import LoginPage from "./components/pages/LoginPage";
import SignupPage from "./components/pages/SignupPage";
import SpecialPage from "./components/pages/SpecalPage"; // Fix typo 'SpecalPage' to 'SpecialPage'
import TitleIndex from "./components/pages/TitleIndex";
import EmployeeDetails from "./components/pages/EmployeeDetails";
import TimeSheet from "./components/pages/TimeSheet";
import Home from "./components/pages/Home";
import LeaveRequest from "./components/pages/LeaveRequest";
import DailyAttendance from "./components/pages/DailyAttendance";
import PaySlip from "./components/pages/PaySlip";
import ITSupport from "./components/pages/ITSupport";
import Bullet from "./components/pages/Bullet";
import LogOut from "./components/pages/LogOut";
import Login from "./components/pages/Login";
import Footer from "./components/pages/Footer";
import Header1 from "./components/pages/Header1";  // Import Header1
import PasswordForgot from "./components/pages/PasswordForgot";
import Header from "./components/pages/Header";

import AdminAssignTask from "./components/pages/AdminAssignTask";
import EmployeeDashboard from "./components/pages/EmployeeDashboard";
import ChatRoom from "./components/pages/ChatRoom";
import { EmployeeProvider } from "./components/pages/EmployeeContext";
import { AuthProvider } from './components/pages/AuthContext'; // Import AuthProvider
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Toaster } from "sonner";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Main app function which is also a functional component that will be passed to main.jsx
function App() {
  return (
    <EmployeeProvider> {/* Wrap the Router with EmployeeProvider */}
      <AuthProvider> {/* Wrap with AuthProvider */}
        <Toaster duration={2000} position="top-center" richColors closeButton />
        
        {/* Router here */}
        <Router>
          <Switch>
            {/* Pages where Header is included */}
            <Route path="/signup">
              <Header />
              <SignupPage />
            </Route>
            <Route path="/employee-details">
              <Header />
              <EmployeeDetails />
            </Route>
            <Route path="/login-page">
              <Header />
              <LoginPage />
            </Route>
            <Route path="/password-forgot">
              <Header />
              <PasswordForgot />
            </Route>
           

            {/* Add Header to exact home ("/") route */}
            <Route exact path="/">
              <Header />
              <Login />
            </Route>

            {/* Use Header1 for Timesheet, LeaveRequest, PaySlip pages */}
            <Route path="/timesheet">
              <Header1 />
              <TimeSheet />
            </Route>
            <Route path="/leaverequest">
              <Header1 />
              <LeaveRequest />
            </Route>
            <Route path="/payslip">
              <Header1 />
              <PaySlip />
            </Route>
            <Route path="/dailyattendance">
              <Header1 />
              <DailyAttendance />
            </Route>
            {/* Pages without Header */}
            <Route path="/special-page" component={SpecialPage} />
            <Route path="/titleindex" component={TitleIndex} />
            <Route path="/home" component={Home} />
            <Route path="/itsupport" component={ITSupport} />
            <Route path="/bullet" component={Bullet} />
            <Route path="/logout" component={LogOut} />
            <Route path="/footer" component={Footer} />
            <Route path="/chatroom" component={ChatRoom} />
            <Route path ="/addmin-assign-task" component={AdminAssignTask} />
            <Route path ="/employee-dashboard" component ={EmployeeDashboard} />
          
          </Switch>
        </Router>
      </AuthProvider> {/* Close AuthProvider */}
    </EmployeeProvider>
  );
}

// Exporting this
export default App;

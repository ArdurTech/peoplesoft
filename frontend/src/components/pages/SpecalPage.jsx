import { useEffect, useRef, useState } from "react";
import styles from "../styles/Special.module.css";
import { useHistory } from "react-router-dom";
import { toast } from "sonner";
import Slider from "react-slick";


function SpecialPage() {
  const history = useHistory();
  const toastWarningMessage = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hrMenuOpen, setHrMenuOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");

  useEffect(() => {
    document.title = "Login System - Special Page";

    const storedEmployeeId = localStorage.getItem("employeeId");
    setEmployeeId(storedEmployeeId || "");

    const checkIfToken = localStorage.getItem("token");
    if (!checkIfToken) {
      if (!toastWarningMessage.current) {
        toast.warning("No 'Token' Found | Please LogIn first");
        toastWarningMessage.current = true;
      }
      setTimeout(() => {
        history.push("/login-page");
      }, 2000);
    }
  }, [history]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleHrMenu = () => {
    setHrMenuOpen(!hrMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employeeId");
    history.push("/login-page");
  };

  const handleBackClick = () => {
    history.goBack(); // Go back to the previous page
  };

  const handleTitleIndexClick = () => {
    history.push("/titleindex");
  };
  const handleHomeClick = () => {
    history.push("/home");
  };
  const handleTimeSheetClick = () => {
    history.push("/timesheet");
  };
  const handleLeaveRequestClick = () => {
    history.push("/leaverequest");
  };
  const handleDailyAttendanceClick = () => {
    history.push("/dailyattendance");
  };
  const handlePaySlipClick = () => {
    history.push("/payslip");
  };
  const handleITSupportClick = () => {
    history.push("/ITSupport");
  };
  const handleBulletClick = () => {
    history.push("/Bullet");
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.menuIcon} onClick={toggleMenu}>
          ☰
        </div>
       
        <h1 className={styles.welcomeMessage}>WELCOME TO ARDUR TECHNOLOGY</h1>

        <div className={styles.headerButtons}>
          <button className={styles.employeeIdButton}>
            Login ID: {employeeId}
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {menuOpen && (
    <div className={styles.verticalMenu}>
    <ul>
      <li onClick={handleHomeClick}>Home</li>
      <li onClick={handleTimeSheetClick}>Time Sheet</li>
      <li onClick={toggleHrMenu} className={styles.hrMenu}>
        HR 
       &nbsp;&nbsp;&nbsp; <i className={`fa-solid fa-chevron-${hrMenuOpen ? 'down' : 'right'}`}></i> {/* Font Awesome icon */}
        {hrMenuOpen && (
          <ul className={styles.subMenu}>
            <li onClick={handleLeaveRequestClick}>Leave Request</li>
            <li onClick={handleDailyAttendanceClick}>Daily Attendance</li>
            <li onClick={handlePaySlipClick}>Pay Slip</li>
          </ul>
        )}
      </li>
      <li onClick={handleITSupportClick}>IT Support</li>
      <li onClick={handleBulletClick}>Bullet</li>
      <li onClick={handleTitleIndexClick}>Title Index</li>
    </ul>
  </div>
  
    
        )}
      </header>

      <div className={styles.container}>
        <div id={styles.companyInfo}>
          <h2>Employee Dashboard</h2>
          <p className="p">
            Ardur Technology is a Multi-Faceted organization offering diverse
            global business services like Title Insurance, Appraisal Services,
            Medical Insurance, Accounting and Financial Reporting, IT Software
            and Services, Digital Transformation. Our TEAM of Professionals has
            the DNA and ZEAL incorporated towards a passion for client
            satisfaction, technological innovation, deep-rooted industry and
            business process knowledge. Our extensive portfolio of services and
            solutions span across multiple industries, such as real estate,
            finance, healthcare, manufacturing, logistics, travel, retail,
            hospitality, technology, telecom and a lot more that enables your
            business in planning ahead.
          </p>
          <div className={styles.carousel}>
            <Slider {...carouselSettings}>
              <div>
                <img
                  src="https://www.smartsys.be/wp-content/uploads/2020/02/Image-block.jpg"
                  alt="Slide 1"
                />
              </div>
              <div>
                <img
                  src="https://ggasolutions.com/wp-content/uploads/2024/01/Benefits-of-Using-Nearshore-Resources-for-Back-Office-Tasks_.jpg"
                  alt="Slide 2"
                />
              </div>
              <div>
                <img
                  src="https://st3.depositphotos.com/1441511/17615/i/1600/depositphotos_176153934-stock-photo-young-business-man-working-on.jpg"
                  alt="Slide 3"
                />
              </div>
              <div>
                <img
                  src="https://www.lbcc.edu/sites/main/files/imagecache/lightbox/main-images/cos_adult_ed.jpg"
                  alt="Slide 4"
                />
              </div>
            </Slider>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>
    </>
  );
}

export default SpecialPage;

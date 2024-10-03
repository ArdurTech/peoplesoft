import React from 'react';
import '../styles/PaySlip.css';

const Payslip = () => {

  const currentDate = new Date();

  // Extract the day, month, and year
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('default', { month: 'long' }); // Get month in long format (e.g., 'September')
  const year = currentDate.getFullYear();

  // Sample data for dropdowns
  const departments = ["HR", "Finance", "Sales", "Marketing","Data Entry","IT Support",];
  const designations = ["Manager", "Team Lead", "Developer", "Intern","Sales Executive"];

  return (
    <div className="payslip-container">
      <div className="payslip-header">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJrfOVb7CkbNIqKC0GU6AYyl-bzSctGwsYEw&s" alt="Company Logo" className="company-logo" />
        <div className="header-details">
          <p className="company-name">Ardur Technology</p>
          <p className="payslip-title">Pay Slip for {day} {month} {year}</p>
        </div>
      </div>

      <form className="payslip-form">
        <div className="section-header">Employee Details</div>
        <div className="details-grid">
          <div className="detail-item">
            <label>Employee Name:</label>
            <input  className='inn' type="text" placeholder="Enter Name" />
          </div>
          <div className="detail-item">
            <label>Employee ID:</label>
            <input  className='inn' type="text" placeholder="Enter ID" />
          </div>
          <div className="detail-item">
            <label>Department:</label>
            <select>
              {departments.map(department => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
          <div className="detail-item">
            <label>Designation:</label>
            <select>
              {designations.map(designation => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
          </div>
          <div className="detail-item">
            <label>Payment Date:</label>
            <input  className='inn' type="text" placeholder="Enter Payment Date" />
          </div>
        </div>

        <div className="section-header">Salary Details</div>
        <div className="details-grid">
          <div className="detail-item">
            <label>Basic Salary:</label>
            <input  className='inn' type="number" placeholder="Enter Basic Salary" />
          </div>
          <div className="detail-item">
            <label>HRA:</label>
            <input  className='inn' type="number" placeholder="Enter HRA" />
          </div>
          <div className="detail-item">
            <label>Other Allowances:</label>
            <input  className='inn' type="number" placeholder="Enter Other Allowances" />
          </div>
          <div className="detail-item">
            <label>Deductions:</label>
            <input  className='inn' type="number" placeholder="Enter Deductions" />
          </div>
          <div className="detail-item">
            <label>Net Salary:</label>
            <input  className='inn' type="number" placeholder="Enter Net Salary" />
          </div>
        </div>

        <div className="section-header">Bank Details</div>
        <div className="details-grid">
          <div className="detail-item">
            <label>Bank Name:</label>
            <input  className='inn' type="text" placeholder="Enter Bank Name" />
          </div>
          <div className="detail-item">
            <label>Account Number:</label>
            <input  className='inn' type="text" placeholder="Enter Account Number" />
          </div>
          <div className="detail-item">
            <label>IFSC Code:</label>
            <input  className='inn' type="text" placeholder="Enter IFSC Code" />
          </div>
          <div className="detail-item">
            <label>Account Holder Name:</label>
            <input  className='inn' type="text" placeholder="Enter Account Holder Name" />
          </div>
        </div>
      </form>

      <div className="payslip-footer">
        <p>Document Management Software by Ardur Technology</p>
      </div>
    </div>
  );
};

export default Payslip;

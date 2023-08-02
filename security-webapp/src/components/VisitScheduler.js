import React, { useState } from 'react';
import { Container, Button, Form, Modal } from 'semantic-ui-react';
import { useAuthContext } from "@asgardeo/auth-react";

const VisitScheduler = ({ onScheduleVisit }) => {
  const { state, httpRequest } = useAuthContext();
  const [showModal, setShowModal] = useState(false);

  var visit = {
    houseNo: '',
    visitorName: '',
    visitorNIC: '',
    visitorPhoneNo: '',
    vehicleNumber: '',
    visitorPhoneNo: '',
    visitDate: new Date().toISOString().slice(0, -1), // Remove the last 'Z' to set the default time as the current time
    inTime: new Date().toISOString().slice(0, -1), // Remove the last 'Z' to set the default time as the current time
    outTime: '',
    isApproved: false,
    comment: '',
  };

  const [formData, setFormData] = useState(visit);

  const scheduleVisit = () => {
    setShowModal(true);
  };

  const handleSubmit = () => {
    // Handle form submission here (e.g., send data to backend or perform any necessary action)
    console.log(formData);
    handleAddItemSubmit();
    // You can add your logic to save the data or send it to the server.
    // For this example, we will just log the form data.
    setShowModal(false);
  };


  const handleAddItemSubmit = async () => {
    formData.visitDate = formData.visitDate + "Z";
    formData.inTime = formData.visitDate
    formData.outTime = formData.outTime + ":00.00Z";;
    const requestConfig = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*,http://localhost:3000"
      },
      method: "POST",
      url: window.config.scheduledVisitURL + '/actualVisits',
      data: formData,
      withCredentials: false
    };

    httpRequest(requestConfig)
      .then((response) => {
        console.log(response);
        setFormData(visit);
        console.log(formData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSearchType, setSelectedSearchType] = useState("NAME"); // Add this state
  const [searchTerm, setSearchTerm] = useState(""); // Add this state

  const handleSearch = async (searchType, searchTerm) => {
    try {
      await searchResidents(searchType, searchTerm);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    }
  };

  const searchResidents = async (searchType, searchTerm) => {
    const requestConfig = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      method: "GET",
      url: window.config.residentsURL + '/residents/search?searchField=' + searchType + '&value=' + searchTerm,
      withCredentials: false
    };

    var houseHolds = [];
    await httpRequest(requestConfig)
      .then((response) => {
        console.log(response);
        houseHolds = response.data;
        setSearchResults(houseHolds);
      })
      .catch((error) => {
        console.error(error);
      });
};

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Modal
        open={showModal}
        onClose={closeModal}
        trigger={
          <Button primary onClick={scheduleVisit} size="huge">
            Enter a new Visit
          </Button>
        }
      >
        <Modal.Header>Enter a New Visit</Modal.Header>
        <Modal.Content>
        <Form>
          <Form.Field>
            <label>Search by</label>
            <select
              value={selectedSearchType}
              onChange={(e) => setSelectedSearchType(e.target.value)}
            >
              <option value="HOUSE_NO">House Number</option>
              <option value="NAME">Name</option>
              <option value="NIC">NIC</option>
              <option value="PHONE_NO">Phone Number</option>
              <option value="EMAIL">Email</option>
            </select>
          </Form.Field>
          <Form.Field>
            <label>Search Term</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Field>
          <Button secondary onClick={() => handleSearch(selectedSearchType, searchTerm)}>
            Search
          </Button>
          </Form>
          {searchResults?.length > 0 && (
            <div>
              <h3>Select Resident from below matches</h3>
              <ul>
                {searchResults.map((result) => (
                  <li
                    key={result.houseNo}
                    onClick={() => {
                      setSelectedItem(result);
                      setFormData({ ...formData, houseNo: result.houseNo });
                      setSearchResults([]);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {result.houseNo} - {result.name} - {result.nic} - {result.phoneNo} - {result.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <br />
          <br />
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label>House ID</label>
              <input
                type="text"
                name="houseNo"
                placeholder="House ID"
                value={formData.houseNo}
                onChange={handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>Visitor Name</label>
              <input
                type="text"
                name="visitorName"
                placeholder="Visitor Name"
                value={formData.visitorName}
                onChange={handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>Visitor NIC</label>
              <input
                type="text"
                name="visitorNIC"
                placeholder="Visitor NIC"
                value={formData.visitorNIC}
                onChange={handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>Visitor Phone</label>
              <input
                type="text"
                name="visitorPhoneNo"
                placeholder="Visitor Phone"
                value={formData.visitorPhoneNo}
                onChange={handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>Visitor Vehicle Number</label>
              <input
                type="text"
                name="vehicleNumber"
                placeholder="Visitor Vehicle Number"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>Visit Date and Time</label>
              <input
                type="datetime-local"
                name="visitDate"
                value={formData.visitDate}
                onChange={handleChange}
                required
                readOnly
              />
            </Form.Field>
            {/* <Form.Field>
              <label>In Time</label>
              <input
                type="datetime-local"
                name="inTime"
                value={formData.inTime}
                onChange={handleChange}
                required
              />
            </Form.Field> */}
            <Form.Field>
              <label>Out Time</label>
              <input
                type="datetime-local"
                name="outTime"
                value={formData.outTime}
                onChange={handleChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <label>Comment</label>
              <input
                type="text"
                name="comment"
                placeholder="Visitor Vehicle Number"
                value={formData.comment}
                onChange={handleChange}
                required
              />
            </Form.Field>
            <Button type="submit" positive>
              Submit
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    </Container>
  );
};

export default VisitScheduler;

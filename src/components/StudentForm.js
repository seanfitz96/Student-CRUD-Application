import React from "react";

//I am importing some styles from material-ui for a cleaner look
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

//useState and useEffect used for showing our date correctly
import { useState, useEffect } from "react";


//copied some table styles from Material UI
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

//copied some table styles from Material UI
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

//This is the start of my StudentForm function
function StudentForm() {


  ///////////////////////////////////////////////////////
  //These are my useStates for my values for the student table. I will implement these for each of my text boxes.
  //Whatever is types in the useState ('') is the data that is stored for my values. So when I set my FirstName, it will be saved.
  ///////////////////////////////////////////////////////
  const [firstName, setFirstName] = useState(""); 
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(""); //try using Date for the enrollment date?

  const [listOfStudents, setListOfStudents] = useState([]); //creating this so that I can display the list of students in my DB

  ///////////////////////////////////////////////////////
  //This is my method to add a student. We create a const with the student info.
  ///////////////////////////////////////////////////////
  const addStudent = (event) => {
    const student = { firstName, middleName, lastName, enrollmentDate };
    console.log(student); //Console logging for the values in student.

    ///////////////////////////////////////////////////////
    //Since I am going to be ADDING data, This will be a POST request. Headers should display what the content type is.
    //Body needs to be JSON.stringigy(student) because the data is formatted in JSON format.
    //Sending out a message to the console to show a student has been ADDED.
    //Putting my getAllStudent() method here makes it so that I don't have to refresh the page!
    ///////////////////////////////////////////////////////
    fetch("http://localhost:8080/student/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    }).then((response) => {
      console.log("New student has been added!");
      getAllStudents();
    });
  };


    ///////////////////////////////////////////////////////
    //Since I am going to be UPDATING data, This will be a PUT request. Headers should display what the content type is.
    //Body needs to be JSON.stringigy("all my data") because the data is formatted in JSON format. Regarding the Body, you want to
    //convert the old values and make them turn into the newly inputed values.
    //Using "prompt" so that the user can input new data if they want to edit.
    //Using these ` ` marks because I am trying to find a specific ID.
    //Sending out a message to the console to show a student has been UPDATED.
    //Putting my getAllStudent() method here makes it so that I don't have to refresh the page!
    ///////////////////////////////////////////////////////
    const updateStudent = (studentId) => {

    const newFirstName = prompt("Enter New First Name: ");
    const newMiddleName = prompt("Enter New Middle Name: ");
    const newLastName = prompt("Enter New Last Name: ");
    const newEnrollmentDate = prompt("Enter New Enrollment Date: ");

    fetch(`http://localhost:8080/student/update/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            studentId: studentId,
            firstName: newFirstName,
            middleName: newMiddleName,
            lastName: newLastName,
            enrollmentDate: newEnrollmentDate,
        })
    }).then((response) => {
        console.log("The student has been updated");
        getAllStudents();
    })
};


    ///////////////////////////////////////////////////////
    //Since I am going to be DELETING data, This will be a DELETE request. Headers should display what the content type is.
    //Body does not need to be included because we are deleting the student data.
    //Using these ` ` marks because I am trying to find a specific ID.
    //Sending out a message to the console to show a student has been DELETED.
    //Putting my getAllStudent() method here makes it so that I don't have to refresh the page!
    ///////////////////////////////////////////////////////
    const deleteStudent = (studentId) => {
        fetch(`http://localhost:8080/student/delete/${studentId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        }).then((response) => {
            console.log("Student with ID of " + studentId + " has been deleted");
            getAllStudents();
        });
    };


    ///////////////////////////////////////////////////////
    //Made this getAllStudents method a const so that I can call it in my other REQUESTS. I found out
    //that by doing this, I can make this method happen at the end of my other requests and it will
    //automatically update the data so that I don't have to refresh the page.
    ///////////////////////////////////////////////////////
    const getAllStudents = () => {
        fetch("http://localhost:8080/student/getAll")
        .then((response) => response.json())
        .then((result) => {
            setListOfStudents(result);
        });
    };


    ///////////////////////////////////////////////////////
    //Creating a useEffect for reading my student table DB data. This will also allow me to call this function
    //in other requests for refreshing the data
    ///////////////////////////////////////////////////////
    useEffect(() => {
        getAllStudents();
    }, []);


  //////   PUTTING SOME JS FUNCTIONS HERE   ///////////////////////

  //Function that clears the input fields
  function clearInputs() {
    document.getElementById("firstNameTextField").value = "";
    document.getElementById("middleNameTextField").value = "";
    document.getElementById("lastNameTextField").value = "";
    document.getElementById("enrollmentDateTextField").value = "";
  }

  //Function that makes sure all inputs must be filled. If they are all filled then a new student is added
  function InputValidation() {
    if (
      document.getElementById("firstNameTextField").value === "" ||
      document.getElementById("middleNameTextField").value === "" ||
      document.getElementById("lastNameTextField").value === "" ||
      document.getElementById("enrollmentDateTextField").value === ""
    ) {
      alert("Please Fill All Inputs.");
    } else {
      alert("Data was inserted!");
      addStudent();
    }
  }

  //////   ENDING MY JS FUNCTIONS HERE   /////////////////////////

  return (
    <Container>
      <div className="StudentForm">
        <h2>Add a student below</h2>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "20ch" },
          }}
          noValidate
          autoComplete="off"
        >
          {/* FOR THE TEXT FIELDS
          
            Setting this textboxes value to fristName that I made in my useStates. Adding it below so that it is controlled and saved.
            Using onChange so that when we write something, it will save that value that is typed in.
            
         */}
          <TextField
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            id="firstNameTextField"
            label="First Name"
          />
          <TextField
            value={middleName}
            onChange={(event) => setMiddleName(event.target.value)}
            id="middleNameTextField"
            label="Middle Name"
          />
          <TextField
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            id="lastNameTextField"
            label="Last Name"
          />
          <TextField
            type="date"
            value={enrollmentDate}
            onChange={(event) => setEnrollmentDate(event.target.value)}
            id="enrollmentDateTextField"
            InputLabelProps={{ shrink: true }}
            label="Enrollment Date"
          />
        </Box>
        <br />
        <Button
          variant="contained"
          onClick={() => {
            InputValidation();
          }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          style={{marginLeft: "50px"}}
          color="secondary"
          onClick={() => {
            clearInputs();
          }}
        >
          Clear Inputs
        </Button>
        

        {/* This is where I am going to display the data */}

        {/* FOR THE TABLE STORING MY DATA
          
            The first StyledTableCell is where the headers are going my for table.
            
            After that, I have to loop (MAP) though the data so that it reads each one of my fields individually. Below, I make 
            the "key" = student.id because each field of my data is stored in "student" and I use ".id" so that the program cycles 
            through each and every field by looking at it's unique id.

            FOR BOTH THE UPDATE AND THE DELETE BUTTON

            I use the OnClick value and call my METHODS that I created above. I use "student.studentId" because each field of my data
            is stored in "student" and when I built my PUT and DELETE methods, I used "StudentId" because I want the program to be
            able to find the data by it's ID so that when I delete that particular set of data, the program knows which one I am referring to.
            
        */}

        <div>
          <br />
          <br />
          <br />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">First Name</StyledTableCell>
                  <StyledTableCell align="center">Middle Name</StyledTableCell>
                  <StyledTableCell align="center">Last Name</StyledTableCell>
                  <StyledTableCell align="center">Enrollment Date</StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                  <StyledTableCell align="center"></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listOfStudents.map(student => ( 
                  <StyledTableRow key={student.id}>
                    <StyledTableCell align="center">{student.firstName}</StyledTableCell>
                    <StyledTableCell align="center">{student.middleName}</StyledTableCell>
                    <StyledTableCell align="center">{student.lastName}</StyledTableCell>
                    <StyledTableCell align="center">{student.enrollmentDate}</StyledTableCell>
                    <StyledTableCell align="center">
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                            updateStudent(student.studentId);
                            }}
                        >
                            Edit
                        </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                            deleteStudent(student.studentId);
                            }}
                        >
                            Delete
                        </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <br/>
      </div>
    </Container>
  );
}

export default StudentForm;

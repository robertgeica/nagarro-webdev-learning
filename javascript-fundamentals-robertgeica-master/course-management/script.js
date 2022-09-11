/*** REQUESTS ***/
const getAllCourses = async () => {
  const coursesReq = await axios.get("http://localhost:3000/courses");
  return coursesReq.data;
};

const getAllStudents = async () => {
  const req = await axios.get("http://localhost:3000/students");
  return req.data;
};

const addNewCourse = async (obj) => {
  await axios.post("http://localhost:3000/courses", obj);
  // courses.push({ id, name, assignedTeacher, studentList });
  return console.log(`Course was successfully created`);
};

const deleteCourse = async (id) => {
  await axios.delete(`http://localhost:3000/courses/${id}`);
  return console.log(`Course was successfully deleted`);
};

const addNewStudent = async (obj) => {
  await axios.post("http://localhost:3000/students", obj);
  // students.push({ id, firstName, lastName, gender, address, hobbies });
  return console.log(`Student was successfully created`);
};

const deleteStudent = async (id) => {
  await axios.delete(`http://localhost:3000/students/${id}`);
  return console.log(`Student was successfully deleted`);
};

const addStudentToCourse = async (id, course) => {
  await axios.put(`http://localhost:3000/courses/${id}`, course);

  console.log(
    `Student with id ${student.id} was successfully added to this course.`
  );
};

const updateCourse = async (id, newCourse) => {
  await axios.put(`http://localhost:3000/courses/${id}`, newCourse);
  console.log(`Student with id ${studentId} was successfully deleted.`);
};

/*** VALIDATIONS ***/
const courseValidation = async (id, name, assignedTeacher, studentList) => {
  let isUniqueId = true;

  // check if property is missing
  if (
    id === undefined ||
    name === undefined ||
    assignedTeacher === undefined ||
    studentList === undefined
  )
    return console.error("Required property is missing.");

  // validate properties type
  if (
    typeof id !== "number" ||
    typeof name !== "string" ||
    typeof assignedTeacher !== "string" ||
    Array.isArray(studentList) === false
  )
    return console.error(`Invalid property type.`);

  // check for unique id
  let courses = await getAllCourses();
  courses.forEach((course) =>
    course.id === id ? (isUniqueId = false) : isUniqueId
  );

  if (isUniqueId) {
    await addNewCourse({ id, name, assignedTeacher, studentList });
  }
  console.log(`Course with id ${id} already exists.`);
};

const studentValidation = async (
  id,
  firstName,
  lastName,
  gender,
  address,
  hobbies
) => {
  let isUniqueId = true;

  // check if property is missing
  if (
    id === undefined ||
    firstName === undefined ||
    lastName === undefined ||
    gender === undefined
  )
    return console.error("Required property is missing.");

  // validate property type
  if (
    typeof id !== "number" ||
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof gender !== "string"
  )
    return console.error(`Invalid required property type.`);

  // validate additional properties
  if (
    (address !== null &&
      address !== undefined &&
      typeof address !== "string") ||
    (hobbies !== null && hobbies !== undefined && !Array.isArray(hobbies))
  )
    return console.error("Invalid additional property type.");

  // check for unique id
  let studentsArr = await getAllStudents();

  studentsArr.forEach((student) =>
    student.id === id ? (isUniqueId = false) : isUniqueId
  );

  if (isUniqueId) {
    await addNewStudent({ id, firstName, lastName, gender, address, hobbies });
  }

  console.log(`Student with id ${id} already exists.`);
};

/*** COURSE CLASS and METHODS ***/
function Course(id, name, assignedTeacher, studentList) {
  // call courseValidation function
  courseValidation(id, name, assignedTeacher, studentList);

  this.id = id;
  this.name = name;
  this.assignedTeacher = assignedTeacher;
  this.studentList = studentList;
}

Course.prototype.addStudent = async function (student, course) {
  student.setGrade(this, null);

  this.studentList.push(student);
  await addStudentToCourse(course.id, course);
};

Course.prototype.deleteStudent = async function (studentId, course) {
  let isInvalidId = true;
  // check for valid id
  this.studentList.forEach((student) => {
    if (student.id === studentId) {
      isInvalidId = false;
    }
  });

  if (isInvalidId)
    return console.error(
      `Student id is invalid resulting in failing to delete the specified student from this course.`
    );

  // remove student from course
  const newStudentsList = course.studentList.filter(
    (student) => student.id !== studentId
  );

  const newCourse = {
    ...course,
    studentList: newStudentsList,
  };

  await updateCourse(course.id, newCourse);
};

Course.prototype.printStudentList = function () {
  console.log(this.studentList);
};

Course.prototype.calculateAverageGrade = function () {
  let grades = [];

  // get all grades for course
  this.studentList.forEach((student) => {
    for (let prop in student) {
      if (this.name + "Grade" === prop && student[prop] !== null) {
        grades.push(student[prop]);
      }
    }
  });

  // calculate average
  if (grades.length > 0) {
    let averageGrade = grades.reduce((acc, crrVal) => acc + crrVal);
    averageGrade = averageGrade / grades.length;
    console.log(`Average grade for ${this.name} Course is ${averageGrade}`);
  }
};

Course.prototype.sortByGrades = function (courseGrade) {
  let sortedByGrades = this.studentList.sort(
    (a, b) => b[courseGrade] - a[courseGrade]
  );
  console.log(sortedByGrades);
};

/*** STUDENT CLASS and METHODS ***/
function Student(id, firstName, lastName, gender, address, hobbies) {
  studentValidation(id, firstName, lastName, gender, address, hobbies);

  this.id = id;
  this.firstName = firstName;
  this.lastName = lastName;
  this.gender = gender;

  this.address = address || null;
  this.hobbies = hobbies || null;
}

Student.prototype.setGrade = function (course, grade) {
  if ((grade > 1 && grade < 10) || grade === null) {
    this[course.name + "Grade"] = grade;

    if (grade !== null)
      console.log(
        `Grade ${grade} set for student with id ${this.id} at ${course.name}`
      );
    return course.calculateAverageGrade();
  }

  console.error(`Invalid grade for student with id ${this.id}.`);
};

Student.prototype.dropCourse = function (course) {
  delete this[course.name + "Grade"];
  console.log(
    `${[course.name + "Grade"]} deleted from student with id ${this.id}.`
  );
  course.calculateAverageGrade();
};

var historyCourse = new Course(1, "history", "Victoria Cobbett", []); //should output 'Course was successfully created'
var frenchCourse = new Course("3", "french", "Josselin Bourseiller", []); //should output 'Invalid property type'
var englishCourse = new Course(2, "english", "Andrea Barrett", []); //should output 'Course was successfully created'
var mathematicsCourse = new Course(2, "mathematics", "Jack  Connor", []); //should output 'Course with id 2 already exists'
var physicsCourse = new Course(10); //should output 'Required property is missing'
console.log("-------");

var martinStudent = new Student(1, "Martin", "Lawrence", "M"); //should output 'Student was successfully created'
var kellyStudent = new Student(
  "3",
  "Freddy",
  "Kelly",
  "M",
  "3497 James Avenue"
); //should output 'Invalid required property type'
var kellyStudent = new Student(2, "Freddy", "Kelly", "M", "3497 James Avenue"); //should output 'Student was successfully created'
var maxStudent = new Student(
  2,
  "Max",
  "Austin",
  "M",
  "4026  Lee Avenue",
  "sports"
); //should output 'Student with id 2 already exists'
var maxStudent = new Student(
  3,
  "Max",
  "Austin",
  "M",
  "4026  Lee Avenue",
  "sports"
); //should output 'Student was successfully created'
var aliyaCollins = new Student(
  4,
  "Aliya",
  "Collins",
  "F",
  "353  Oliverio Drive",
  19
); //should output 'Invalid additional property type'
var aliyaCollins = new Student(
  4,
  "Aliya",
  "Collins",
  "F",
  "353  Oliverio Drive",
  "cooking, reading"
); //should output 'Student was successfully created'
var norahCollins = new Student(5, "Norah"); //should output 'Required property is missing'

console.log(martinStudent.hobbies); //should output null

// historyCourse.addStudent(martinStudent); //should output 'Student with id 1 was successfully added to this course'
// historyCourse.addStudent(kellyStudent); //should output 'Student with id 2 was successfully added to this course'
// englishCourse.addStudent(martinStudent); //should output 'Student with id 1 was successfully added to this course'

// historyCourse.printStudentList();
//should output
// [
//   Student {
//     id: 1,
//     firstName: 'Martin',
//     lastName: 'Lawrence',
//     gender: 'M',
//     address: null,
//     hobbies: null
//   },
//   Student {
//     id: 2,
//     firstName: 'Freddy',
//     lastName: 'Kelly',
//     gender: 'M',
//     address: '3497 James Avenue',
//     hobbies: null
//   }
// ]

// englishCourse.printStudentList();
//should output
// [
//   Student {
//     id: 1,
//     firstName: 'Martin',
//     lastName: 'Lawrence',
//     gender: 'M',
//     address: null,
//     hobbies: null
//   }
// ]

// historyCourse.deleteStudent(101); //should output 'Student id is invalid resulting in failing to delete the specified student from this course'
// historyCourse.deleteStudent(1); //should output 'Student with id 1 was successfully deleted from this course' AND 'historyGrade deleted from student with id 1'
// historyCourse.addStudent(martinStudent); //should output 'Student with id 1 was successfully added to this course'
// historyCourse.addStudent(maxStudent); // should output 'Student with id 3 was successfully added to this course'

// historyCourse.printStudentList(); //should output an array of objects that hold students with id 1, 2, 3

// martinStudent.setGrade(historyCourse, 11); // should output 'Invalid grade for student with id 1'
// martinStudent.setGrade(englishCourse, 7); // should output 'Grade 7 set for student with id 1 at english' AND average grade for this course

// martinStudent.setGrade(historyCourse, 8); // should output 'Grade 8 set for student with id 1 at history' AND average grade for this course
// kellyStudent.setGrade(historyCourse, 6); // should output 'Grade 6 set for student with id 2 at history AND average grade for this course
// maxStudent.setGrade(historyCourse, 9); // should output 'Grade 9 set for student with id 3 at history AND average grade for this course
// historyCourse.deleteStudent(1); // should output historyGrade deleted from student with id 1 AND average grade for this  AND Student with id 1 was successfully deleted

// historyCourse.sortByGrades("historyGrade"); // should output
// [
// Student {
// address: "4026  Lee Avenue"
// firstName: "Max"
// gender: "M"
// historyGrade: 9
// hobbies: "sports"
// id: 3
// lastName: "Austin"
// },
//Student {
// address: "3497 James Avenue"
// firstName: "Freddy"
// gender: "M"
// historyGrade: 6
// hobbies: null
// id: 2
// lastName: "Kelly"
// }
// ]

// given a course, return the students with the course grade bigger than the average course grade
const gradeBiggerThanAverage = (course) => {
  // console.log(course);
  const grades = [];

  if (course.studentList.length == 0)
    return console.log("0 students attending this course.");

  if (course.studentList.length == 1)
    return console.log(
      "Student with bigger grade than the average:\n",
      course.studentList[0]
    );

  // add all grades in array
  course.studentList.forEach((student) => {
    grades.push(student[course.name + "Grade"]);
  });

  // calculate the average
  let averageGrade = grades.reduce((acc, crtValue) => acc + crtValue);
  averageGrade = averageGrade / grades.length;

  // get student with grade bigger than the average
  const studentsWithBiggerGrade = course.studentList.filter(
    (student) => student[course.name + "Grade"] > averageGrade
  );

  return console.log(
    "Students with grade bigger than the average:",
    studentsWithBiggerGrade
  );
};

gradeBiggerThanAverage(historyCourse); // should return
// Students with grade bigger than the average:
// [
//   {
//     address: "4026  Lee Avenue"
//     firstName: "Max"
//     gender: "M"
//     historyGrade: 9
//     hobbies: "sports"
//     id: 3
//     lastName: "Austin"
//   }
// ]
gradeBiggerThanAverage({ studentList: [] }); // should return 0 students attending this course.

// given an array of students, return the most enjoyed course (meaning the course which has the highest occurrence between the given students)
const mostEnjoyedCourse = (students) => {
  let attendedCourse = [];

  students.forEach((student) => {
    // add all attended courses in an array
    for (const property in student) {
      if (
        property.substring(property.length - 5) == "Grade" &&
        property !== "setGrade"
      ) {
        attendedCourse.push(property.substring(0, property.length - 5));
      }
    }
  });

  // count array's duplicate values and store them into an object
  // I found the solution here: https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript
  let coursesAttendCount = {};
  attendedCourse.forEach(
    (course) =>
      (coursesAttendCount[course] = (coursesAttendCount[course] || 0) + 1)
  );

  if (Object.keys(coursesAttendCount).length !== 0) {
    let mostAttendedCourse = Object.keys(coursesAttendCount).reduce((a, b) =>
      coursesAttendCount[a] > coursesAttendCount[b] ? a : b
    );
    return console.log(`Most attended course is: ${mostAttendedCourse}`);
  }
};
mostEnjoyedCourse([...historyCourse.studentList, ...englishCourse.studentList]); // should return 'Most attended course is: history'

// englishCourse.addStudent(maxStudent);

// given an array of courses, return the students which attend all given courses
const studentsAttendingAllCourses = (courses) => {
  const givenCourses = [];
  let studentsAttendingAll = [];

  courses.forEach((course) => givenCourses.push(course.name + "Grade"));

  // iterate through all students attending a course
  courses.forEach((course) => {
    course.studentList.forEach((student) => {
      let isAttending = 0;

      // iterate through all given courses and check if student object has course name === key
      givenCourses.forEach((courseName) => {
        if (
          student[courseName] !== undefined &&
          Object.keys(student).includes(courseName)
        ) {
          isAttending++;
        }

        if (isAttending === courses.length)
          return studentsAttendingAll.push(student);
      });
    });
  });

  // remove duplicates from array
  studentsAttendingAll = studentsAttendingAll.filter((student, index) => {
    return studentsAttendingAll.indexOf(student) === index;
  });

  return console.log("Students attenting all courses: ", studentsAttendingAll);
};
// studentsAttendingAllCourses([historyCourse, englishCourse]); // should return
// [
//   {
//     address: "4026  Lee Avenue"
//     englishGrade: null
//     firstName: "Max"
//     gender: "M"
//     historyGrade: 9
//     hobbies: "sports"
//     id: 3
//     lastName: "Austin"
//   }
// ]

console.log("-----DOM logs-----");
const coursesListDOM = document.getElementById("courses-list");
const deleteCourseBtn = document.getElementById("delete-course-btn");
deleteCourseBtn.classList.add("hide");

const renderTable = async (course, studArr) => {
  if (course !== undefined) {
    const assignedTeacher = document.getElementById("assigned-teacher");
    assignedTeacher.innerHTML = `${course.assignedTeacher}`;
    Object.setPrototypeOf(course, Course.prototype);

    deleteCourseBtn.classList.remove("hide");
    deleteCourseBtn.addEventListener("click", async (e) => {
      await deleteCourse(course.id);
    });

    renderCourseStudents(course, studArr);
  }

  const tableContainer = document.getElementById("table-container");
  tableContainer.classList.toggle("show");

  const table = document.getElementById("students-table");
  const tr = document.createElement("TR");
  table.innerHTML = ""; // clear previous table cells

  // create table headers
  const tableHeaders = [
    "ID",
    "First Name",
    "Last Name",
    "Gender",
    "Address",
    "Hobbies",
    "Actions",
  ];

  tableHeaders.forEach((tdText) => {
    let th = document.createElement("TH");
    const textnode = document.createTextNode(`${tdText}`);

    th.appendChild(textnode);
    tr.appendChild(th);
  });
  table.appendChild(tr);

  // create and render rows with student data
  const students = studArr === undefined ? await getAllStudents() : studArr;
  renderAllStudentsInTable(students, table, course);
};

const renderAllStudentsInTable = (students, table, course) => {
  students.forEach((student) => {
    const tr = document.createElement("TR");
    const propertyNames = [
      "id",
      "firstName",
      "lastName",
      "gender",
      "address",
      "hobbies",
    ];

    for (const property in student) {
      const td = document.createElement("TD");
      if (propertyNames.includes(property)) {
        const textnode = document.createTextNode(`${student[property]}`);

        td.appendChild(textnode);
        tr.appendChild(td);
      }
    }

    if (!student.hasOwnProperty("address")) {
      const td = document.createElement("TD");
      const textnode = document.createTextNode(``);

      td.appendChild(textnode);
      tr.appendChild(td);
    }

    if (!student.hasOwnProperty("hobbies")) {
      const td = document.createElement("TD");
      const textnode = document.createTextNode(``);

      td.appendChild(textnode);
      tr.appendChild(td);
    }

    const td = document.createElement("TD");
    td.classList.add("icon-td");
    const icon = document.createElement("I");
    icon.classList.add("fas");
    icon.classList.add("fa-trash-alt");
    td.appendChild(icon);

    icon.addEventListener("click", () => {
      if (course === undefined) {
        deleteStudent(student.id);
      } else {
        course.deleteStudent(student.id, course);
      }
      table.removeChild(tr);
    });

    tr.appendChild(td);
    table.appendChild(tr);
  });
};
renderTable();


const checkIfMissingId = (inputArr) => {
  // check if missing id in sequence
  let idsArr = [];
  let missingId;
  inputArr.forEach((obj) => {
    idsArr.push(obj.id);
  });

  idsArr.sort();

  for (let i = 1; i < idsArr.length; i++) {
    if (idsArr[i] - idsArr[i - 1] != 1) {
      missingId = idsArr[i] - 1;
    }
  }

  return missingId;
};

const renderCourseStudents = async (course, students) => {
  students = await getAllStudents();

  let dropdown = document.getElementById("students-dropdown");
  dropdown.innerHTML = "";

  // show only students not attending already this course
  let studentsNotAttendingCourse = [...students];
  for (let i = studentsNotAttendingCourse.length - 1; i >= 0; i--) {
    for (let j = 0; j < course.studentList.length; j++) {
      if (
        studentsNotAttendingCourse[i] &&
        students[i].id === course.studentList[j].id
      ) {
        studentsNotAttendingCourse.splice(i, 1);
      }
    }
  }

  studentsNotAttendingCourse.forEach((student) => {
    const studentBtn = document.createElement("BUTTON");
    studentBtn.innerHTML = `${student.firstName} ${student.lastName} (${student.id})`;
    studentBtn.className = "dropdown-btn";

    Object.setPrototypeOf(student, Student.prototype);
    studentBtn.addEventListener("click", (e) => {
      console.log(e);
      e.preventDefault();
      course.addStudent(student, course);
    });

    dropdown.appendChild(studentBtn);
  });
};

const createCourseButton = async () => {
  const req = await axios.get("http://localhost:3000/courses");
  const coursesArr = req.data;

  coursesArr.forEach((course) => {
    Object.setPrototypeOf(course, Course.prototype);
    const listItem = document.createElement("LI");
    const textnode = document.createTextNode(`${course.name}`);

    listItem.appendChild(textnode);
    listItem.className = "course-item";
    listItem.addEventListener("click", async () => {
      let students = course.studentList;
      renderTable(course, students);
    });

    coursesListDOM.appendChild(listItem);
  });
};
createCourseButton();

// add course modal
const addCourseBtn = document.getElementById("add-course");
const courseModal = document.getElementById("course-modal");
const closeCourseModal = document.getElementById("course-modal-close");

addCourseBtn.onclick = () => (courseModal.style.display = "block");
closeCourseModal.onclick = () => (courseModal.style.display = "none");
window.onclick = (e) =>
  e.target === courseModal ? (courseModal.style.display = "none") : courseModal;

let courseObj = {};
const onCourseFormChange = (e) => {
  courseObj = {
    ...courseObj,
    [e.target.name]: e.target.value,
    studentList: [],
  };
};
console.log(courseObj);
const createCourseBtn = document.getElementById("create-course");
createCourseBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const coursesList = await getAllCourses();
  let courseId = checkIfMissingId(coursesList);

  const {
    id = courseId,
    name,
    assignedTeacher,
    studentList,
  } = courseObj;
  courseValidation(parseInt(id), name, assignedTeacher, studentList);

  closeModal.onclick();
});

const courseForm = document
  .getElementById("add-course-form")
  .addEventListener("change", onCourseFormChange);

// add student modal
const addStudentBtn = document.getElementById("add-student");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("modal-close");

addStudentBtn.onclick = () => (modal.style.display = "block");
closeModal.onclick = () => (modal.style.display = "none");
window.onclick = (e) =>
  e.target === modal ? (modal.style.display = "none") : modal;

let studentObj = {};
const onStudentFormChange = (e) => {
  if (e.target.id == "student-hobby-input") return; //do not update studentObj on hobby input update

  studentObj = {
    ...studentObj,
    [e.target.name]: e.target.value,
  };
};

// add and delete student hobby
let studentHobbies = [];
const addStudentHobbyContainer = document.getElementById("student-hobbies");
const addStudentHobbyInput = document.getElementById("student-hobby-input");
const addStudentHobbyBtn = document.getElementById("student-hobby-btn");

addStudentHobbyBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const container = document.createElement("DIV");
  const hobbyItem = document.createElement("P");
  const hobbyItemText = document.createTextNode(
    `${addStudentHobbyInput.value}`
  );

  hobbyItem.appendChild(hobbyItemText);
  studentHobbies.push(addStudentHobbyInput.value);

  const deleteHobbyBtn = document.createElement("BUTTON");
  const deleteHobbyBtnText = document.createTextNode("delete");
  studentObj = {
    ...studentObj,
    hobbies: studentHobbies,
  };

  deleteHobbyBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const newStudentHobbies = studentHobbies.filter(
      (item) => item !== e.target.parentNode.childNodes[0].innerHTML
    );
    studentHobbies = newStudentHobbies;

    studentObj = {
      ...studentObj,
      hobbies: newStudentHobbies,
    };

    e.target.parentNode.remove();
  });

  deleteHobbyBtn.appendChild(deleteHobbyBtnText);
  container.appendChild(hobbyItem);
  container.appendChild(deleteHobbyBtn);
  addStudentHobbyContainer.appendChild(container);
  addStudentHobbyInput.value = "";
});


const createStudentBtn = document.getElementById("create-student");
createStudentBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const studentsList = await getAllStudents();

  // check if missing id in sequence
  let studentId = checkIfMissingId(studentsList);

  const {
    id = studentId,
    firstName,
    lastName,
    gender,
    address,
    hobbies,
  } = studentObj;
  studentValidation(
    parseInt(id),
    firstName,
    lastName,
    gender,
    address,
    hobbies
  );

  closeModal.onclick();
});

const studentForm = document
  .getElementById("add-student-form")
  .addEventListener("change", onStudentFormChange);

// fix refresh after api req

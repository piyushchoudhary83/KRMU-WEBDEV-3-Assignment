const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "students.json");

function readStudents() {
  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData);
}

function writeStudents(students) {
  fs.writeFileSync(filePath, JSON.stringify(students, null, 2));
}

function getAll() {
  return readStudents();
}

function getById(id) {
  return readStudents().find((student) => student.id === id);
}

function create(studentData) {
  const students = readStudents();
  const nextId = students.length
    ? Math.max(...students.map((student) => student.id)) + 1
    : 1;

  const student = {
    id: nextId,
    ...studentData
  };

  students.push(student);
  writeStudents(students);

  return student;
}

function update(id, updates) {
  const students = readStudents();
  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return null;
  }

  students[index] = {
    ...students[index],
    ...updates
  };

  writeStudents(students);
  return students[index];
}

function remove(id) {
  const students = readStudents();
  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return null;
  }

  const [deletedStudent] = students.splice(index, 1);
  writeStudents(students);

  return deletedStudent;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
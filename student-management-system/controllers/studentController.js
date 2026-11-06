const studentStore = require("../data/studentStore");

function parseId(id) {
  const parsed = Number(id);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function validateStudentBody(body) {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object.";
  }

  const { name, course } = body;

  if (typeof name !== "string" || !name.trim()) {
    return "Name is required and must be a non-empty string.";
  }

  if (typeof course !== "string" || !course.trim()) {
    return "Course is required and must be a non-empty string.";
  }

  return null;
}

function validateUpdateBody(body) {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object.";
  }

  if (body.name !== undefined &&
      (typeof body.name !== "string" || !body.name.trim())) {
    return "Name must be a non-empty string.";
  }

  if (body.course !== undefined &&
      (typeof body.course !== "string" || !body.course.trim())) {
    return "Course must be a non-empty string.";
  }

  if (body.name === undefined && body.course === undefined) {
    return "Provide at least one field to update: name or course.";
  }

  return null;
}

function getAllStudents(req, res, next) {
  try {
    const students = studentStore.getAll();

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
}

function getStudentById(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      const error = new Error("Student ID must be a positive integer.");
      error.statusCode = 400;
      return next(error);
    }

    const student = studentStore.getById(id);

    if (!student) {
      const error = new Error("Student Not Found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
}

function createStudent(req, res, next) {
  try {
    const validationError = validateStudentBody(req.body);

    if (validationError) {
      const error = new Error(validationError);
      error.statusCode = 400;
      return next(error);
    }

    const student = studentStore.create({
      name: req.body.name.trim(),
      course: req.body.course.trim()
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student
    });
  } catch (error) {
    next(error);
  }
}

function updateStudent(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      const error = new Error("Student ID must be a positive integer.");
      error.statusCode = 400;
      return next(error);
    }

    const validationError = validateUpdateBody(req.body);

    if (validationError) {
      const error = new Error(validationError);
      error.statusCode = 400;
      return next(error);
    }

    const updatedStudent = studentStore.update(id, {
      ...(req.body.name !== undefined && { name: req.body.name.trim() }),
      ...(req.body.course !== undefined && { course: req.body.course.trim() })
    });

    if (!updatedStudent) {
      const error = new Error("Student Not Found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
}

function deleteStudent(req, res, next) {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      const error = new Error("Student ID must be a positive integer.");
      error.statusCode = 400;
      return next(error);
    }

    const deletedStudent = studentStore.remove(id);

    if (!deletedStudent) {
      const error = new Error("Student Not Found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: deletedStudent
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
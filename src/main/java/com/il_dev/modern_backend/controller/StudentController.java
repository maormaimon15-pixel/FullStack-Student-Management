package com.il_dev.modern_backend.controller;

import com.il_dev.modern_backend.model.Student;
import com.il_dev.modern_backend.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public List<Student> getStudents() {
        return studentService.getAllStudents();
    }

    @PostMapping
    public Student addStudent(@Valid @RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id); // וודא שהשירות שלך תומך בזה
    }
    // הוסף את החלק הזה בתוך StudentController.java


@PutMapping("/{id}")
public Student updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
    // התיקון: אנחנו משתמשים ב-Service הקיים במקום ב-Repository החסר
    return studentService.updateStudent(id, studentDetails);
}
}

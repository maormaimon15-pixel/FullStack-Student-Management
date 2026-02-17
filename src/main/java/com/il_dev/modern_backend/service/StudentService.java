package com.il_dev.modern_backend.service;

import com.il_dev.modern_backend.model.Student;
import com.il_dev.modern_backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
    // הוסף את זה בתוך StudentService.java

    public Student updateStudent(Long id, Student studentDetails) {
        // כאן ה-Service מכיר את ה-Repository, אז זה יעבוד!
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());

        return studentRepository.save(student);
    }
    }
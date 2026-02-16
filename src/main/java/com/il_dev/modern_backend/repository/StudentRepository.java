package com.il_dev.modern_backend.repository;

import com.il_dev.modern_backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

// זהו! ה-Interface הזה נותן לנו אוטומטית פונקציות כמו save, findAll, deleteById
public interface StudentRepository extends JpaRepository<Student, Long> {
}
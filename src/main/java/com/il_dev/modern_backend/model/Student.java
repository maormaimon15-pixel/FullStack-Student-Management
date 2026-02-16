package com.il_dev.modern_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor // חובה בשביל מסד הנתונים (JPA)
@Entity // הופך את המחלקה לטבלה במסד הנתונים
public class Student {

    @Id // מגדיר את השדה הזה כמפתח ראשי (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // מספור אוטומטי (1, 2, 3...)
    private Long id;

    @NotBlank(message = "First name is mandatory")
    private String firstName;

    @NotBlank(message = "Last name is mandatory")
    private String lastName;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is mandatory")
    private String email;
}
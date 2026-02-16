import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaUserPlus, FaUserGraduate, FaSearch, FaFileDownload } from 'react-icons/fa';

function App() {
    const [students, setStudents] = useState([])
    const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', email: '' })
    const [searchQuery, setSearchQuery] = useState('')

    // טעינת סטודנטים
    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/students')
            setStudents(response.data)
        } catch (error) {
            toast.error("שגיאה בטעינת הנתונים מהשרת")
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    // עדכון שדות הטופס
    const handleChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value })
    }

    // שליחת טופס (הוספה)
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:8080/api/students', newStudent)
            setNewStudent({ firstName: '', lastName: '', email: '' })
            fetchStudents()
            toast.success("סטודנט נוסף בהצלחה! 🎓")
        } catch (error) {
            toast.error("שגיאה: בדוק שהאימייל תקין!")
        }
    }

    // מחיקת סטודנט
    const handleDelete = async (id) => {
        if (window.confirm("בטוח שברצונך למחוק?")) {
            try {
                await axios.delete(`http://localhost:8080/api/students/${id}`)
                fetchStudents()
                toast.info("הסטודנט נמחק מהמערכת")
            } catch (error) {
                toast.error("לא ניתן למחוק את הסטודנט")
            }
        }
    }

    // ייצוא לאקסל (CSV)
    const downloadCSV = () => {
        const headers = ["ID,First Name,Last Name,Email"];
        const rows = filteredStudents.map(student =>
            `${student.id},${student.firstName},${student.lastName},${student.email}`
        );
        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob(["\uFEFF" +csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "students_list.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // סינון הרשימה לפי החיפוש
    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="container" dir="rtl">
            <ToastContainer position="top-center" autoClose={3000} />

            {/* כותרת וכפתור ייצוא */}
            <div className="header-container">
                <h1><FaUserGraduate /> מערכת ניהול סטודנטים</h1>
                <button onClick={downloadCSV} className="export-btn">
                    <FaFileDownload /> ייצא לאקסל
                </button>
            </div>

            {/* שדה חיפוש */}
            <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="חפש סטודנט לפי שם או אימייל..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* טופס הוספה */}
            <form onSubmit={handleSubmit} className="form-container">
                <input type="text" name="firstName" placeholder="שם פרטי" value={newStudent.firstName} onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="שם משפחה" value={newStudent.lastName} onChange={handleChange} required />
                <input type="email" name="email" placeholder="אימייל" value={newStudent.email} onChange={handleChange} required />
                <button type="submit" className="add-btn">
                    <FaUserPlus /> הוסף
                </button>
            </form>

            {/* טבלה */}
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>שם פרטי</th>
                    <th>שם משפחה</th>
                    <th>אימייל</th>
                    <th>פעולות</th>
                </tr>
                </thead>
                <tbody>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.firstName}</td>
                            <td>{student.lastName}</td>
                            <td>{student.email}</td>
                            <td>
                                <button onClick={() => handleDelete(student.id)} className="delete-btn" title="מחק סטודנט">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                            לא נמצאו תוצאות לחיפוש "{searchQuery}" 🔍
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}

export default App
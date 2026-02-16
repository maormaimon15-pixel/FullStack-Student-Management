import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css' // חיבור לקובץ העיצוב החדש
import { ToastContainer, toast } from 'react-toastify'; // ייבוא ההתראות
import 'react-toastify/dist/ReactToastify.css'; // עיצוב של ההתראות
import { FaTrash, FaUserPlus, FaUserGraduate } from 'react-icons/fa'; // אייקונים

function App() {
    const [students, setStudents] = useState([])
    const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', email: '' })

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

    const handleChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:8080/api/students', newStudent)
            setNewStudent({ firstName: '', lastName: '', email: '' })
            fetchStudents()
            // הודעה יפה במקום Alert
            toast.success("סטודנט נוסף בהצלחה! 🎓")
        } catch (error) {
            toast.error("שגיאה: בדוק שהאימייל תקין!")
        }
    }

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

    return (
        <div className="container" dir="rtl">
            {/* רכיב ההתראות - חייב להיות בדף כדי שזה יעבוד */}
            <ToastContainer position="top-center" autoClose={3000} />

            <h1><FaUserGraduate /> מערכת ניהול סטודנטים</h1>

            {/* טופס מעוצב */}
            <form onSubmit={handleSubmit} className="form-container">
                <input type="text" name="firstName" placeholder="שם פרטי" value={newStudent.firstName} onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="שם משפחה" value={newStudent.lastName} onChange={handleChange} required />
                <input type="email" name="email" placeholder="אימייל" value={newStudent.email} onChange={handleChange} required />
                <button type="submit" className="add-btn">
                    <FaUserPlus /> הוסף
                </button>
            </form>

            {/* טבלה מעוצבת */}
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
                {students.map(student => (
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
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default App
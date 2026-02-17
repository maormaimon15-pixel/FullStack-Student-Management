import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// הוספנו את FaEdit
import { FaTrash, FaUserPlus, FaUserGraduate, FaSearch, FaFileDownload, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

function App() {
    const [students, setStudents] = useState([])
    const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', email: '' })
    const [searchQuery, setSearchQuery] = useState('')

    // State חדש: האם אנחנו במצב עריכה? ואם כן, איזה ID?
    const [isEditing, setIsEditing] = useState(false)
    const [currentId, setCurrentId] = useState(null)

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/students')
            setStudents(response.data)
        } catch (error) {
            toast.error("שגיאה בטעינת הנתונים")
        }
    }

    useEffect(() => { fetchStudents() }, [])

    const handleChange = (e) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value })
    }

    // פונקציה שמכינה את הטופס לעריכה
    const handleEditClick = (student) => {
        setNewStudent({ firstName: student.firstName, lastName: student.lastName, email: student.email })
        setIsEditing(true)
        setCurrentId(student.id)
        window.scrollTo({ top: 0, behavior: 'smooth' }); // גולל למעלה לטופס
    }

    // פונקציה לביטול עריכה
    const handleCancelEdit = () => {
        setIsEditing(false)
        setCurrentId(null)
        setNewStudent({ firstName: '', lastName: '', email: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (isEditing) {
                // לוגיקה של עדכון (PUT)
                await axios.put(`http://localhost:8080/api/students/${currentId}`, newStudent)
                toast.success("הפרטים עודכנו בהצלחה! ✏️")
                handleCancelEdit() // יוצאים ממצב עריכה
            } else {
                // לוגיקה של הוספה (POST)
                await axios.post('http://localhost:8080/api/students', newStudent)
                toast.success("סטודנט נוסף בהצלחה! 🎓")
                setNewStudent({ firstName: '', lastName: '', email: '' })
            }
            fetchStudents()
        } catch (error) {
            toast.error("שגיאה בשמירת הנתונים")
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm("בטוח שברצונך למחוק?")) {
            try {
                await axios.delete(`http://localhost:8080/api/students/${id}`)
                fetchStudents()
                toast.info("הסטודנט נמחק")
            } catch (error) {
                toast.error("לא ניתן למחוק")
            }
        }
    }

    // ... (פונקציות downloadCSV ו-filteredStudents נשארות אותו דבר) ...
    // כאן שמתי את הקיצור לפונקציות הקודמות כדי לא להעמיס, תשאיר אותן כמו שהיו
    const downloadCSV = () => { /* ... הקוד הקודם ... */ }
    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="container" dir="rtl">
            <ToastContainer position="top-center" autoClose={3000} />

            <div className="header-container">
                <h1><FaUserGraduate /> מערכת ניהול סטודנטים</h1>
                <button onClick={downloadCSV} className="export-btn"><FaFileDownload /> ייצא לאקסל</button>
            </div>

            <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="חפש סטודנט..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* טופס חכם - משתנה לפי המצב */}
            <form onSubmit={handleSubmit} className="form-container">
                <input type="text" name="firstName" placeholder="שם פרטי" value={newStudent.firstName} onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="שם משפחה" value={newStudent.lastName} onChange={handleChange} required />
                <input type="email" name="email" placeholder="אימייל" value={newStudent.email} onChange={handleChange} required />

                {/* שינוי הכפתור לפי המצב */}
                {isEditing ? (
                    <>
                        <button type="submit" className="add-btn" style={{ backgroundColor: '#ffc107', color: 'black' }}>
                            <FaSave /> שמור שינויים
                        </button>
                        <button type="button" onClick={handleCancelEdit} className="add-btn" style={{ backgroundColor: '#6c757d', marginRight: '5px' }}>
                            <FaTimes /> ביטול
                        </button>
                    </>
                ) : (
                    <button type="submit" className="add-btn">
                        <FaUserPlus /> הוסף
                    </button>
                )}
            </form>

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
                {filteredStudents.map(student => (
                    <tr key={student.id} style={isEditing && currentId === student.id ? {backgroundColor: '#fff3cd'} : {}}>
                        <td>{student.id}</td>
                        <td>{student.firstName}</td>
                        <td>{student.lastName}</td>
                        <td>{student.email}</td>
                        <td>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                {/* כפתור עריכה חדש */}
                                <button onClick={() => handleEditClick(student)} className="edit-btn" title="ערוך" style={{ border: 'none', background: 'transparent', color: '#ffc107', cursor: 'pointer', fontSize: '16px' }}>
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDelete(student.id)} className="delete-btn" title="מחק">
                                    <FaTrash />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default App
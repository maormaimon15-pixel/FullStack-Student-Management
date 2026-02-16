import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
    const [students, setStudents] = useState([])
    const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', email: '' })

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/students')
            setStudents(response.data)
        } catch (error) {
            console.error("Error fetching students:", error)
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
        } catch (error) {
            alert("שגיאה: וודא שהאימייל תקין וכל השדות מלאים!")
        }
    }

    // הפונקציה החדשה למחיקה
    const handleDelete = async (id) => {
        if (window.confirm("בטוח שברצונך למחוק את הסטודנט?")) {
            try {
                await axios.delete(`http://localhost:8080/api/students/${id}`)
                fetchStudents() // מרענן את הרשימה אחרי המחיקה
            } catch (error) {
                console.error("Error deleting student:", error)
            }
        }
    }

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center', direction: 'rtl' }}>
            <h1>ניהול סטודנטים - Full Stack</h1>

            {/* טופס הוספה */}
            <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', display: 'inline-block' }}>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="firstName" placeholder="שם פרטי" value={newStudent.firstName} onChange={handleChange} required style={{ margin: '5px', padding: '8px' }} />
                    <input type="text" name="lastName" placeholder="שם משפחה" value={newStudent.lastName} onChange={handleChange} required style={{ margin: '5px', padding: '8px' }} />
                    <input type="email" name="email" placeholder="אימייל" value={newStudent.email} onChange={handleChange} required style={{ margin: '5px', padding: '8px' }} />
                    <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>הוסף</button>
                </form>
            </div>

            {/* טבלה מעודכנת */}
            <table border="1" style={{ width: '80%', margin: '0 auto', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
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
                            <button
                                onClick={() => handleDelete(student.id)}
                                style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                מחק
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
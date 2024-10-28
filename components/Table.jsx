const Table = ({students, setStudents}) => {
    // TODO: answer here
    const deleteStudent=(id)=>{
        fetch(`http://localhost:3001/student/${id}`,{
            method:'DELETE'})
            .then(()=>setStudents(prev=>prev.filter(student=>student.id !== id)))
    }
    return (
        <table>
            <thead>
                <th>No</th>
                <th>Full Name</th>
                <th>Birth Date</th>
                <th>Gender</th>
                <th>Faculty</th>
                <th>Program Study</th>
                <th>Option</th>
            </thead>
            <tbody>
                {students.map((student)=>(
                    <tr key={student.id} className="student-data-row">
                        <td>{student.id}</td>
                        <td>{student.fullname}</td>
                        <td>{student.birthDate}</td>
                        <td>{student.gender}</td>
                        <td>{student.faculty}</td>
                        <td>{student.programStudy}</td>
                        <td><button data-testid={`delete-${student.id}`}
                        onClick={()=>deleteStudent(student.id)}
                        >Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;

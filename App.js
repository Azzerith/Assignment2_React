import { useEffect, useState } from "react";
import Form from "./components/Form";
import Table from "./components/Table";

const App = () => {
    // TODO: answer here
    const [students, setStudents]=useState([])
    const [loading, setLoading]=useState(true)

    useEffect(()=>{
        const fetchData = async () => {
            
            try {
                const response = await fetch('http://localhost:3001/student');
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    },[students]);
    

    return (
        <>
        <header>Student Portal</header>
        <Form setStudents={setStudents} students={students} />
        <hr />
        {loading ? (
            <center><p>Loading ...</p></center>
        ) : (
            <Table students={students} setStudents={setStudents} />
        )}
    </>
    );
};

export default App;

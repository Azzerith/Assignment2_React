import { useState } from "react";

const Form = ({ setStudents,students }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        birthDate: '',
        gender: 'Male',
        programStudy: 'Ekonomi',
        faculty: 'Fakultas Ekonomi'
    });

    const facultyHandling = (programStudy) => {
        const faculties = {
            "Ekonomi": "Fakultas Ekonomi",
            "Manajemen": "Fakultas Ekonomi",
            "Akuntansi": "Fakultas Ekonomi",
            "Administrasi Publik": "Fakultas Ilmu Sosial dan Politik",
            "Administrasi Bisnis": "Fakultas Ilmu Sosial dan Politik",
            "Hubungan Internasional": "Fakultas Ilmu Sosial dan Politik",
            "Teknik Sipil": "Fakultas Teknik",
            "Arsitektur": "Fakultas Teknik",
            "Matematika": "Fakultas Teknologi Informasi dan Sains",
            "Fisika": "Fakultas Teknologi Informasi dan Sains",
            "Informatika": "Fakultas Teknologi Informasi dan Sains"
        };
        return faculties[programStudy] || '';
    };

    const submitHandling = async (e) => {
        e.preventDefault();
        const faculty = facultyHandling(formData.programStudy);
        const newStudent = {
            id: `${students.length + 1}`,
            fullname: formData.fullname,
            birthDate: formData.birthDate,
            gender: formData.gender,
            programStudy: formData.programStudy,
            faculty: faculty,
        };
    
        try {
            const response = await fetch(`http://localhost:3001/student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStudent),
            });
            const data = await response.json();
    
            setStudents(prev => [...prev, data]);
        } catch (error) {
            console.error("Failed to add student:", error);
        }
    };
    

    return (
        <form id="form-student" onSubmit={submitHandling}>
            <div>
                <label htmlFor="input-name">Fullname</label>
                <input
                    type="text"
                    id="input-name"
                    data-testid="name"
                    value={formData.fullname}
                    onChange={(e) => setFormData({
                        ...formData,
                        fullname: e.target.value
                    })}
                />
            </div>
            <div>
                <label htmlFor="input-date">Birth Date</label>
                <input
                    type="date"
                    id="input-date"
                    data-testid="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({
                        ...formData,
                        birthDate: e.target.value
                    })}
                />
            </div>
            <div>
                <label htmlFor="input-gender">Gender</label>
                <select
                    id="input-gender"
                    data-testid="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({
                        ...formData,
                        gender: e.target.value
                    })}
                >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div>
                <label htmlFor="input-prody">Program Study</label>
                <select
                    id="input-prody"
                    data-testid="prody"
                    value={formData.programStudy}
                    onChange={(e) => {
                        const selectedProgram = e.target.value;
                        setFormData({
                            ...formData,
                            programStudy: selectedProgram,
                            faculty: facultyHandling(selectedProgram)
                        });
                    }}
                >
                    <option value="Ekonomi">Ekonomi</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Akuntansi">Akuntansi</option>
                    <option value="Administrasi Publik">Administrasi Publik</option>
                    <option value="Administrasi Bisnis">Administrasi Bisnis</option>
                    <option value="Hubungan Internasional">Hubungan Internasional</option>
                    <option value="Teknik Sipil">Teknik Sipil</option>
                    <option value="Arsitektur">Arsitektur</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Fisika">Fisika</option>
                    <option value="Informatika">Informatika</option>
                </select>
            </div>
            <button type="submit" id="add-btn" data-testid="submit">
                Add student
            </button>
        </form>
    );
};

export default Form;

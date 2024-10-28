import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "./App";

global.fetch = jest.fn();

describe("Render", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it("should show Loading component", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudents),
        });
        render(<App />);
        await waitFor(async () =>
            expect(await screen.findByText("Loading ...")).toBeTruthy()
        );
    });

    it("Should call correct path", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudents),
        });
        render(<App />);
        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("http://localhost:3001/student");
        });
    });

    it("should render all fetched items correctly", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudents),
        });
        const { container } = render(<App />);
        await screen.findByText("Djarot Purnomo");
        const rows = Array.from(
            container.querySelectorAll(".student-data-row")
        );
        const data = extractData(rows);

        expect(data).toEqual(
            mockedStudents.map((student) => {
                return student.fullname;
            })
        );
    });
});

describe("Add Student", () => {
    it("when submit should call fetch with correct url", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockedStudents),
        });

        render(<App />);

        await screen.findByText("Djarot Purnomo");

        const name = screen.getByTestId("name");
        fireEvent.change(name, { target: { value: "Henky" } });
        const date = screen.getByTestId("date");
        fireEvent.change(date, { target: { value: "1995-11-14" } });
        const gender = screen.getByTestId("gender");
        fireEvent.change(gender, { target: { value: "Male" } });
        const prody = screen.getByTestId("prody");
        fireEvent.change(prody, { target: { value: "Ekonomi" } });
        const submitButton = screen.getByTestId("submit");
        fireEvent.click(submitButton);
        const lastCall = fetch.mock.lastCall;
        const body = JSON.parse(lastCall[1].body);

        expect(lastCall[0]).toBe("http://localhost:3001/student");
        expect(lastCall[1].method).toBe("POST");
        expect(lastCall[1].headers["Content-Type"]).toBe("application/json");
        expect(body.fullname).toBe("Henky");
        expect(body.birthDate).toBe("1995-11-14");
        expect(body.gender).toBe("Male");
        expect(body.faculty).toBe("Fakultas Ekonomi");
        expect(body.programStudy).toBe("Ekonomi");

        global.fetch.mockResolvedValue({
            json: () =>
                Promise.resolve([
                    ...mockedStudents,
                    {
                        id: 11,
                        fullname: "Henky",
                        birthDate: "1995-11-14",
                        gender: "Male",
                        faculty: "Fakultas Ekonomi",
                        programStudy: "Ekonomi",
                    },
                ]),
        });
        await waitFor(() => screen.findByText("Henky"));
    });
});

describe("Delete Student", () => {
    it("when delete should call fetch with correct url", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockedStudents),
        });

        render(<App />);

        await screen.findByText("Djarot Purnomo");

        const deleteButton = screen.getByTestId("delete-1");
        fireEvent.click(deleteButton);
        const lastCall = fetch.mock.lastCall;

        expect(lastCall[0]).toBe("http://localhost:3001/student/1");
        expect(lastCall[1].method).toBe("DELETE");

        global.fetch = jest.fn((url) => {
            switch (url) {
                case "http://localhost:3001/student":
                    return Promise.resolve({
                        json: () => Promise.resolve(mockedDelete),
                    });
                case "http://localhost:3001/student/1":
                    return Promise.resolve({
                        json: () => Promise.resolve(mockedDelete),
                    });
                default:
                    break;
            }
        });

        await waitFor(() =>
            expect(screen.queryByText("Djarot Purnomo")).toBeNull()
        );
    });
});

const extractData = (rows) => {
    return rows
        .map((el) => {
            return Array.from(el.children)
                .filter((child) => {
                    return (
                        mockedStudents.filter((student) => {
                            return student.fullname === child.textContent;
                        }).length > 0
                    );
                })
                .map((child) => child.textContent);
        })
        .flat();
};

const mockedStudents = [
    {
        id: 1,
        fullname: "Djarot Purnomo",
        birthDate: "1993-10-28",
        gender: "Male",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Administrasi Bisnis",
    },
    {
        id: 2,
        fullname: "Rakanda Pangeran Nasution",
        birthDate: "1992-07-26",
        gender: "Male",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Administrasi Publik",
    },
    {
        id: 3,
        fullname: "Anshori Atmodiredjo",
        birthDate: "1996-11-01",
        gender: "Male",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Informatika",
    },
    {
        id: 4,
        fullname: "Angelia",
        birthDate: "1996-06-17",
        gender: "Female",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Administrasi Publik",
    },
    {
        id: 5,
        fullname: "Tuti Marsinah",
        birthDate: "1998-03-11",
        gender: "Female",
        faculty: "Fakultas Ekonomi",
        programStudy: "Ekonomi",
    },
    {
        id: 6,
        fullname: "Edizon",
        birthDate: "1982-01-31",
        gender: "Male",
        faculty: "Fakultas Ekonomi",
        programStudy: "Ekonomi",
    },
    {
        id: 7,
        fullname: "Vony Merdiana",
        birthDate: "1991-05-21",
        gender: "Female",
        faculty: "Fakultas Teknik",
        programStudy: "Teknik Sipil",
    },
    {
        id: 8,
        fullname: "Dea Christy Keliat",
        birthDate: "1994-02-27",
        gender: "Female",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Hubungan Internasional",
    },
    {
        id: 9,
        fullname: "Sekarini Mahyaswari",
        birthDate: "1996-02-01",
        gender: "Female",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Hubungan Internasional",
    },
    {
        id: 10,
        fullname: "Annisa Tahira",
        birthDate: "1996-09-01",
        gender: "Female",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Informatika",
    },
];

const mockedDelete = mockedStudents.filter((student) => student.id !== 1);

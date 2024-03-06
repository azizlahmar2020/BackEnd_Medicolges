const yup = require ("yup");

const studentSchema = yup.object({
    studentName: yup.string().required().min(3),
    StudentGrade: yup.number().positive().required(),
    })
;
    const studentSchemaUP = yup.object({
        studentName: yup.string().required().min(3),
        StudentGrade: yup.number().positive().required(),
        })

module.exports = studentSchema;
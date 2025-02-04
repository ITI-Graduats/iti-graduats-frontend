import * as Yup from "yup";

const nameRegex = /^[a-zA-Z\s]+$/;
const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
const mobileRegex = /^(010|011|012|015)\d{8}$/;
const cityRegex = /^[A-Za-z][a-zA-Z\s]*$/;
const facultyUniversityRegex = /^[a-zA-Z\s]+$/;
const courseRegex = /^[a-zA-Z\s_-]*$/;

const currentYear = new Date().getFullYear();
const initialIntakeYear = 1980;
const intakeCount = currentYear - initialIntakeYear;
export const intakeYearsOptions = Array.from(
  { length: intakeCount },
  (_, index) => ({
    value: intakeCount - index,
    label: (intakeCount - index).toString(),
  })
);

const createEmploymentTest = (fieldName) => {
  return Yup.string()
    .matches(
      /^[a-zA-Z\s_-]*$/,
      `${fieldName} must contain only English letters.`
    )
    .test("is-employed", `${fieldName} is required.`, function (value) {
      return this.parent.isEmployed ? !!value : true;
    });
};

const stringRequiredWithPattern = (
  pattern,
  invalidMessage,
  requiredMessage
) => {
  return Yup.string()
    .matches(pattern, invalidMessage)
    .required(requiredMessage);
};

const stepValidationSchemas = [
  Yup.object().shape({
    fullName: stringRequiredWithPattern(
      nameRegex,
      "Name must be in English and cannot contain special characters.",
      "Full Name is required."
    ),
    personalPhoto: Yup.mixed().required("personal Photo is required"),

    email: stringRequiredWithPattern(
      emailRegex,
      "Please enter a valid email address.",
      "Email is required."
    ),

    mobile: stringRequiredWithPattern(
      mobileRegex,
      "Please enter a valid Egyptian phone number (e.g., 01012345678).",
      "Mobile number is required."
    ),

    linkedin: Yup.string().url().optional(),

    cityOfBirth: stringRequiredWithPattern(
      cityRegex,
      "City of birth must be in English,cannot contain special characters.",
      "City of birth is required."
    ),
  }),

  Yup.object().shape({
    faculty: stringRequiredWithPattern(
      facultyUniversityRegex,
      "Faculty must be in English and cannot contain special characters.",
      "Faculty is required."
    ),

    university: stringRequiredWithPattern(
      facultyUniversityRegex,
      "University must be in English and cannot contain special characters.",
      "University is required."
    ),

    trackName: Yup.string().required("Track name is required."),
    branch: Yup.string().required("Branch is required."),

    program: Yup.string()
      .oneOf(
        [
          "Professional Training Program - (9 Months)",
          "Intensive Code Camp - (4 Months)",
        ],
        "Please select one of the two provided programs"
      )
      .required("Program is required."),

    itiGraduationYear: Yup.number()
      .required("ITI Graduation Year is required.")
      .min(1994, "Graduation year must be after 1993.")
      .max(
        new Date().getFullYear(),
        `Graduation year must be less than or equal to ${new Date().getFullYear()}.`
      ),

    intake: Yup.number()
      .required("Intake is required.")
      .oneOf(
        intakeYearsOptions.map((option) => option.value),
        "Invalid intake value."
      )
      .test(
        "valid-intake",
        "Invalid intake for the selected program.",
        function (value) {
          const { program } = this.parent;

          if (
            program === "Professional Training Program - (9 Months)" &&
            !value
          ) {
            return false;
          }

          return true;
        }
      ),

    round: Yup.string().test(
      "round-required-for-4-months",
      "Round is required for 4 Months program.",
      function (value) {
        const { program } = this.parent;

        if (program === "Intensive Code Camp - (4 Months)" && !value) {
          return false;
        }
        return true;
      }
    ),
  }),

  Yup.object().shape({
    preferredTeachingBranches: Yup.array()
      .of(Yup.string())
      .min(
        1,
        "Please choose at least one branch you're interested in teaching in"
      )
      .required("Preferred teaching branches are required."),

    preferredCoursesToTeach: Yup.array()
      .transform((value, originalValue) => {
        return typeof originalValue === "string" && originalValue === ""
          ? []
          : value;
      })
      .nullable()
      .test(
        "is-valid-course",
        "Preferred courses can only include letters, numbers, underscores, dashes, and spaces.",
        (value) => {
          if (!value || value.length === 0) return true;
          return value.every((course) => /^[a-zA-Z0-9-_ ]*$/.test(course));
        }
      ),

    interestedInTeaching: Yup.string()
      .oneOf(
        ["Business sessions", "Courses", "Both"],
        "Please select a valid teaching preference (Business sessions, Courses or both)."
      )
      .required("Please select your teaching preferences"),
  }),

  Yup.object().shape({
    isEmployed: Yup.boolean().required("Employment status is required."),

    fullJobTitle: createEmploymentTest("Job title"),
    companyName: createEmploymentTest("Company name"),

   yearsOfExperience: Yup.number().test(
      "is-employed",
      "Years of experience is required if you are employed.",
      function (value) {
        const { isEmployed } = this.parent;

        if (isEmployed) {
          return (
            (value >= 0 && value <= 50) ||
            this.createError({
              message: "Years of experience must be between 0 and 50.",
            })
          );
        }

        return true;
      }
    ),

    hasFreelanceExperience: Yup.boolean().required(
      "Please specify if you have worked as a freelancer before."
    ),

    freelancingIncome: Yup.string().test(
      "has-freelance",
      "Freelance gain is required .",
      function (value) {
        return this.parent.hasFreelanceExperience ? !!value : true;
      }
    ),
  }),
];

export default stepValidationSchemas;

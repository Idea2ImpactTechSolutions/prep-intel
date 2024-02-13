import { Award, Bike, Briefcase, Church, HeartHandshake, Home, Monitor, Star } from "lucide-react"

export const STUDENT_ONBOARDING_LINKS = [
    {
        id: crypto.randomUUID().toString(),
        title: 'Vitals',
        url: '/student/onboarding/vitals',
        isActive: false
    },
    {
        id: crypto.randomUUID().toString(),
        title: 'Schools',
        url: '/student/onboarding/schools',
        isActive: false
    },
    {
        id: crypto.randomUUID().toString(),
        title: 'Majors',
        url: '/student/onboarding/majors',
        isActive: false
    },
    {
        id: crypto.randomUUID().toString(),
        title: 'Extracurricular',
        url: '/student/onboarding/extracurricular',
        isActive: false
    },
    {
        id: crypto.randomUUID().toString(),
        title: 'Transcripts',
        url: '/student/onboarding/transcripts',
        isActive: false
    },
]

export const POPULAR_UNIVERSITIES = [
    {
        id: crypto.randomUUID().toString(),
        name: 'University of Gorgia',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'New York University',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'University of Carlifonia',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'University of Texas',
        isChecked: false
    },
]

export const UNIVERSITIES_NEAR_BY = [
    {
        id: crypto.randomUUID().toString(),
        name: 'University of Alabama Birmingham',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'University of Alabama',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Auburn University',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Samford University',
        isChecked: false
    },
]

export const POPULAR_MAJOR = [
    {
        id: crypto.randomUUID().toString(),
        name: 'Business',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Nursing',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Medicine/Pre-Medicine',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Government/Political Science',
        isChecked: false
    },
]

export const PROFESSIONAL_PT_PROGRAMS = [
    {
        id: crypto.randomUUID().toString(),
        name: 'Pre-Medicine',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Pre-Dentistry',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Pre-Engineering',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Pre-Veterinary Medicine',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Pre-Optometry',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Pre-Law',
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Pre-Physical Therapy',
        isChecked: false
    },
]

export const EXTRACURRICULAR_ACTIVITIES = [
    {
        id: crypto.randomUUID().toString(),
        name: 'Apprenticeships',
        icon: <Monitor />,
        isChecked: false,
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Community Volunteering',
        icon: <HeartHandshake />,
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Debate',
        icon: <Award />,
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Employment',
        icon: <Briefcase />,
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'JROTC',
        icon: <Star />,
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Sports & Athletics',
        icon: <Bike />,
        isChecked: false
    },
]


export const EXTRACURRICULAR_INTEREST = [
    {
        id: crypto.randomUUID().toString(),
        name: 'Apprenticeships',
        icon: <Monitor />,
        isChecked: false,
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Community Volunteering',
        icon: <HeartHandshake />,
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Debate',
        icon: <Award />,
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Employment',
        icon: <Briefcase />,
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Campus Ambassador',
        icon: <Church />,
        isChecked: false
    },
    {
        id: crypto.randomUUID().toString(),
        name: 'Residential Assistant',
        icon: <Home />,
        isChecked: false
    },
]


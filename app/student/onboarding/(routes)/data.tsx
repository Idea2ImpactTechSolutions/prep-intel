import { Award, Bike, Briefcase, Church, HeartHandshake, Home, Monitor, Star } from "lucide-react"
import { v4 as uuid } from 'uuid';


export const STUDENT_ONBOARDING_LINKS = [
    {
        id: uuid(),
        title: 'Vitals',
        url: '/student/onboarding/vitals',
        isActive: false
    },
    {
        id: uuid(),
        title: 'Schools',
        url: '/student/onboarding/schools',
        isActive: false
    },
    {
        id: uuid(),
        title: 'Majors',
        url: '/student/onboarding/majors',
        isActive: false
    },
    {
        id: uuid(),
        title: 'Extracurricular',
        url: '/student/onboarding/extracurricular',
        isActive: false
    },
    {
        id: uuid(),
        title: 'Transcripts',
        url: '/student/onboarding/transcripts',
        isActive: false
    },
]

export const POPULAR_UNIVERSITIES = [
    {
        id: uuid(),
        name: 'University of Gorgia',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'New York University',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'University of Carlifonia',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'University of Texas',
        isChecked: false
    },
]

export const UNIVERSITIES_NEAR_BY = [
    {
        id: uuid(),
        name: 'University of Alabama Birmingham',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'University of Alabama',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Auburn University',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Samford University',
        isChecked: false
    },
]

export const POPULAR_MAJOR = [
    {
        id: uuid(),
        name: 'Business',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Nursing',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Medicine/Pre-Medicine',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Government/Political Science',
        isChecked: false
    },
]

export const PROFESSIONAL_PT_PROGRAMS = [
    {
        id: uuid(),
        name: 'Pre-Medicine',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Pre-Dentistry',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Pre-Engineering',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Pre-Veterinary Medicine',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Pre-Optometry',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Pre-Law',
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Pre-Physical Therapy',
        isChecked: false
    },
]

export const EXTRACURRICULAR_ACTIVITIES = [
    {
        id: uuid(),
        name: 'Apprenticeships',
        icon: <Monitor />,
        isChecked: false,
    },
    {
        id: uuid(),
        name: 'Community Volunteering',
        icon: <HeartHandshake />,
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Debate',
        icon: <Award />,
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Employment',
        icon: <Briefcase />,
        isChecked: false
    },
    {
        id: uuid(),
        name: 'JROTC',
        icon: <Star />,
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Sports & Athletics',
        icon: <Bike />,
        isChecked: false
    },
]


export const EXTRACURRICULAR_INTEREST = [
    {
        id: uuid(),
        name: 'Apprenticeships',
        icon: <Monitor />,
        isChecked: false,
    },
    {
        id: uuid(),
        name: 'Community Volunteering',
        icon: <HeartHandshake />,
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Debate',
        icon: <Award />,
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Employment',
        icon: <Briefcase />,
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Campus Ambassador',
        icon: <Church />,
        isChecked: false
    },
    {
        id: uuid(),
        name: 'Residential Assistant',
        icon: <Home />,
        isChecked: false
    },
]


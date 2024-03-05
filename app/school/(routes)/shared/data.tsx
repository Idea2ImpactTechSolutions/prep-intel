import { v4 as uuid } from 'uuid';


export const TAB_LINKS = [
    {
        id: uuid(),
        title: 'Dashboard',
        url: 'dashboard',
        isActive: true
    },
    {
        id: uuid(),
        title: 'Recruits',
        url: 'recruits',
        isActive: false
    },
    {
        id: uuid(),
        title: 'My School',
        url: 'school-profile',
        isActive: false
    },
]

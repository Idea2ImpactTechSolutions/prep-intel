import { v4 as uuid } from 'uuid';

export const TAB_LINKS = [
    {
        id: uuid(),        
        title: 'Dashboard',
        url: '/recruiter/dashboard',
        isActive: false
    },
    {
        id: uuid(), 
        title: 'Connections',
        url: '/recruiter/connections',
        isActive: false
    },
]

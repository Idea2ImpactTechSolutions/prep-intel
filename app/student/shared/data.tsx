import { v4 as uuid } from 'uuid';

export const TAB_LINKS = [
    {
        id: uuid(),
        title: 'Dashboard',
        url: '/student/dashboard',
        isActive: false
    },
    {
        id: uuid(),
        title: 'Explore',
        url: '/student/explore',
        isActive: false
    },
    {
        id: uuid(),
        title: 'Connections',
        url: '/student/connections',
        isActive: false
    },
]

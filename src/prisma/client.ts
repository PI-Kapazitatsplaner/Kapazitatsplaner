import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

let mockUserSub = 'c2842822-67f5-4759-8db8-a431ddfc3500';

export function setTestUser(mockUserSubNew: string) {
    console.log('Setting test user to: ' + mockUserSubNew);
    
    mockUserSub = mockUserSubNew;
}

export function getTestUserSub() {
    return mockUserSub;
}


export default prisma;
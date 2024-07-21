export type UserProfileType = {
    id: number,
    firstName: string,
    lastName: string,
    username: string | null,
    statusText: string | null,
    dateOfBirth: string | null,
    avatarUrl: string | null,
    lastSeenAt: string,
    gender: 'MALE' | 'FEMALE',
}

export type MyUserProfileType = UserProfileType & {
    createdAt: string,
    updatedAt: string,
}
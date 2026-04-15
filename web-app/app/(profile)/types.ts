export type Preference = {
    preference_id: string;
    name: string;
    value: number;
}

export type Hobby = {
    hobby_id: string;
    name: string;
}


export type HobbyCategoryGroup = {
    category: string;
    hobbies: Hobby[];
};

export type Major = {
    major_id: string;
    name: string;
}

export type UserProfile = {
    user_id: string;
    is_active: boolean;
    fname: string;
    lname: string;
    gender: string;
    avatar_url: string | null;
    bio: string;
    majors: Major[];
    year: number;
    created_at: string;
    last_edited_at: string;
    hobbies: Hobby[];
    preferences: Preference[];
    isAdmin?: boolean;
}
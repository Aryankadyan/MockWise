import { FieldValue, Timestamp, } from "firebase/firestore"

export interface User {
    id: string
    name: string
    email: string
    imageUrl: string
    createdAt: Timestamp | FieldValue
    updatedAt: Timestamp | FieldValue
}

export interface Interview {
    id: string;
    position: string;
    description: string;
    experience: number;
    userId: string;
    techStack: string;
    questions: {id: string, question: string, answer: string }[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}


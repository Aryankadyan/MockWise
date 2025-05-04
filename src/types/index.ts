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
export interface UserAnswer {
    id: string;
    mockIdRef: string
    question: string
    correct_ans: string
    user_ans: string
    feedback: string
    rating: number
    userId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}


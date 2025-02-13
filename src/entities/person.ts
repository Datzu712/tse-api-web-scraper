export interface PersonDatavalues {
    fullName: string;
    dni: string;
    dateOfBirth: string;
    nationality: string;
    age: string;
    isMarginal: 'SI' | 'NO';
    alias?: string;
    fatherName: string;
    fatherDni?: string;
    motherName: string;
    motherDni?: string;
}

export class Person {
    fullName: string;
    dni: string;
    nationality: string;
    age: number;
    birthDay: string;
    isMarginal: boolean;
    alias: string | null;
    fatherName: string;
    fatherDni: string | null;
    motherName: string;
    motherDni: string | null;

    father: Person | null = null;
    mother: Person | null = null;
    children: Person[] = [];

    constructor(data: PersonDatavalues) {
        this.fullName = data.fullName;
        this.dni = data.dni;
        this.nationality = data.nationality;
        this.age = parseInt(data.age);
        this.birthDay = data.dateOfBirth;
        this.isMarginal = data.isMarginal === 'SI';
        this.alias = data.alias || null;
        this.fatherName = data.fatherName;
        this.fatherDni = data.fatherDni || null;
        this.motherName = data.motherName;
        this.motherDni = data.motherDni || null;
    }
}

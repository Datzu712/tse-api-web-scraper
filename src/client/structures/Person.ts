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
    readonly fullName: string;
    readonly dni: string;
    readonly nationality: string;
    readonly age: number;
    readonly birthDay: string;
    readonly isMarginal: boolean;
    readonly alias: string | null;
    readonly fatherName: string;
    readonly fatherDni: string | null;
    readonly motherName: string;
    readonly motherDni: string | null;

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

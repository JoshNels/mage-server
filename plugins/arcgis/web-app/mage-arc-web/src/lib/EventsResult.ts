export class EventResult {
    name: string;
    id: number;
    forms: FormResult[];
}

export class FormResult {
    name: string;
    fields: FieldResult[];
}

export class FieldResult {
    title: string;
}